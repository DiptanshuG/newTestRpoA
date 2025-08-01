import React, { useState } from "react";
import { updateProduct, uploadProductImages } from "../app/services/master-catalog/masterCatalogService.js";

const MasterProductDetailsPopup = ({ product, onClose }) => {
    const [formData, setFormData] = useState({ ...product });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    //const [productId, setProductId] = useState(product._id);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        //setProductId(product._id);
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // alert("Updating product...---00-" + formData._id);
            await updateProduct(formData._id, formData);

            if (images.length > 0) {
                await uploadProductImages(formData._id, images);
            }

            //alert("Product updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-4/5 max-w-5xl overflow-y-auto max-h-screen shadow-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Product Details</h2>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[75vh] pr-4">
                    <div className="grid grid-cols-2 gap-4">

                        {[
                            { label: "Product ID", name: "_id", type: "text", disabled: true },
                            { label: "Product Name", name: "productName" },
                            { label: "Description", name: "description" },
                            { label: "Long Description", name: "longDescription" },
                            { label: "MRP", name: "MRP", type: "number" },
                            { label: "HSN Code", name: "HSNCode" },
                            { label: "Brand", name: "brand" },
                            { label: "GST Percentage", name: "GST_Percentage", type: "number" },
                            { label: "ONDC Super Category", name: "ondcSuperCategory" },
                            { label: "Product Category", name: "productCategory" },
                            { label: "Product Subcategory 1", name: "productSubcategory1" },
                            { label: "Product Subcategory 2", name: "productSubcategory2" },
                            { label: "Product Subcategory 3", name: "productSubcategory3" },
                            { label: "Barcode", name: "barcode" },
                            { label: "Weight", name: "weight" },
                            { label: "UOM", name: "UOM" },
                            { label: "Country of Origin", name: "countryOfOrigin" },
                            { label: "Length", name: "length" },
                            { label: "Breadth", name: "breadth" },
                            { label: "Height", name: "height" },
                            { label: "Return Window", name: "returnWindow" },
                            { label: "FSSAI (comma separated)", name: "FSSAI" },
                            { label: "Manufacturer Name", name: "manufacturerName" },
                            { label: "Manufacturer Address", name: "manufacturerAddress" },
                            { label: "Manufactured Date", name: "manufacturedDate" },
                            { label: "Nutritional Info", name: "nutritionalInfo" },
                            { label: "Additive Info", name: "additiveInfo" },
                            { label: "Instructions", name: "instructions" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block mb-1 font-medium">{field.label}</label>
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    className="border p-2 w-full"
                                    value={formData[field.name] || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Checkboxes */}
                    <div className="flex space-x-4 mt-4">
                        {[
                            { label: "Cancellable", name: "isCancellable" },
                            { label: "Returnable", name: "isReturnable" },
                            { label: "Vegetarian", name: "isVegetarian" },
                            { label: "Published", name: "published" },
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

                    {/* Images */}
                    <div className="col-span-2 mt-4">
                        <label className="block mb-1 font-medium">Product Images (Multiple)</label>
                        <input type="file" multiple onChange={handleFileChange} />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.images?.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Existing ${index}`}
                                    className="w-24 h-24 object-cover"
                                />
                            ))}
                            {imagePreviews.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="w-24 h-24 object-cover border-2 border-dashed"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MasterProductDetailsPopup;