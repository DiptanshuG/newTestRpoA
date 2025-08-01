import Settlement, { SETTLEMENT_STATE } from '../models/settlement.model.js';
import Order, { ORDER_STATE } from '../models/order.js';
import SellerInvoice from '../models/sellerInvoice.model.js';

export const runSettlementFlow = async () => {
    const currentDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(currentDate.getDate() - 15);

    const toDate = new Date();
    toDate.setDate(currentDate.getDate() - 2);

    const eligibleOrders = await Order.find({
        state: ORDER_STATE.COMPLETED,
        settlementId: { $exists: false },
        createdAt: { $gte: fromDate, $lte: toDate }
    });

    const storeOrderMap = {};

    for (const order of eligibleOrders) {
        if (!storeOrderMap[order.store]) {
            storeOrderMap[order.store] = [];
        }
        storeOrderMap[order.store].push(order);
    }

    const settlements = [];

    for (const storeId in storeOrderMap) {
        const orders = storeOrderMap[storeId];
        const orderIds = orders.map(o => o._id.toString());
        const invoiceIds = orders.map(o => o.sellerInvoiceId); // assuming it's in order

        const invoices = await SellerInvoice.find({ _id: { $in: invoiceIds } });

        const totalOrderAmount = invoices.reduce((sum, inv) => sum + inv.totalInvoiceAmount, 0);
        const totalCommission = invoices.reduce((sum, inv) => sum + (inv.financialBreakup?.commission || 0), 0);
        const totalGSTOnCommission = invoices.reduce((sum, inv) => sum + (inv.financialBreakup?.gstOnCommission || 0), 0);
        const totalTDS = invoices.reduce((sum, inv) => sum + (inv.financialBreakup?.tds || 0), 0);
        const totalTCS = invoices.reduce((sum, inv) => sum + (inv.financialBreakup?.tcs || 0), 0);
        const totalPayout = invoices.reduce((sum, inv) => sum + (inv.totalPayout || 0), 0);

        const settlement = await Settlement.create({
            storeId,
            fromDate,
            toDate,
            orderIds,
            invoiceIds,
            totals: {
                totalOrders: orders.length,
                totalOrderAmount,
                totalCommission,
                totalGSTOnCommission,
                totalTDS,
                totalTCS,
                totalPayout
            },
            status: SETTLEMENT_STATE.INITIATED
        });

        await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { settlementId: settlement.settlementId } }
        );

        settlements.push(settlement);
    }

    return { message: 'Settlement flow executed successfully', settlements };
};

export const getSettlementsByStore = async (storeId) => {
    return await Settlement.find({ storeId }).sort({ createdAt: -1 });
};

export const getSettlementDetails = async (settlementId) => {
    return await Settlement.findOne({ settlementId });
};

export const updateSettlementStatus = async (settlementId, data) => {
    const update = {
        status: data.status,
        remarks: data.remarks || '',
        utrNumber: data.utrNumber || null,
        settlementDate: new Date(),
        settledBy: data.settledBy || 'system'
    };

    return await Settlement.findOneAndUpdate({ settlementId }, update, { new: true });
};
