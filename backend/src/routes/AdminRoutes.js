import express from 'express';
import { login, signup } from '../controllers/AdminController.js';
import { getAdminSellers, getDashboardMetrics, getSellerDetailsById, getAllStoreProducts } from '../controllers/SellerController.js';
import { validate } from '../middlewares/validate.js';
import settlementRoutes from './settlement.route.js';

import { loginSchema, registerSchema } from '../schemas/AuthSchema.js';

import masterCatalogRoutes from "./masterCatalog.js";

import catalogImportRoute from './catalogImport.route.js';

const router = express.Router();

router.post('/signup', validate(registerSchema), signup);
router.post('/login', validate(loginSchema), login);

router.get("/sellers", getAdminSellers);
router.get("/sellers/:storeId", getSellerDetailsById);
router.get("/sellers/:storeId/products", getAllStoreProducts); // Assuming you have a getSellerProducts function in SellerController
router.get("/dashboard/metrics", getDashboardMetrics);
router.use("/mastercatalog", masterCatalogRoutes);

router.use("/sellers/import-catalogue", catalogImportRoute);

// Settlement Flow
router.use('/settlement', settlementRoutes);

export default router;