import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductEditModal = ({ show, product, onClose, onProductUpdate }) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (product) {
            setForm({ ...product });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:3100/api/admin/products/${product._id}`, form);
            //alert("Product updated successfully");
            onProductUpdate(); // Refresh product list
            onClose();
        } catch (err) {
            console.error("Failed to update product:", err);
            alert("Update failed");
        }
    };

    if (!show || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-[500px]">
                <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

                <div className="space-y-3">
                    <input name="productName" className="w-full border p-2" value={form.productName || ''} onChange={handleChange} placeholder="Product Name" />
                    <input name="MRP" className="w-full border p-2" value={form.MRP || ''} onChange={handleChange} placeholder="MRP" />
                    <input name="sellingPrice" className="w-full border p-2" value={form.sellingPrice || ''} onChange={handleChange} placeholder="Selling Price" />
                    <input name="stock" className="w-full border p-2" value={form.stock || ''} onChange={handleChange} placeholder="Stock" />
                    {/* Add more fields as needed */}
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

export default ProductEditModal;
