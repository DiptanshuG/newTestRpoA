import express from 'express';
import {
    runSettlementFlow,
    getSettlementsByStore,
    getSettlementDetails,
    updateSettlementStatus
} from '../controllers/settlement.controller.js';

const router = express.Router();

router.post('/run', runSettlementFlow);
router.get('/store/:storeId', getSettlementsByStore);
router.get('/:settlementId', getSettlementDetails);
router.put('/:settlementId', updateSettlementStatus);

export default router;
