import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const masterCatalog = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuid(),
        },
        //id: { type: String },
        productCode: { type: String },
        productName: { type: String, required: false },
        MRP: { type: Number },
        HSNCode: { type: String },
        brand: { type: String },
        GST_Percentage: { type: Number },
        ondcSuperCategory: { type: String },
        productCategory: { type: String },
        productSubcategory1: { type: String },
        productSubcategory2: { type: String },
        productSubcategory3: { type: String },
        barcode: { type: String },
        //    packQty: { type: String },
        weight: { type: String },
        UOM: { type: String }, //units of measure
        countryOfOrigin: { type: String },
        length: { type: String },
        breadth: { type: String },
        height: { type: String },
        returnWindow: { type: String },
        isVegetarian: { type: Boolean },
        manufacturerName: { type: String },
        FSSAI: {
            type: [String],
        },
        reuploadImageStatus: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending',
        },
        manufacturedDate: { type: String },
        manufacturerAddress: { type: String },
        expiryDuration: { type: String },
        nutritionalInfo: { type: String },
        additiveInfo: { type: String },
        instructions: { type: String },
        isCancellable: { type: Boolean, default: true },
        isReturnable: { type: Boolean, default: true },
        availableOnCod: { type: Boolean, default: false },
        longDescription: { type: String },
        description: { type: String },
        images: { type: Array },
        createdBy: { type: String },
        published: { type: Boolean, default: false },
    },
    {
        strict: true,
        timestamps: true,
    }
);

// Add separate indexes
//masterCatalog.index({ _id: 1 });  // Though _id is automatically indexed, this is safe
masterCatalog.index({ productCategory: 1 });


const MasterCatalogModel = mongoose.model("MasterCatalog", masterCatalog);

//MasterCatalogModel.createIndexes({ productName: "text", description: "text" });

export default MasterCatalogModel;