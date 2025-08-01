import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

export const ORDER_STATE = {
  CREATED: "Created",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In-progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  CANCELLED: "Cancelled",
};

// Address Schema used in billing and fulfillment locations.
const addressSchema = new mongoose.Schema(
  {
    area_code: { type: String },
    building: { type: String },
    city: { type: String },
    country: { type: String },
    locality: { type: String },
    name: { type: String },
    state: { type: String },
    street: { type: String },
  },
  { _id: false }
);

// Billing Schema.
const billingSchema = new mongoose.Schema(
  {
    address: addressSchema,
    email: { type: String },
    name: { type: String },
    phone: { type: String },
    created_at: { type: String },
    updated_at: { type: String },
  },
  { _id: false }
);

// Item Schema.
const itemSchema = new mongoose.Schema(
  {
    fulfillment_id: { type: String },
    id: { type: String },
    quantity: {
      count: { type: Number },
    },
  },
  { _id: false }
);

// Quote Breakup Schema.
const quoteBreakupSchema = new mongoose.Schema(
  {
    "@ondc/org/item_id": { type: String },
    "@ondc/org/item_quantity": {
      count: { type: Number },
    },
    "@ondc/org/title_type": { type: String },
    title: { type: String },
    price: {
      currency: { type: String },
      value: { type: String },
    },
    // Optional nested item pricing
    item: {
      price: {
        currency: { type: String },
        value: { type: String },
      },
    },
  },
  { _id: false }
);

// Quote Schema.
const quoteSchema = new mongoose.Schema(
  {
    breakup: [quoteBreakupSchema],
    price: {
      currency: { type: String },
      value: { type: String },
    },
    ttl: { type: String },
  },
  { _id: false }
);

// Tag List Schema.
const tagListSchema = new mongoose.Schema(
  {
    code: { type: String },
    value: { type: String },
  },
  { _id: false }
);

// Tag Schema.
const tagSchema = new mongoose.Schema(
  {
    code: { type: String },
    list: [tagListSchema],
  },
  { _id: false }
);

// Fulfillment Schema.
const fulfillmentSchema = new mongoose.Schema(
  {
    "@ondc/org/TAT": { type: String },
    "@ondc/org/provider_name": { type: String },
    id: { type: String },
    type: { type: String },
    tracking: { type: Boolean },
    // Start portion of the fulfillment.
    start: {
      contact: {
        email: { type: String },
        phone: { type: String },
      },
      location: {
        address: {
          area_code: { type: String },
          building: { type: String },
          city: { type: String },
          country: { type: String },
          locality: { type: String },
          name: { type: String },
          state: { type: String },
        },
        descriptor: {
          name: { type: String },
        },
        gps: { type: String },
        id: { type: String },
      },
    },
    // End portion of the fulfillment.
    end: {
      contact: {
        email: { type: String },
        phone: { type: String },
      },
      location: {
        address: addressSchema,
        gps: { type: String },
      },
      person: {
        name: { type: String },
      },
      authorization: {
        type: { type: String }, //OTP
        token: { type: String }
      }
    },
    state: {
      descriptor: {
        code: { type: String },
      },
    },
    tags: [tagSchema],
  },
  { _id: false }
);

// Settlement Details Schema for Payment.
const settlementDetailSchema = new mongoose.Schema(
  {
    bank_name: { type: String },
    beneficiary_name: { type: String },
    branch_name: { type: String },
    settlement_bank_account_no: { type: String },
    settlement_counterparty: { type: String },
    settlement_ifsc_code: { type: String },
    settlement_phase: { type: String },
    settlement_type: { type: String },
    upi_address: { type: String },
  },
  { _id: false }
);

// Payment Schema.
const paymentSchema = new mongoose.Schema(
  {
    "@ondc/org/buyer_app_finder_fee_amount": { type: String },
    "@ondc/org/buyer_app_finder_fee_type": { type: String },
    "@ondc/org/settlement_basis": { type: String },
    "@ondc/org/settlement_details": [settlementDetailSchema],
    "@ondc/org/settlement_window": { type: String },
    "@ondc/org/withholding_amount": { type: String },
    collected_by: { type: String },
    params: {
      amount: { type: String },
      currency: { type: String },
      transaction_id: { type: String },
    },
    status: { type: String },
    type: { type: String },
  },
  { _id: false }
);

// Document Schema.
const documentSchema = new mongoose.Schema(
  {
    label: { type: String },
    url: { type: String },
    id: { type: String },
  },
  { _id: false }
);
// Order Schema.
const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: () => uuid(),
    },

    // Existing fields preserved...
    billing: billingSchema,
    provider: {
      id: { type: String },
      locations: [
        {
          _id: false,
          id: { type: String },
        },
      ],
    },
    items: [itemSchema],
    transactionId: { type: String },
    quote: quoteSchema,
    fulfillments: [fulfillmentSchema],
    payment: paymentSchema,
    deliveryDistance: {
      type: String
    },
    state: {
      type: String,
      enum: Object.values(ORDER_STATE),
    },
    orderId: { type: String },
    deliveryOTP: { type: String, required: true, length: 4 },

    // Cancellation
    cancellation: {
      cancelled_by: { type: String },
      reason: {
        id: { type: String },
      },
    },

    store: { type: String, ref: "Store" },
    documents: [documentSchema],
    tags: [tagSchema],
    sellerInvoiceId: String,
    settlementId: String,
    isCancelledOrReturned: Boolean,
  },
  {
    strict: true,
    timestamps: true,
  }
);

// Index for fast lookup
orderSchema.index({ orderId: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;