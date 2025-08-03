import * as SettlementService from '../services/settlement.service.js';

export const runSettlementFlow = async (req, res) => {
    try {
        const result = await SettlementService.runSettlementFlow();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllSettlements = async (req, res) => {
    try {
        const settlements = await SettlementService.getAllSettlements();
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
        const { status } = req.body;
        const updated = await SettlementService.updateSettlementStatus(settlementId, {
            status
        });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const removeSettlementIds = async (req, res) => {
    try {
        const result = await SettlementService.clearSettlementReferences();
        res.status(200).json({
            message: 'Settlement IDs removed successfully from Orders and SellerInvoices.',
            result,
        });
    } catch (error) {
        console.error('Error clearing settlement IDs:', error);
        res.status(500).json({ message: 'Failed to remove settlement IDs', error });
    }
};