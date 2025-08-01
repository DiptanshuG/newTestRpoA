import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const fulfillments = new mongoose.Schema(
  {
    type: { type: String }, //Delivery, Pickup
    fulfillment_id: { type: String, default: () => uuid() },
    category: { type: String }, //Immediate Delivery, Standard Delivery
    deliveryParams: [
      {
        distance: { type: String },
        deliveryTime: {
          value: { type: Number },
          unit: { type: String, default: "minutes" },
        },
        deliveryCharge: {
          value: { type: Number },
          currency: { type: String, default: "INR" },
        },
        minimumOrderValue: { type: Number },
      },
    ],
  },
  { _id: false }
);

const providerSchema = new mongoose.Schema(
  {
    //Users who has login ability should go under User schema
    _id: {
      type: String,
      required: true,
      default: () => uuid(),
    },
    businessName: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Verification Pending", "Inventory Pending"],
      default: "Verification Pending",
    },
    address: {
      building: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      area_code: { type: String },
      locality: { type: String },
      street: { type: String },
    },
    contactDetails: {
      email: { type: String },
      mobile: { type: String }
    },
    addressProof: { type: String },
    idProof: { type: String },
    bankDetails: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      IFSC: { type: String },
      bankName: { type: String },
      branchName: { type: String },
      upiId: { type: String },
      cancelledCheque: { type: String },
    },
    PAN: { PAN_NO: { type: String }, proof: { type: String } },
    GSTN: { GSTN: { type: String }, proof: { type: String } },
    FSSAI: {
      FSSAI_NO: { type: String },
      proof: { type: String },
    },
    networkLogisticsSupportRequired: { type: Boolean, default: false },
    minimum_order_value: { type: Number },
    fulfillments: {
      type: [fulfillments],
    },
    storeOndcStatus: {
      label: { type: String, required: true, default: "enable" },
      timestamp: {
        type: String,
        required: true,
        default: () => new Date().toISOString(),
      },
    },
    stores: [{ type: String, ref: "Store" }],
    platformAgreements: {
      commissionPercentage: { type: Number, default: 2.5 },
    }
  },
  {
    strict: true,
    timestamps: true,
  }
);

providerSchema.index({ name: 1, shortCode: 1 }, { unique: false });

const Provider = mongoose.model("Provider", providerSchema);
export default Provider;
