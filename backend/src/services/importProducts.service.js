import * as XLSX from 'xlsx';
import MasterCatalogModel from '../models/masterCatalog.js';
import ProductModel from '../models/product.js';
import { v4 as uuid } from 'uuid';
import product from '../models/product.js';

//create function that accepts a string and returns only the numbers by extracting them from the string. example: "$100" "12%"
const sanitizeToNumber = (rawValue) => {
    if (typeof rawValue === 'number') return rawValue;
    if (typeof rawValue !== 'string' || !rawValue.trim()) return null;

    // Remove only ₹ and % symbols
    const sanitized = rawValue.replace(/[₹%]/g, '');
    return sanitized;
};


const importProductCatalogue = async (storeId, fileBuffer) => {

    console.log("storeId", storeId);

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log('Excel Columns:', Object.keys(sheetData[0] || {}));

    for (const row of sheetData) {

        const productData = {
            productName: row['Product Name']?.trim() || row['Product Name*']?.trim(),
            description: row['Short Description']?.trim(),
            longDescription: row['Long Description']?.trim(),
            MRP: sanitizeToNumber(row['MRP']) || sanitizeToNumber(row['Selling Price']) || sanitizeToNumber(row['Selling Price*']) || 0, // Use MRP or Price, default to 0 if not provided
            sellingPrice: sanitizeToNumber(row['Selling Price']) || sanitizeToNumber(row['Selling Price*']) || sanitizeToNumber(row['MRP']) || 0, // Use Selling Price or Price, default to 0 if not provided
            brand: row['Brand']?.trim(),
            stock: row['Stock (Available Quantity)'] || row['Stock (Available Quantity)*'] || 0, // Default to 0 if not provided
            GST_Percentage: sanitizeToNumber(row['GST_Percentage']) || sanitizeToNumber(row['GST_Percentage*']) || 5, // Default to 5% if not provided
            HSNCode: row['HSN Code'],
            barcode: row['Barcode'],
            weight: row["Weight (number only)"],
            UOM: row["Unit of Measurement (Litres Kg Gm)"]?.trim(),
            countryOfOrigin: row["Country of Origin"]?.trim() || "IND",
            FSSAI: row["FSSAI Numbers"], // ? row["FSSAI Numbers"].split(',').map(f => f.trim()) : [],
            manufacturerName: row["Manufacturer Name"]?.trim(),
            manufacturerAddress: row["Manufacturer Address"]?.trim(),
            manufacturedDate: row["Manufactured Date"]?.trim(),
            isVegetarian: row["Veg / Non- Veg"]?.trim() === 'Veg' ? true : false,
        };

        //if GST_PERCENTAGE is not null and is in decimal then multiply it by 100
        if (productData.GST_Percentage && typeof productData.GST_Percentage === 'number' && productData.GST_Percentage < 1) {
            productData.GST_Percentage = productData.GST_Percentage * 100; // Convert to percentage
        }

        if (productData.FSSAI && typeof productData.FSSAI === 'string') {
            productData.FSSAI = productData.FSSAI.split(',').map(f => f.trim());
        } else if (productData.FSSAI) {
            productData.FSSAI = [productData.FSSAI.toString()]; // Ensure FSSAI is always an array
        }

        let productVariantMRPs = [];
        let productVariantSellingPrices = [];
        let productVariantWeights = [];
        let productVariantUOMs = [];

        //If stock contains kg gram so basically characters along with number then just drop off that character 
        if (productData.stock && typeof productData.stock === 'string') {
            // Remove any non-numeric characters except for decimal points
            productData.stock = productData.stock.replace(/[^0-9.,]/g, '').trim();
        }

        //IF MRP contains , then we need to split the MRP into two different MRP so that we can create two products
        if (((productData.MRP && typeof productData.MRP === 'string' && productData.MRP.includes(',')) ||
            (productData.sellingPrice && typeof productData.sellingPrice === 'string' && productData.sellingPrice.includes(",")))
            || (productData.weight && typeof productData.weight === 'string' && productData.weight.includes(','))) {

            productVariantMRPs = typeof productData.MRP === 'string' ? productData.MRP?.split(',').map(part => part.trim()) : [parseFloat(productData.MRP)];
            productVariantSellingPrices = typeof productData.sellingPrice === 'string' ? productData.sellingPrice?.split(',').map(part => part.trim()) : [parseFloat(productData.sellingPrice)];
            productVariantWeights = typeof productData.weight === 'string' ? productData.weight?.split(',').map(part => part.trim()) : [productData.weight];

            if (productVariantMRPs.length !== productVariantSellingPrices.length || productVariantMRPs.length !== productVariantWeights.length) {
                console.error("Error: MRP, Selling Price, and Weight do not match in length.", productData.productName);
            }

            const finalProductVariantWeights = [];
            const finalProductVariantUOMs = [];

            productVariantWeights.forEach(weight => {
                // Extract numeric value and UOM using regex
                const match = weight.match(/^([\d.]+)\s*([a-zA-Z]+)$/);
                if (match) {
                    finalProductVariantWeights.push(match[1].trim());
                    finalProductVariantUOMs.push(match[2].trim().toLowerCase()); // Normalize UOM like 'GM', 'Kg' → 'gm', 'kg'
                } else {
                    // fallback in case format is not clean
                    finalProductVariantWeights.push(weight);
                    finalProductVariantUOMs.push('gm'); // default
                }
            });

            productVariantWeights = finalProductVariantWeights;
            productVariantUOMs = finalProductVariantUOMs;
        } else {

            let productUOM = productData.UOM || "Kg"; // Default to 'Kg' if UOM is not provided
            let productWeight = productData.weight;

            //If weight is less than 1 and UOM is kg then change weight and UOM to 'gm'
            if (productWeight && productUOM && parseFloat(productWeight) < 1 && productUOM.toLowerCase() === 'kg') {
                productWeight = Number((parseFloat(productWeight) * 1000).toFixed(2)); // Convert kg to gm
                productUOM = 'gm';
            } else if (productWeight && productUOM && parseFloat(productWeight) < 1 && productUOM.toLowerCase() === 'litre') {
                productWeight = Number((parseFloat(productWeight) * 1000).toFixed(2)); // Convert litre to ml
                productUOM = 'ml';
            } else if (productWeight && productUOM && parseFloat(productWeight) < 1 && productUOM.toLowerCase() === 'g') {
                productWeight = Number((parseFloat(productWeight) * 1000).toFixed(2)); // Convert g to mg
                productUOM = 'mg';
            }


            productVariantMRPs = [parseFloat(productData.MRP)];
            productVariantSellingPrices = [parseFloat(productData.sellingPrice)];
            productVariantWeights = [productWeight];
            productVariantUOMs = [productUOM ? productUOM : 'gm']; // Default to 'gm' if UOM is not provided
        }

        const variantsCount = Math.max(
            productVariantMRPs.length,
            productVariantSellingPrices.length,
            productVariantWeights.length,
            productVariantUOMs.length
        );

        // Create a product for each variant
        for (let i = 0; i < variantsCount; i++) {
            const variantData = {
                ...productData,
                MRP: productVariantMRPs[i] || 0,
                sellingPrice: productVariantSellingPrices[i] || 0,
                weight: productVariantWeights[i],
                UOM: productVariantUOMs[i],
                storeId: storeId.trim(), // Add storeId to the product data
            };

            await createProduct(variantData);
        }
    }
};

const createProduct = async (productData) => {
    try {
        console.log("Creating product with data:", JSON.stringify(productData));
        const newProduct = new MasterCatalogModel({
            ...productData,
            createdBy: 'admin',
            published: true, // Set published to true by default
            _id: uuid(), // Generate a unique ID for the product
        });
        await newProduct.save();

        //Create a corresponding product entry in the Product model
        const product = new ProductModel({
            store: productData.storeId, // Assuming storeId is passed in productData
            price: productData.sellingPrice || productData.MRP, // Use sellingPrice if available, otherwise MRP
            lowStockThreshold: 15, // Default low stock threshold
            quantity: productData.stock || 0, // Default quantity
            maxAllowedQty: productData.stock || 0, // Default max allowed quantity
            masterProductId: newProduct._id,
            createdBy: 'admin',
            enabled: true,
            manuallyCreated: true, // Set manuallyCreated to true
        });

        await product.save();

    } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
    }
};

export default importProductCatalogue;