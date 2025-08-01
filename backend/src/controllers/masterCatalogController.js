import * as masterCatalogService from "../services/masterCatalogService.js";
import MasterCatalogModel from "../models/masterCatalog.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

export const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const product = await masterCatalogService.createProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const uploadProductImages = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const imageUrls = await Promise.all(
            files.map(async (file) => {
                return await masterCatalogService.uploadProductImage(id, file);
            })
        );

        res.json({ message: "Images uploaded successfully", imageUrls });
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({ message: "Error uploading images" });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedProduct = await masterCatalogService.updateProduct(id, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const filters = req.query;
        const products = await masterCatalogService.getProducts(filters);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await MasterCatalogModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
};


export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await masterCatalogService.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductData = async (req, res) => {
    try {
        console.log(`update product data API called with body: ${JSON.stringify(req.body)}`);
        const { productSubcategory1, productSubcategory2, ondcSuperCategory, productCategory } = req.body;
        const result = await masterCatalogService.updateProductData({
            productSubcategory1,
            productSubcategory2,
            ondcSuperCategory,
            productCategory,
        });

        res.status(200).json({ message: "Product data updated successfully", result });
    } catch (error) {
        console.error("Error updating product data:", error);
        res.status(400).json({ error: error.message });
    }
};
