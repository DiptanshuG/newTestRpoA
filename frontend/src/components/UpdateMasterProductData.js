import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { updateProductData } from "../app/services/master-catalog/masterCatalogService.js";

const UpdateMasterProductData = () => {
    const [formData, setFormData] = useState({
        productSubcategory1: "",
        productSubcategory2: "",
        ondcSuperCategory: "",
        productCategory: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProductData(formData);
            alert("Product data updated successfully!");
            setFormData({
                productSubcategory1: "",
                productSubcategory2: "",
                ondcSuperCategory: "",
                productCategory: "",
            });
        } catch (error) {
            console.error("Error updating product data:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Update Product Data</h2>

                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Filters:</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Subcategory 1</label>
                            <input
                                type="text"
                                name="productSubcategory1"
                                className="border p-2 w-full"
                                value={formData.productSubcategory1}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Subcategory 2</label>
                            <input
                                type="text"
                                name="productSubcategory2"
                                className="border p-2 w-full"
                                value={formData.productSubcategory2}
                                onChange={handleInputChange}
                            />
                        </div>

                        <p>
                            <label className="block mb-1 font-medium">Update Records with Below Data:</label>
                        </p>
                        <br />
                        <div>
                            <label className="block mb-1 font-medium">ONDC Super Category</label>
                            <input
                                type="text"
                                name="ondcSuperCategory"
                                className="border p-2 w-full"
                                value={formData.ondcSuperCategory}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Product Category</label>
                            <input
                                type="text"
                                name="productCategory"
                                className="border p-2 w-full"
                                value={formData.productCategory}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <button className="bg-blue-500 text-white px-4 py-2 mt-4" type="submit">
                        Update Product Data
                    </button>
                </form>
            </div >
        </div >
    );
};

export default UpdateMasterProductData;
