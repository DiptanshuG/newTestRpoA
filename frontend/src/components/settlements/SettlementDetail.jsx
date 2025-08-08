import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSettlementById } from "../../services/settlementService";

const formatCurrency = (value) =>
    `₹${parseFloat(value || 0).toFixed(2)}`;

const SettlementDetail = () => {
    const { settlementId } = useParams();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data: settlement, isLoading, error } = useQuery({
        queryKey: ["settlement", settlementId],
        queryFn: () => fetchSettlementById(settlementId),
        enabled: !!settlementId,
    });

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (error || !settlement)
        return <div className="p-4 text-red-600">Error fetching settlement.</div>;

    const { storeId, fromDate, toDate, status, totals, orderIds } = settlement;

    const handleViewItems = (order) => {
        setSelectedOrder(order);
        setDrawerOpen(true);
    };

    return (
        <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-10">
            {/* Header */}
            <div className="border-b border-gray-300 pb-4">
                <p className="text-md text-gray-600">
                    Settlement ID: <strong>{settlement.settlementId}</strong>
                </p>
                <p className="text-md text-gray-600">
                    Store: <b>{orderIds[0]?.provider.businessName}</b> ({storeId})
                </p>
                <p className="text-md text-gray-600">
                    City: <b>{orderIds[0]?.provider.address.city}</b>
                </p>
                <p className="text-md text-gray-600">
                    Date Range: {new Date(fromDate).toLocaleDateString()} –{" "}
                    {new Date(toDate).toLocaleDateString()}
                </p>
                <p className="text-md text-gray-600">
                    Status:{" "}
                    <span className="text-blue-700 font-medium">{status}</span>
                </p>
            </div>

            {/* Totals */}
            <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Settlement Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-700">
                    {Object.entries(totals).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded p-3">
                            <p className="font-medium capitalize">{key.replace(/total/g, '').replace(/([A-Z])/g, ' $1')}</p>
                            <p>{formatCurrency(value)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="overflow-x-auto bg-white shadow rounded-xl">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-2">OrderId</th>
                            <th className="px-4 py-2">OrderDate</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Total Order Amount</th>
                            <th className="px-4 py-2">Platform Commission + GST</th>
                            <th className="px-4 py-2">TDS Deducted</th>
                            <th className="px-4 py-2">TCS Deducted</th>
                            <th className="px-4 py-2">Delivery + GST</th>
                            <th className="px-4 py-2">Packaging + GST</th>
                            <th className="px-4 py-2">Net Payout</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderIds.map((order) => (
                            <tr
                                key={order._id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-2">{order.orderId}</td>
                                <td className="px-4 py-2">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">{order.state}</td>
                                <td className="px-4 py-2">
                                    {formatCurrency(order.invoiceData.totalOrderAmount)}
                                </td>
                                <td className="px-4 py-2">
                                    {formatCurrency(
                                        order.invoiceData.platformCommission +
                                        (order.invoiceData.gstOnCommission || 0)
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    {formatCurrency(order.invoiceData.tdsDeducted)}
                                </td>
                                <td className="px-4 py-2">
                                    {formatCurrency(order.invoiceData.tcsDeducted)}
                                </td>
                                <td className="px-4 py-2">
                                    {formatCurrency(
                                        order.invoiceData.deliveryCharges +
                                        (order.invoiceData.deliveryChargesGST || 0)
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    {formatCurrency(
                                        order.invoiceData.packagingCharges +
                                        (order.invoiceData.packagingChargesGST || 0)
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    {formatCurrency(order.invoiceData.netPayoutToSeller)}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        className="text-blue-600 hover:underline cursor-pointer"
                                        onClick={() => handleViewItems(order)}
                                    >
                                        View Items
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Right Drawer */}
            <div
                className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${drawerOpen ? "visible" : "invisible"
                    }`}
            >
                {/* Overlay with blur */}
                <div
                    className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={() => setDrawerOpen(false)}
                ></div>

                {/* Drawer */}
                <div
                    className={`absolute top-0 right-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    style={{ width: "50%" }}
                >
                    {selectedOrder && (
                        <div className="p-6 overflow-y-auto h-full">
                            <div className="flex justify-between items-center border-b pb-3 mb-4">
                                <h3 className="text-lg font-semibold">Order Items</h3>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="text-gray-500 hover:text-black text-xl"
                                >
                                    ✕
                                </button>
                            </div>
                            {selectedOrder.items?.map((item, idx) => {
                                const quoteItem = selectedOrder.quote?.breakup?.find(
                                    (b) => b["@ondc/org/item_id"] === item.id
                                );
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 border-b py-3"
                                    >
                                        <img
                                            src={
                                                item.product?.masterProduct?.images?.[0] || ""
                                            }
                                            alt={quoteItem?.title}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">
                                                {quoteItem?.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {item.quantity.count}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {formatCurrency(
                                                quoteItem?.price?.value || item.product?.price
                                            )}
                                        </p>
                                    </div>
                                );
                            })}

                            {/* Order Summary */}
                            <div className="border-t bg-gray-50 p-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(selectedOrder.invoiceData?.totalOrderAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Platform Commission + GST</span>
                                    <span>
                                        {formatCurrency(
                                            (selectedOrder.invoiceData?.platformCommission || 0) +
                                            (selectedOrder.invoiceData?.gstOnCommission || 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Delivery + GST</span>
                                    <span>
                                        {formatCurrency(
                                            (selectedOrder.invoiceData?.deliveryCharges || 0) +
                                            (selectedOrder.invoiceData?.deliveryChargesGST || 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Packaging + GST</span>
                                    <span>
                                        {formatCurrency(
                                            (selectedOrder.invoiceData?.packagingCharges || 0) +
                                            (selectedOrder.invoiceData?.packagingChargesGST || 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                    <span>Net Payout</span>
                                    <span>{formatCurrency(selectedOrder.invoiceData?.netPayoutToSeller)}</span>
                                </div>
                            </div>

                            {/* Bank Details */}
                            <div className="bg-gradient-to-br mt-4 from-white to-gray-50 shadow-lg rounded-xl p-5 w-full max-w-md border border-gray-200">
                                <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800 flex items-center gap-2">
                                    Bank Details
                                </h2>

                                <div className="space-y-3 text-sm">
                                    {[
                                        { label: "Account Holder Name", value: selectedOrder.provider.bankDetails.accountHolderName },
                                        { label: "Account Number", value: selectedOrder.provider.bankDetails.accountNumber },
                                        { label: "IFSC", value: selectedOrder.provider.bankDetails.IFSC },
                                        { label: "Bank Name", value: selectedOrder.provider.bankDetails.bankName },
                                        { label: "Branch Name", value: selectedOrder.provider.bankDetails.branchName },
                                        { label: "UPI ID", value: selectedOrder.provider.bankDetails.upiId }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between border-b last:border-0 pb-2 last:pb-0">
                                            <span className="text-gray-500">{item.label}:</span>
                                            <span className="font-medium text-gray-800">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettlementDetail;
