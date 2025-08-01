import Settlement, { SETTLEMENT_STATE } from '../models/settlement.model.js';
import Order, { ORDER_STATE } from '../models/order.js';
import SellerInvoice from '../models/SellerInvoice.model.js';
import Product from '../models/product.js';
import MasterCatalogModel from '../models/masterCatalog.js';
import Provider from '../models/provider.model.js';

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
        const invoiceIds = orders.map(o => o.sellerInvoiceId);

        let invoices = await SellerInvoice.find({ _id: { $in: invoiceIds } });

        invoices = invoices.map((invoice) => {
            const fb = invoice.financialBreakup;

            const totalOrderAmount =
                (fb.productNetTotal || 0) +
                (fb.gstOnProducts || 0) +
                (fb.deliveryCharges || 0) +
                (fb.deliveryChargesGST || 0) +
                (fb.packagingCharges || 0) +
                (fb.packagingChargesGST || 0);

            return {
                ...invoice,
                financialBreakup: {
                    ...fb,
                    totalOrderAmount,
                }
            };
        });

        const totalOrderAmount = invoices.reduce((sum, inv) => sum + (Number(inv.financialBreakup?.totalOrderAmount) || 0), 0);
        const totalCommission = invoices.reduce((sum, inv) => sum + (Number(inv.financialBreakup?.platformCommissionAmount) || 0), 0);
        const totalGSTOnCommission = invoices.reduce((sum, inv) => sum + (Number(inv.financialBreakup?.gstOnCommission) || 0), 0);
        const totalTDS = invoices.reduce((sum, inv) => sum + (Number(inv.financialBreakup?.tdsDeducted) || 0), 0);
        const totalTCS = invoices.reduce((sum, inv) => sum + (Number(inv.financialBreakup?.tcsDeducted) || 0), 0);
        const totalPayout = invoices.reduce((sum, inv) => sum + (Number(inv.financialBreakup?.netPayoutToSeller) || 0), 0);

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
            status: SETTLEMENT_STATE.PENDING
        });

        await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { settlementId: settlement.settlementId } }
        );

        settlements.push(settlement);
    }

    return { message: 'Settlement flow executed successfully', settlements };
};

export const getAllSettlements = async () => {
    return await Settlement.find({}).sort({ createdAt: -1 });
};

export const getSettlementDetails = async (settlementId) => {
    // Step 1: Get the settlement with populated orders 
    const settlement = await Settlement.findOne({ settlementId })
        .populate({
            path: 'orderIds',
        })
        .lean();

    if (!settlement) {
        throw new Error('Settlement not found');
    }

    // Step 2: Extract all product IDs from order items
    const allProductIds = settlement.orderIds
        .flatMap(order => order.items.map(item => item.id))
        .filter(Boolean);

    // Step 3: Fetch only required product fields
    const products = await Product.find({ _id: { $in: allProductIds } })
        .select('_id price masterProductId')
        .lean();

    // Step 4: Extract master product IDs
    const allMasterProductIds = products
        .map(p => p.masterProductId)
        .filter(Boolean);

    // Step 5: Fetch only required master product fields
    const masterProducts = await MasterCatalogModel.find({ _id: { $in: allMasterProductIds } })
        .select('_id images')
        .lean();

    // Step 6: Extract unique provider IDs
    const providerIds = [
        ...new Set(
            settlement.orderIds
                .map(order => order.provider?.id)
                .filter(Boolean)
        )
    ];

    // Step 7: Fetch only provider business names
    const providers = await Provider.find({ _id: { $in: providerIds } })
        .select('_id businessName')
        .lean();

    // Step 8: Create lookup maps
    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    const masterProductMap = new Map(masterProducts.map(mp => [mp._id.toString(), mp]));
    const providerMap = new Map(providers.map(p => [p._id, p.businessName]));

    // Step 9: Enrich each order with product, masterProduct, providerBusinessName
    settlement.orderIds.forEach(order => {
        // Attach provider business name
        const providerId = order.provider?.id;
        order.businessName = providerMap.get(providerId) || null;

        // Attach enriched product to each item
        order.items = order.items.map(item => {
            const product = productMap.get(item.id) || null;
            const masterProduct = product?.masterProductId
                ? masterProductMap.get(product.masterProductId.toString()) || null
                : null;

            return {
                ...item,
                product: {
                    _id: product?._id || null,
                    price: product?.price || null,
                    masterProduct: {
                        images: masterProduct?.images || [],
                    },
                },
            };
        });
    });

    return settlement;
};

export const updateSettlementStatus = async (settlementId, data) => {
    const update = {
        status: data.status,
        remarks: data.remarks || '',
        utrNumber: data.utrNumber || null,
        settlementDate: new Date(),
        settledBy: data.settledBy
    };

    return await Settlement.findOneAndUpdate({ settlementId }, update, { new: true });
};

export const clearSettlementReferences = async () => {
    const orderResult = await Order.updateMany(
        { settlementId: { $exists: true } },
        { $unset: { settlementId: "" } }
    );

    const invoiceResult = await SellerInvoice.updateMany(
        { settlementId: { $exists: true } },
        { $unset: { settlementId: "" } }
    );

    await Settlement.deleteMany({});

    return {
        ordersModified: orderResult.modifiedCount,
        invoicesModified: invoiceResult.modifiedCount,
    };
};