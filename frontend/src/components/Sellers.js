import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import EnhancedSellerModal from './EnhancedSellerModel';

import ProductEditModal from './ProductEditModal'; // Import the modal



const Sellers = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [total_sellers, setTotalSellers] = useState(0);
  const [total_pages, setTotal_pages] = useState(0);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [sellerFiles, setSellerFiles] = useState({});
  const [showImportModal, setShowImportModal] = useState(false);

  const [sellerProducts, setSellerProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const itemsPerPage = 10;

  const columns = [
    { name: "_id", label: "ID" },
    { name: "seller_id", label: "Seller ID" },
    { name: "store_name", label: "Store Name" },
    { name: "category", label: "Category" },
    { name: "onboarded_status", label: "Onboarded Status" },
    { name: "date_joined", label: "Date Joined" },
    { name: "location", label: "Location" }

  ];

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axios.get('http://localhost:3100/api/admin/sellers');
        setData(res.data.sellers || []);

        setTotalSellers(res.data.total_sellers);
        setTotal_pages(res.data.total_pages);
      } catch (err) {
        console.error('Error fetching sellers:', err);
      }
    };
    fetchSellers();
  }, []);

  const fetchSellerProducts = async (storeId) => {
    try {
      const res = await axios.get(`http://localhost:3100/api/admin/sellers/${storeId}/products`);

      setSellerProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleImportClick = (storeId) => {
    setSelectedStoreId(storeId);
    setShowImportModal(true);
  };

  const handleFileChange = (e, sellerId) => {
    const file = e.target.files[0];
    if (file) {
      setSellerFiles((prev) => ({
        ...prev,
        [sellerId]: file,
      }));
    }
  };


  const handleImportSubmit = async (storeId) => {
    const file = sellerFiles[storeId];
    if (!file || !storeId) {
      alert('No file selected for this seller.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("storeId", storeId);

    try {
      await axios.post(`http://localhost:3100/api/admin/sellers/import-catalogue`, formData);
      alert("Products imported successfully");

      setShowImportModal(false);
      // Reset the file input for this seller
      setSellerFiles(null);
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to import products");
    }
  };

  const handleRowClick = async (sellerId) => {
    try {
      const res = await axios.get(`http://localhost:3100/api/admin/sellers/${sellerId}`);

      setSelectedSeller(res.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching seller details:', err);
    }
  };

  const sortedFilteredData = useMemo(() => {
    let filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? '').toLowerCase().includes(searchTerm)
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  const paginatedData = sortedFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedFilteredData.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search sellers..."
        onChange={handleSearch}
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.name}
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort(col.name)}
                >
                  <div className="flex items-center gap-1 capitalize">
                    {col.label}
                    {sortConfig.key === col.name && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50"
                >
                  {columns.map((col) => (

                    <td
                      key={col.name}
                      className="px-4 py-2 max-w-xs truncate"
                      title={item[col.name]}
                      onClick={col.name === '_id' ? () => handleRowClick(item._id) : undefined}
                      style={{ cursor: col.name === '_id' ? 'pointer' : 'default' }}
                    >
                      {col.name === 'onboarded_status' ? (
                        <span className={`px-2 py-1 rounded text-xs ${item[col.name] ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item[col.name] ? 'Onboarded' : 'Pending'}
                        </span>
                      ) : (col.name === '_id' || col.name === 'seller_id') && item[col.name]?.length > 10 ? (
                        item[col.name].substring(0, 10) + '...'
                      ) : col.name === 'date_joined' && item[col.name] ? (
                        new Date(item[col.name]).toLocaleDateString()
                      ) : col.name === 'location' && item[col.location] ? (
                        item[col.location]
                      ) : (
                        item[col.name] ?? '—'
                      )}
                    </td>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchSellerProducts(item._id);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
                  >
                    Show Products
                  </button>
                  <td className="px-1 py-2">
                    <input
                      type="file"
                      accept=".xlsx"
                      className="mb-1"
                      onChange={(e) => {
                        e.stopPropagation();
                        handleFileChange(e, item._id);
                      }}
                    />
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImportSubmit(item._id, item._id); // Assuming storeId === sellerId
                      }}
                    >Import Products
                    </button>
                  </td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {sellerProducts?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Products for Selected Seller</h2>
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead>
                <tr>
                  <th className="px-4 py-2">Product ID</th>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">HSN Code</th>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">Package Unit</th>
                  <th className="px-4 py-2">MRP</th>
                  <th className="px-4 py-2">Selling Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">GST Percentage</th>
                  <th className="px-4 py-2">Enabled</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts?.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="px-4 py-2 max-w-xs truncate" title={product._id}></td>
                    <td className="px-4 py-2">{product.productName}</td>
                    <td className="px-4 py-2">{product.HSNCode}</td>
                    <td className="px-4 py-2">{product.brand}</td>
                    <td className="px-4 py-2">{product.packageUnit}</td>
                    <td className="px-4 py-2">₹{product.MRP}</td>
                    <td className="px-4 py-2">₹{product.price}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">{product.GST_Percentage}</td>
                    <td className="px-4 py-2">{product.enabled ? 'Enabled' : 'Disabled'}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductModal(true);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Total Info */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <p>Total Sellers: <span className="font-medium">{total_sellers}</span></p>
        <p>Total Pages: <span className="font-medium">{total_pages}</span></p>
      </div>

      {/* Enhanced Modal */}
      <EnhancedSellerModal
        showModal={showModal}
        selectedSeller={selectedSeller}
        setShowModal={setShowModal}
      />
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Import Products for Store</h2>
            <input type="file" accept=".xlsx" onChange={handleFileChange}>File Input </input>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sellers;