import express from "express";
import multer from "multer";
import * as masterCatalogController from "../controllers/masterCatalogController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 19 * 1024 * 1024 }, // 5MB file size limit
}).array("images", 10); // Accept up to 10 images

router.post("/:id/upload", upload, masterCatalogController.uploadProductImages);
router.post("/", masterCatalogController.createProduct);
router.get("/", masterCatalogController.getProducts);
router.delete("/:id", masterCatalogController.deleteProduct);
router.put("/:id", masterCatalogController.updateProduct);
router.get("/:id", masterCatalogController.getProductById);

router.put("/data/update", masterCatalogController.updateProductData);


export default router;
