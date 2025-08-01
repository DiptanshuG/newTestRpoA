import express from 'express';
import {
    runSettlementFlow,
    getAllSettlements,
    getSettlementDetails,
    updateSettlementStatus,
    removeSettlementIds
} from '../controllers/settlement.controller.js';

const router = express.Router();

router.post('/run', runSettlementFlow);
router.get('/all', getAllSettlements);
router.get('/:settlementId', getSettlementDetails);
router.put('/:settlementId', updateSettlementStatus);
router.delete('/clear', removeSettlementIds);

export default router;
