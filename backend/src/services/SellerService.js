import Store from "../models/store.model.js";
import Order from "../models/order.js";
import Provider from "../models/provider.model.js";
import User from "../models/user.model.js";
import product from "../models/product.js";

// Format address helper
const formatAddress = (address) => {
  const parts = [
    address.building,
    address.street,
    address.locality,
    address.city,
    address.state,
  ];
  return parts.filter(Boolean).join(", ");
};

export const fetchAdminSellers = async ({ status, page = 1, limit = 50 }) => {
  const matchStage = {};
  if (status) {
    matchStage["storeStatus"] = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitInt = parseInt(limit);

  const stores = await Store.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "providers",
        localField: "provider",
        foreignField: "_id",
        as: "providerDetails",
      },
    },
    { $unwind: "$providerDetails" },
    {
      $project: {
        seller_id: "$providerDetails._id",
        store_name: "$providerDetails.businessName",
        name: "$label",
        location: { $concat: ["$providerDetails.address.city", ", ", "$providerDetails.address.state"] },
        category: "$category",
        onboarded_status: "$storeStatus",
        date_joined: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $toDate: "$createdAt" },
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limitInt },
  ]);

  console.log(`Fetched ${stores.length} stores`);

  const totalSellers = await Store.countDocuments(matchStage);
  const totalPages = Math.ceil(totalSellers / limitInt);

  return {
    sellers: stores,
    total_sellers: totalSellers,
    total_pages: totalPages,
  };
};

export const fetchDashboardMetrics = async () => {
  const revenueResult = await Order.aggregate([
    { $match: { state: "COMPLETED" } },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $toDouble: "$quote.price.value" },
        },
      },
    },
  ]);

  const total_revenue = revenueResult[0]?.totalRevenue || 0;
  const total_orders = await Order.countDocuments();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeSellersResult = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: "$store" } },
    { $count: "activeSellers" },
  ]);

  const active_sellers = activeSellersResult[0]?.activeSellers || 0;

  const approvedStoreIds = await Order.distinct("store");
  const pending_approvals = await Store.countDocuments({
    _id: { $nin: approvedStoreIds },
  });

  return { total_revenue, total_orders, active_sellers, pending_approvals };
};

export const getStoreProducts = async ({
  searchQuery,
  subCategory,
  limit = 10,
  page = 1,
  storeId,
  isLowStockOnly = false,
}) => {
  try {
    console.log("Checking if store exists:", storeId);

    // Ensure store exists
    const isStoreExist = await Store.exists({ _id: storeId });
    if (!isStoreExist) {
      throw new Error(`Store not found: ${storeId}`);
    }

    // Build Match Query (for search filtering)
    //const matchQuery = this.buildMatchQuery(searchQuery, subCategory, isLowStockOnly);

    // Pagination Setup
    const skip = (Math.max(page, 1) - 1) * limit;

    //console.log("Pagination parameters - skip:", skip, "limit:", limit);

    // Fetch paginated products & total count in a **single query**
    const productsWithCount = await product.aggregate([
      { $match: { store: storeId } },
      {
        $lookup: {
          from: "mastercatalogs",
          localField: "masterProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      //{ $match: matchQuery },
      {
        $facet: {
          metadata: [{ $count: "totalItems" }],
          data: [
            { $project: getProductProjection() },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]);

    const products = productsWithCount[0]?.data || [];
    const totalItems = productsWithCount[0]?.metadata[0]?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    console.log("Products retrieved:", JSON.stringify(products));

    // Return structured response
    return {
      products,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages,
        limit,
      },
    };
  } catch (error) {
    console.error("[ProductService] Error fetching store products:", error);
    throw new Error("Unable to fetch store products");
  }
}

const getProductProjection = () => {
  return {
    _id: 1,
    productCode: "$productDetails.productCode",
    productName: "$productDetails.productName",
    description: "$productDetails.description",
    productCategory: "$productDetails.productCategory",
    images: "$productDetails.images",
    price: 1,
    quantity: 1,
    HSNCode: "$productDetails.HSNCode",
    enabled: 1,
    lowStockThreshold: 1,
    MRP: "$productDetails.MRP",
    GST_Percentage: "$productDetails.GST_Percentage",
    brand: "$productDetails.brand",
    packageUnit: {
      $concat: [
        { $toString: { $ifNull: ["$productDetails.weight", ""] } },
        " ",
        { $ifNull: ["$productDetails.UOM", ""] },
      ],
    },
  };
}

export const fetchSellerDetails = async (storeId) => {
  const store = await Store.findOne({ _id: storeId }).lean();
  if (!store) throw new Error("Store not found");

  const provider = await Provider.findOne({ stores: storeId }).lean();

  // Fetch the user associated with this provider
  const user = await User.findOne({ provider: provider._id }).lean();

  console.log(provider);
  if (!provider) throw new Error("Provider not found");

  const fulfillment = provider.fulfillments[0];
  const deliveryParams = fulfillment?.deliveryParams[0];

  return {
    seller_id: provider._id,
    storeId: storeId,
    owner_details: {
      full_name: user.name,
      mobile: provider.contactDetails.mobile,
      email: provider.contactDetails.email,
    },
    store_details: {
      store_name: provider.businessName,
      category: store.category,
      store_address: formatAddress(store.location.address),
      date_joined: new Date(provider.createdAt).toISOString().split("T")[0],
    },
    business_documents: {
      gst_number: provider.GSTN.GSTN,
      gst_document: {
        document_name: provider.GSTN.proof,
        status: provider.GSTN.proof ? "Verified" : "Pending",
        preview_url: provider.GSTN.proof,
      },
      pan_number: provider.PAN.PAN_NO,
      pan_document: {
        document_name: provider.PAN.proof,
        preview_url: provider.PAN.proof,
      },
      fssai_number: provider.FSSAI?.FSSAI_NO || "FSSAI_NO",
      fssai_document: {
        document_name: provider.FSSAI?.proof || "proof",
        preview_url: provider.FSSAI?.proof || "proof",
      },
      aadhaar_document: {
        document_name: provider.addressProof,
        preview_url: provider.addressProof,
      },
    },
    delivery_settings: {
      delivery_type: fulfillment?.category,
      delivery_distance: `${deliveryParams?.distance} km`,
      delivery_time: `${deliveryParams?.deliveryTime.value} min`,
      delivery_charge: deliveryParams?.deliveryCharge.value,
      service_radius: `${store.serviceability.radius.value} km`,
      minimum_order_price: deliveryParams?.minimumOrderValue?.value || provider.minimum_order_value,
      store_opening_days: store.schedule.openDays,
      store_timings: {
        open: formatTime(store.schedule.timings?.start),
        close: formatTime(store.schedule.timings?.end),
      },
    },
    bank_details: provider.bankDetails,
  };
};

// Optional helper to format "0800" to "08:00 AM"
function formatTime(timeStr) {
  if (!timeStr) return null;
  const hour = parseInt(timeStr.substring(0, 2));
  const minute = parseInt(timeStr.substring(2, 4));
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(formattedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}
