import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const gstBreakdownSchema = new mongoose.Schema(
    {
        gstPercentage: { type: Number, default: 0 },
        stateGSTValue: { type: Number, default: 0 },
        centralGSTValue: { type: Number, default: 0 },
    },
    { _id: false }
);

const invoiceItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },              // e.g. "Kaju Katli", "MestoKart Commission"
        netPrice: { type: Number, required: true },
        quantity: { type: Number, default: 0 },
        total: { type: Number, required: true },
        ...gstBreakdownSchema.obj,
    },
    { _id: false }
);

const sellerInvoiceSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuid(),
        },

        orderId: { type: String, required: true, index: true },
        orderDate: { type: String, required: true },
        invoiceNumber: { type: String }, // Optional for GST invoice number series
        invoiceUrl: { type: String },
        invoiceDate: { type: String, required: true },
        settlementId: { type: String }, // ID of the settlement this invoice is part of

        status: {
            type: String,
            enum: ["Pending", "Cancelled", "Paid", "Failed"],
            default: "Pending",
        },
        placeOfSupply: {
            //stateCode: { type: String, required: true }, // e.g. "KA", "MH"
            cityName: { type: String, required: true }, // e.g. "Bangalore", "Mumbai"
            stateName: { type: String, required: true }, // e.g. "Karnataka", "Maharashtra"
        },
        seller: {
            storeId: { type: String, required: true, ref: "Store" }, // Store ID of the seller
            location: {
                //stateCode: { type: String, required: true }, // e.g. "KA", "MH"
                stateName: { type: String, required: true }, // e.g. "Karnataka", "Maharashtra"
            },
            gstin: { type: String, required: false }, // GSTIN of the seller
            pan: { type: String, required: false }, // Optional PAN of the seller
        },
        buyer: {
            location: {
                //stateCode: { type: String, required: true }, // e.g. "KA", "MH"
                stateName: { type: String, required: true }, // e.g. "Karnataka", "Maharashtra"
            },
            billingLocation: {
                stateName: { type: String, required: false }, // e.g. "Karnataka", "Maharashtra"
            },
            gstin: { type: String, required: false }, // Optional GSTIN of the buyer
        },
        isLogisticsSettlementRequired: { type: Boolean, default: false }, // Whether logistics settlement is needed for this invoice
        financialBreakup: {
            productNetTotal: { type: Number, required: false, default: 0 },     // Sum of product line items
            gstOnProducts: { type: Number, required: false, default: 0 },
            platformCommissionPercentage: { type: Number, required: false, default: 0 },
            platformCommissionAmount: { type: Number, required: false, default: 0 }, // MestoKart commission
            gstOnCommission: { type: Number, required: false, default: 0 },
            tdsDeducted: { type: Number, required: false, default: 0 },
            tcsDeducted: { type: Number, required: false, default: 0 },
            deliveryCharges: { type: Number, required: false, default: 0 }, // e.g. delivery fee charged to buyer
            deliveryChargesGST: { type: Number, required: false, default: 0 }, // GST on delivery charges
            packagingCharges: { type: Number, required: false, default: 0 }, // e.g. packaging fee charged to buyer
            packagingChargesGST: { type: Number, required: false, default: 0 }, // GST on packaging charges
            netPayoutToSeller: { type: Number, required: false, default: 0 },
            //totalInvoiceAmount: { type: Number, required: false }, // full amount received from buyer
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

const SellerInvoice = mongoose.model("sellerinvoice", sellerInvoiceSchema);
export default SellerInvoice;