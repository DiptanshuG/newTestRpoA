import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import { getProducts, getProductById } from "../app/services/master-catalog/masterCatalogService.js";
import { useNavigate } from "react-router-dom";

import MasterProductDetailsPopup from "./MasterProductDetailsPopup";

import '../styles/masterCatalogList.css'

const MasterCatalogList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({
        productName: "",
        productCategory: "",
        ondcSuperCategory: "",
        brand: ""
    });

    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        try {
            const response = await getProducts({
                page: currentPage,
                limit: 12,
                ...filters,
            });

            setProducts(response.products);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [currentPage, filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleProductClick = async (id) => {
        try {
            const product = await getProductById(id);
            setSelectedProduct(product);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const closePopup = () => {
        setSelectedProduct(null);
        fetchProducts();  // Refresh the list after update
    };

    const navigateToUpdateProductData = () => {
        navigate("/mastercatalog/update");
    };

    const navigateToCreateProduct = () => {
        navigate("/mastercatalog/create");
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-y-auto">
                <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                    <h1 className="text-2xl font-bold">Master Catalog</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2"
                        onClick={navigateToCreateProduct}
                    >
                        Create New Product
                    </button>

                    <button
                        className="bg-blue-500 text-white px-4 py-2"
                        onClick={navigateToUpdateProductData}
                    >
                        Update Product Data
                    </button>
                </header>

                <div className="p-4">
                    <div className="mb-4 flex space-x-4">
                        <input
                            type="text"
                            name="productName"
                            placeholder="Search by Product Name"
                            className="border p-2 flex-1"
                            onChange={handleFilterChange}
                        />
                        <input
                            type="text"
                            name="brand"
                            placeholder="Search by Brand"
                            className="border p-2 flex-1"
                            onChange={handleFilterChange}
                        />
                        <input
                            type="text"
                            name="productCategory"
                            placeholder="Product Category"
                            className="border p-2 flex-1"
                            onChange={handleFilterChange}
                        />
                        <input
                            type="text"
                            name="ondcSuperCategory"
                            placeholder="ONDC Super Category"
                            className="border p-2 flex-1"
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="bg-white p-4 shadow-md rounded-md">
                        <table className="w-full border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4">ID</th>
                                    <th className="py-2 px-4">Product Name</th>
                                    <th className="py-2 px-4">HSN Code</th>
                                    <th className="py-2 px-4">MRP</th>
                                    <th className="py-2 px-4">Brand</th>
                                    <th className="py-2 px-4">GST Percentage</th>
                                    <th className="py-2 px-4">ONDC Super Category</th>
                                    <th className="py-2 px-4">Category</th>
                                    <th className="py-2 px-4">Subcategory 1</th>
                                    <th className="py-2 px-4">Subcategory 2</th>
                                    <th className="py-2 px-4">Subcategory 3</th>
                                    <th className="py-2 px-4">Weight</th>
                                    <th className="py-2 px-4">UOM</th>
                                    <th className="py-2 px-4">Country of Origin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product._id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4">{product._id}</td>
                                            <td className="py-2 px-4 truncate-text">{product.productName}</td>
                                            <td className="py-2 px-4">{product.HSNCode}</td>
                                            <td className="py-2 px-4">₹{product.MRP}</td>
                                            <td className="py-2 px-4">{product.brand}</td>
                                            <td className="py-2 px-4">{product.GST_Percentage}%</td>
                                            <td className="py-2 px-4">{product.ondcSuperCategory}</td>
                                            <td className="py-2 px-4">{product.productCategory}</td>
                                            <td className="py-2 px-4">{product.productSubcategory1}</td>
                                            <td className="py-2 px-4">{product.productSubcategory2}</td>
                                            <td className="py-2 px-4">{product.productSubcategory3}</td>
                                            <td className="py-2 px-4">{product.weight}</td>
                                            <td className="py-2 px-4">{product.UOM}</td>
                                            <td className="py-2 px-4">{product.countryOfOrigin}</td>
                                            <td className="py-2 px-4">
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1"
                                                    onClick={() => handleProductClick(product._id)}
                                                >
                                                    View / Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="14" className="py-4 text-center">
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="bg-blue-500 text-white px-4 py-2"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
                {selectedProduct && (
                    <MasterProductDetailsPopup product={selectedProduct} onClose={closePopup} />
                )}
            </div>
        </div>
    );
};

export default MasterCatalogList;
