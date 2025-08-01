import * as SettlementService from '../services/settlement.service.js';

export const runSettlementFlow = async (req, res) => {
    try {
        const result = await SettlementService.runSettlementFlow();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSettlementsByStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const settlements = await SettlementService.getSettlementsByStore(storeId);
        res.status(200).json(settlements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSettlementDetails = async (req, res) => {
    try {
        const { settlementId } = req.params;
        const settlement = await SettlementService.getSettlementDetails(settlementId);
        res.status(200).json(settlement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateSettlementStatus = async (req, res) => {
    try {
        const { settlementId } = req.params;
        const { status, remarks, utrNumber, settledBy } = req.body;
        const updated = await SettlementService.updateSettlementStatus(settlementId, {
            status, remarks, utrNumber, settledBy
        });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
