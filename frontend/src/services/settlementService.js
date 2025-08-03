import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/admin`;

export const useSettlementsByStore = () => {
    return useQuery({
        queryKey: ['settlements'],
        queryFn: () => fetchAllSettlements(),
    });
};

export const fetchAllSettlements = async () => {
    const { data } = await axios.get(`${BASE_URL}/settlement/all`);
    return data;
};

export const fetchSettlementById = async (settlementId) => {
    const { data } = await axios.get(`${BASE_URL}/settlement/${settlementId}`);
    return data;
};

export const runSettlement = async () => {
    const response = await axios.post(`${BASE_URL}/settlement/run`);
    return response.data;
};

export const updateSettlementStatus = async ({ settlementId, status }) => {
    const response = await axios.put(`${BASE_URL}/settlement/${settlementId}`, { status });
    return response.data;
};