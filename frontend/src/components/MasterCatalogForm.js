import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { createProduct, uploadProductImages } from "../app/services/master-catalog/masterCatalogService.js";


const MasterCatalogForm = () => {
    const [formData, setFormData] = useState({
        productName: "",
        MRP: "",
        HSNCode: "",
        brand: "",
        GST_Percentage: "",
        ondcSuperCategory: "",
        productCategory: "",
        barcode: "",
        weight: "",
        UOM: "",
        countryOfOrigin: "",
        length: "",
        breadth: "",
        height: "",
        isVegetarian: false,
        manufacturerName: "",
        FSSAI: [],
        manufacturedDate: "",
        manufacturerAddress: "",
        nutritionalInfo: "",
        additiveInfo: "",
        instructions: "",
        isCancellable: true,
        isReturnable: true,
        longDescription: "",
        description: "",
        published: true,
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        return () => {
            // Cleanup object URLs on component unmount
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Revoke old object URLs to avoid memory leaks
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            alert("saving product...");
            const product = await createProduct(formData);
            if (images.length > 0) {
                await uploadProductImages(product._id, images);
            }

            alert("Product created successfully!");
            //setFormData({});
            setImages([]);
            setImagePreviews([]);
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Product Name", name: "productName" },
                            { label: "Description", name: "description" },
                            { label: "Long Description", name: "longDescription" },
                            { label: "MRP", name: "MRP", type: "number" },
                            { label: "HSN Code", name: "HSNCode" },
                            { label: "Brand", name: "brand" },
                            { label: "GST Percentage", name: "GST_Percentage", type: "number" },
                            { label: "ONDC Super Category", name: "ondcSuperCategory" },
                            { label: "Product Category", name: "productCategory" },
                            { label: "Barcode", name: "barcode" },
                            { label: "Weight", name: "weight" },
                            { label: "UOM", name: "UOM" },
                            { label: "Country of Origin", name: "countryOfOrigin" },
                            { label: "Length", name: "length" },
                            { label: "Breadth", name: "breadth" },
                            { label: "Height", name: "height" },
                            { label: "Manufacturer / Packer Name", name: "manufacturerName" },
                            { label: "Manufacturer / Packer Address", name: "manufacturerAddress" },
                            { label: "Manufacturing Date", name: "manufacturedDate" },
                            { label: "Nutritional Info", name: "nutritionalInfo" },
                            { label: "Additive Info", name: "additiveInfo" },
                            { label: "Instructions", name: "instructions" },
                            { label: "FSSAI (comma-separated)", name: "FSSAI" },

                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block font-medium mb-1">{field.label}</label>
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    className="border p-2 w-full"
                                    value={formData[field.name] || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}

                        <div className="col-span-2">
                            <label className="block font-medium mb-1">Product Images (Multiple)</label>
                            <input type="file" multiple onChange={handleFileChange} />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {imagePreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt={`Preview ${index}`} className="w-24 h-24 object-cover" />
                                ))}
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="col-span-2 flex space-x-4">
                            {[
                                { label: "Cancellable", name: "isCancellable" },
                                { label: "Returnable", name: "isReturnable" },
                                { label: "Is Vegetarian", name: "isVegetarian" },
                            ].map((checkbox) => (
                                <label key={checkbox.name} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name={checkbox.name}
                                        checked={formData[checkbox.name] || false}
                                        onChange={handleInputChange}
                                    />
                                    <span>{checkbox.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button className="bg-blue-500 text-white px-4 py-2" type="submit">
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MasterCatalogForm;
