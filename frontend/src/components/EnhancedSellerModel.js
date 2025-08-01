import {
  X,
  Mail,
  Phone,
  Store,
  FileText,
  Calendar,
  Tag,
  User,
  CreditCard,
  Clock,
  MapPin,
} from "lucide-react";

const EnhancedSellerModal = ({ showModal, selectedSeller, setShowModal }) => {
  console.log(selectedSeller);
  if (!showModal || !selectedSeller) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to get document entries
  const getDocuments = () => {
    const docs = [];
    const bd = selectedSeller.business_documents;

    if (bd) {
      if (bd.gst_document) docs.push({ type: "GST", name: bd.gst_document.document_name, url: bd.gst_document.preview_url, status: bd.gst_document.status });
      if (bd.pan_document) docs.push({ type: "PAN", name: bd.pan_document.document_name, url: bd.pan_document.preview_url });
      if (bd.fssai_document) docs.push({ type: "FSSAI", name: bd.fssai_document.document_name, url: bd.fssai_document.preview_url });
      if (bd.aadhaar_document) docs.push({ type: "Aadhaar", name: bd.aadhaar_document.document_name, url: bd.aadhaar_document.preview_url });
    }

    if (selectedSeller.bank_details?.cancelled_cheque) {
      docs.push({
        type: "Cheque",
        name: selectedSeller.bank_details.cancelled_cheque.document_name,
        url: selectedSeller.bank_details.cancelled_cheque.preview_url
      });
    }

    return docs;
  };

  return (
    <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <User className="mr-2" size={18} />
            {selectedSeller.store_details?.store_name || selectedSeller.owner_details?.full_name || "Unnamed Seller"}
          </h2>
          <button
            className="text-white hover:bg-blue-700 rounded-full p-1"
            onClick={() => setShowModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-md font-medium text-gray-800 mb-2">Basic Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Provider ID:</span>
                    <span className="truncate">{selectedSeller.seller_id || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Store ID:</span>
                    <span className="truncate">{selectedSeller.storeId || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Tag size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Category:</span>
                    <span>{selectedSeller.store_details?.category || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Joined:</span>
                    <span>{formatDate(selectedSeller.store_details?.date_joined)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-md font-medium text-gray-800 mb-2">Contact Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-700">
                    <User size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Name:</span>
                    <span>{selectedSeller.owner_details?.full_name || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Email:</span>
                    <span className="truncate">{selectedSeller.owner_details?.email || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Phone:</span>
                    <span>{selectedSeller.owner_details?.mobile || "—"}</span>
                  </div>
                </div>
              </div>
              {/* Store Timings */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-md font-medium text-gray-800 mb-2">Store Operations</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Clock size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Hours:</span>
                    {selectedSeller.delivery_settings?.store_timings ? (
                      <span>
                        {selectedSeller.delivery_settings.store_timings.open} - {selectedSeller.delivery_settings.store_timings.close}
                      </span>
                    ) : "—"}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Radius:</span>
                    <span>{selectedSeller.delivery_settings?.service_radius || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Min Order:</span>
                    <span>₹{selectedSeller.delivery_settings?.minimum_order_price || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Business Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-md font-medium text-gray-800 mb-2">Business Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">GST:</span>
                    <span className="truncate">{selectedSeller.business_documents?.gst_number || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">PAN:</span>
                    <span>{selectedSeller.business_documents?.pan_number || "—"}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <Store size={14} className="mr-2 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium mr-1">Address:</span>
                      <span className="block text-xs mt-1 line-clamp-2">
                        {selectedSeller.store_details?.store_address || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-md font-medium text-gray-800 mb-2">Bank Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Account Holder:</span>
                    <span>{selectedSeller.bank_details?.accountHolderName || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Account Number:</span>
                    <span>{selectedSeller.bank_details?.accountNumber || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">IFSC:</span>
                    <span>{selectedSeller.bank_details?.IFSC || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Bank Name:</span>
                    <span>{selectedSeller.bank_details?.bankName || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Branch:</span>
                    <span>{selectedSeller.bank_details?.branchName || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">UPI ID:</span>
                    <span>{selectedSeller.bank_details?.upiId || "—"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard size={14} className="mr-2 text-blue-600" />
                    <span className="font-medium mr-1">Cancelled Cheque:</span>
                    {selectedSeller.bank_details?.cancelledCheque ? (
                      <a
                        href={selectedSeller.bank_details.cancelledCheque.replace(/`/g, '').trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-1"
                      >
                        View
                      </a>
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </div>
              </div>


            </div>

          </div>

          {/* Documents Row */}
          <div className="mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-md font-medium text-gray-800 mb-2">Documents</h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {getDocuments().length > 0 ? (
                  getDocuments().map((doc, i) => (
                    <div key={i} className="text-gray-700 space-y-1 relative group">
                      <div className="flex items-center text-sm">
                        <FileText size={14} className="mr-1 text-blue-600" />
                        <span className="font-medium mr-1">{doc.type}:</span>
                        <a
                          href={doc.url || doc.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline max-w-[80px] truncate inline-block align-middle text-xs"
                          title={doc.name}
                        >
                          View
                        </a>
                        {doc.status && (
                          <span className="ml-1 px-1 py-0.5 rounded text-xs bg-green-100 text-green-800">
                            ✓
                          </span>
                        )}
                      </div>
                      {(doc.url || doc.name) && (
                        <div className="absolute left-0 mt-1 z-50 hidden group-hover:block">
                          <img
                            src={doc.url || doc.name}
                            alt="Preview"
                            className="h-32 rounded border border-gray-300 shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm col-span-3">No documents available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3 flex justify-end">
          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSellerModal;