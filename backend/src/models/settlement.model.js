import mongoose from 'mongoose';
import { v4 as uuid } from "uuid";

export const SETTLEMENT_STATE = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    COMPLETED: "Completed",
    FAILED: "Failed",
};

const settlementSchema = new mongoose.Schema(
    {
        settlementId: {
            type: String,
            required: true,
            default: () => uuid(),
        },
        storeId: {
            type: String,
            required: true,
            ref: 'Store', // reference to the store associated with the seller
        },

        fromDate: {
            type: Date,
            required: true,
        },

        toDate: {
            type: Date,
            required: true,
        },

        orderIds: [
            {
                type: String,
                ref: 'Order',
            },
        ],

        invoiceIds: [
            {
                type: String,
                ref: 'SellerInvoice',
            },
        ],

        totals: {
            totalOrders: { type: Number, required: true },
            totalOrderAmount: { type: Number, required: true }, // sum of totalInvoiceAmount from invoices
            totalCommission: { type: Number, required: true },
            totalGSTOnCommission: { type: Number, default: 0 },
            totalTDS: { type: Number, default: 0 },
            totalTCS: { type: Number, default: 0 },
            totalPayout: { type: Number, required: true }, // final amount paid to seller
        },

        utrNumber: {
            type: String,
            default: null, // UTR/Transaction reference number
        },

        settlementDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: Object.values(SETTLEMENT_STATE),
            default: SETTLEMENT_STATE.PENDING,
        },

        remarks: {
            type: String,
            default: '',
        },

        settledBy: {
            type: String,
            default: null, // Admin or system user who processed it
        },
    },
    {
        timestamps: true,
    }
);

const Settlement = mongoose.model('Settlement', settlementSchema);
export default Settlement;
