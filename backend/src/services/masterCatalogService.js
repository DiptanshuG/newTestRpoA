import MasterCatalogModel from "../models/masterCatalog.js";
import { uploadFileToS3 } from "./s3Service.js";

export const createProduct = async (productData) => {
    try {
        const newProduct = new MasterCatalogModel(productData);
        return await newProduct.save();
    } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
    }
};

export const getProductById = async (id) => {
    try {
        return await MasterCatalogModel.findById(id);
    } catch (error) {
        throw new Error("Error fetching product by ID: " + error.message);
    }
};


export const updateProduct = async (id, productData) => {
    try {
        const updatedProduct = await MasterCatalogModel.findByIdAndUpdate(
            id,
            productData,
            { new: true }
        );
        if (!updatedProduct) throw new Error("Product not found");
        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product");
    }
};

export const deleteProduct = async (id) => {
    try {
        const product = await MasterCatalogModel.findById(id);
        if (!product) throw new Error("Product not found");

        // Remove all images from S3
        if (product.images.length > 0) {
            await Promise.all(
                product.images.map(async (imageUrl) => {
                    const key = imageUrl.split(".com/")[1];
                    await deleteFromS3(key);
                })
            );
        }

        return await MasterCatalogModel.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
    }
};

export const getProducts = async (filters) => {

    console.log("getProducts API called");

    const { page = 1, limit = 10, productName, productCategory, ondcSuperCategory } = filters;

    const query = {};
    if (filters.productName) query.productName = { $regex: filters.productName, $options: "i" };
    if (filters.productCategory) query.productCategory = (filters.productCategory === "null") ? null : filters.productCategory;
    if (filters.ondcSuperCategory) query.ondcSuperCategory = filters.ondcSuperCategory;
    if (filters.brand) query.brand = { $regex: filters.brand, $options: "i" };

    try {
        const products = await MasterCatalogModel.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCount = await MasterCatalogModel.countDocuments(query);

        return {
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
        };
    } catch (error) {
        throw new Error("Error fetching products: " + error.message);
    }
};

export const uploadProductImage = async (productId, file) => {
    try {
        const imageUrl = await uploadFileToS3(file, productId, file.originalname);

        await MasterCatalogModel.findByIdAndUpdate(productId, {
            $push: {
                images: "https://d2e3yo6hu5cdgs.cloudfront.net/" + imageUrl
            },
        });

        return imageUrl;
    } catch (error) {
        throw new Error("Error uploading image: " + error.message);
    }
};

export const updateProductData = async ({ productSubcategory1, productSubcategory2, ondcSuperCategory, productCategory }) => {
    try {
        const result = await MasterCatalogModel.updateMany(
            {
                productSubcategory1,
                productSubcategory2,
                productCategory: null,
            },
            {
                $set: {
                    ondcSuperCategory,
                    productCategory,
                },
            }
        );
        return result;
    } catch (error) {
        console.error("Error updating product data:", error);
        throw new Error("Failed to update product data");
    }
};