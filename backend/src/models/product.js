import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const productSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuid(),
        },
        quantity: { type: Number },
        lowStockThreshold: { type: Number },
        maxAllowedQty: { type: Number },
        price: { type: Number },
        store: { type: String, ref: "Store" },
        createdBy: { type: String },
        masterProductId: { type: String },
        enabled: { type: Boolean, default: false },
        manuallyCreated: { type: Boolean, default: false },
    },
    {
        strict: true,
        timestamps: true,
    }
);

export default mongoose.model("Product", productSchema);