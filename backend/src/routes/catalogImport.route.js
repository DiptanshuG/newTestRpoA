import express from 'express';
import multer from 'multer';
import importProductCatalogue from '../services/importProducts.service.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const storeId = req.body.storeId;
        const fileBuffer = req.file.buffer;

        await importProductCatalogue(storeId, fileBuffer);

        res.status(200).json({ message: 'Products imported successfully' });
    } catch (error) {
        console.error("Import Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
