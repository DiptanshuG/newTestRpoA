import axios from "axios";

const API_BASE_URL = `http://localhost:3100/api/admin/mastercatalog`;

// Get Products
export const getProducts = async (filters = {}) => {
    try {
        const response = await axios.get(API_BASE_URL, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Get Product by ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
};

// Update Product
export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

// Create Product
export const createProduct = async (productData) => {
    try {
        const response = await axios.post(API_BASE_URL, productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

// Upload Image
// frontend/src/app/services/master-catalog/masterCatalogService.js

export const uploadProductImages = async (productId, files) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });

        const response = await axios.post(`${API_BASE_URL}/${productId}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading images:", error);
        throw error;
    }
};

export const updateProductData = async (data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/data/update`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating product data:", error);
        throw error;
    }
};

