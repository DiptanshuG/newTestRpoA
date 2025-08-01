import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSettlementById } from '../../services/settlementService';

const formatCurrency = (value) => `₹${parseFloat(value).toFixed(2)}`;

const SettlementDetail = () => {
    const { settlementId } = useParams();

    const { data: settlement, isLoading, error } = useQuery({
        queryKey: ['settlement', settlementId],
        queryFn: () => fetchSettlementById(settlementId),
        enabled: !!settlementId,
    });

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (error || !settlement) return <div className="p-4 text-red-600">Error fetching settlement.</div>;

    const { storeId, fromDate, toDate, status, totals, orderIds, invoiceIds } = settlement;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
            {/* Header */}
            <div className="border-b border-gray-300 pb-4">
                <p className="text-md text-gray-600">Settlement ID: <strong>{settlement.settlementId}</strong></p>
                <p className="text-md text-gray-600">Store: <b>{orderIds[0].businessName}</b> ({storeId})</p>
                <p className="text-md text-gray-600">Date Range: {new Date(fromDate).toLocaleDateString()} – {new Date(toDate).toLocaleDateString()}</p>
                <p className="text-md text-gray-600">Status: <span className="text-blue-700 font-medium">{status}</span></p>
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

            {/* Orders Section */}
            <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-800">Orders ({orderIds.length})</h2>
                {orderIds.map(order => (
                    <div key={order._id} className="bg-white rounded-xl shadow p-6 space-y-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div>
                                <p className="text-lg font-semibold text-gray-800">Order ID: {order.orderId}</p>
                                <p className="text-sm text-gray-600">Transaction: {order.transactionId}</p>
                                <p className="text-sm text-gray-600">Buyer: {order.billing?.name} - {order.billing?.phone}</p>
                                <p className="text-sm text-gray-600">Delivery To: {order.fulfillments?.[0]?.end?.location?.address?.building}</p>
                                <p className="text-sm text-gray-600">Status: <span className="text-green-700 font-semibold">{order.state}</span></p>
                                <p className="text-sm text-gray-600">Distance: {order.deliveryDistance}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <p className="text-sm text-gray-500">Payment Status: <span className="font-semibold text-blue-700">{order.payment?.status}</span></p>
                                <p className="text-sm text-gray-500">Amount: <span className="font-semibold">{formatCurrency(order.payment?.params?.amount)}</span></p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Items</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {order.items?.map(item => {
                                    const product = item.product || {};
                                    const image = product?.masterProduct?.images?.[0] || '';
                                    const quoteItem = order.quote?.breakup?.find(b => b['@ondc/org/item_id'] === item.id);

                                    return (
                                        <div key={item.id} className="flex rounded-lg p-4 bg-gray-50 gap-4">
                                            <img src={image} alt="product" className="w-20 h-20 object-contain rounded-md bg-white" />
                                            <div className="flex flex-col justify-between">
                                                <p className="font-medium">{quoteItem?.title}</p>
                                                <p className="text-xs text-gray-600">ID: {product?._id}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity.count}</p>
                                                <p className="text-sm text-gray-600">Price: {formatCurrency(quoteItem?.price?.value || product.price)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quote Summary */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Charges Summary</h4>
                            <div className="border-t pt-2 text-sm text-gray-600 space-y-1">
                                {order.quote?.breakup?.map((b, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{b.title}</span>
                                        <span>{formatCurrency(b.price?.value)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-semibold border-t pt-2 text-gray-800">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.quote?.price?.value)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Invoice IDs */}
            {invoiceIds?.length > 0 && (
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Invoice IDs</h2>
                    <ul className="list-disc pl-6 text-sm text-gray-700">
                        {invoiceIds.map(id => (
                            <li key={id}>{id}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SettlementDetail;
