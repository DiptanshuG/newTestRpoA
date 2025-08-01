import { fetchAdminSellers, fetchDashboardMetrics, fetchSellerDetails, getStoreProducts } from "../services/SellerService.js";

export const getAdminSellers = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const data = await fetchAdminSellers({ status, page, limit });
    res.json(data);
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await fetchDashboardMetrics();
    res.status(200).json(metrics);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSellerDetailsById = async (req, res) => {
  try {
    const { storeId } = req.params;
    const data = await fetchSellerDetails(storeId);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error getting seller details:", err);
    res.status(404).json({ message: err.message });
  }
};

export const getAllStoreProducts = async (req, res) => {
  try {

    const storeId = req.params.storeId;
    //const { category, subCategory, searchQuery, limit, page, isLowStockOnly } = req.body;

    const searchCriteria = {};

    //if (category) searchCriteria.category = category;
    // if (subCategory) searchCriteria.subCategory = subCategory;
    // if (searchQuery) searchCriteria.searchQuery = searchQuery;

    searchCriteria.limit = 100;
    searchCriteria.page = 1;
    searchCriteria.storeId = storeId;
    // searchCriteria.isLowStockOnly = isLowStockOnly;

    //console.log(`[ProductController] [getAllStoreProducts] storeId: ${storeId}, searchCriteria: ${JSON.stringify(searchCriteria)}`);

    const result = await getStoreProducts(searchCriteria);

    res.status(200).json(result);
  }
  catch (error) {
    console.error("[ProductController] Error getting all store products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const updateSellerStatus = async (req, res) => {
  try {
    const { seller_id, status } = req.body;

    const allowedStatuses = ['Approved', 'Rejected', 'Deactivated'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const seller = await Provider.findById(seller_id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    seller.storeOndcStatus = {
      label: status.toLowerCase(),
      timestamp: new Date().toISOString(),
    };
    await seller.save();

    await logAdminAction({
      action: `Seller status changed to "${status}"`,
      sellerId: seller_id,
    });

    await sendSellerNotification(seller.contactDetails?.email, `Your seller account status has been updated to "${status}".`);

    return res.status(200).json({ message: 'Seller status updated successfully.' });
  } catch (error) {
    console.error('Error updating seller status:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
