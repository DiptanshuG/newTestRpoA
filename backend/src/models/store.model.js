import mongoose from "mongoose";

import { v4 as uuid } from "uuid";
export const STORE_LOGO_DEFAULT = "https://d2e3yo6hu5cdgs.cloudfront.net/stores/default_store_logo.png";

// Location schema for geospatial data
const locationSchema = new mongoose.Schema({
  address: {
    building: String,
    city: String,
    state: String,
    country: String,
    area_code: String,
    locality: String,
    street: String,
  },
  gps: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (value) {
          const [lat, lng] = value;
          return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
        },
        message: (props) => `Invalid coordinates: [${props.value}].`
      }
    }
  }
}, { _id: false });


// Main store schema
const storeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: () => uuid(),
    },
    provider: { type: String, ref: "Provider" },
    category: {
      type: String,
      required: true,
      default: "Grocery",
    },
    acceptOrders: { type: Boolean, required: true, default: false },
    logo: {
      type: String,
      default: STORE_LOGO_DEFAULT,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    serviceability: {
      locationAvailabilityPANIndia: { type: Boolean },
      type: { type: String, default: "10", required: true }, //enum - "10" (hyperlocal), "11" (intercity), "12" (pan-India), "13" (polygon);
      radius: {
        value: {
          type: Number,
          required: true,
          default: 5,
        },
        unit: {
          type: String,
          required: true,
          default: "km",
        },
      },
    },
    city: {
      city: { type: String },
      code: { type: String },
    },
    schedule: {
      openDays: { type: [String], required: false },
      timings: {
        start: { type: String }, //default: "0000"
        end: { type: String }, //default: "2359"
      },
      deliveryTimings: {
        start: { type: String }, //default: "0000"
        end: { type: String }, //default: "2359"
      },
      closedDays: { type: [String], default: [] },
      //order accept / processing date range below
      orderAcceptDayRange: {
        day_from: { type: String }, // default: "1"
        day_to: { type: String } // default: "7"
      }
    },
    defaultCancellable: { type: Boolean, default: true },
    defaultReturnable: { type: Boolean, default: true },
    contactDetails: {
      email: { type: String },
      mobile: { type: String },
    },
    time_to_ship: {
      value: {
        type: Number,
        required: true,
        default: 1,
      },
      unit: {
        type: String,
        required: true,
        default: "days",
      },
    },
    storeOndcStatus: {
      label: { type: String, required: true, default: "enable" },
      timestamp: {
        type: String,
        required: true,
        default: () => new Date().toISOString(),
      },
    },
    storeStatus: { type: String },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
storeSchema.index({ "location.gps": "2dsphere" });

const Store = mongoose.model("Store", storeSchema);
export default Store;
