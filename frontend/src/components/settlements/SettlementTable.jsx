import { useSettlementsByStore, runSettlement, updateSettlementStatus } from '../../services/settlementService';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CustomSelect from '../common/CustomSelect';
import { SETTLEMENT_STATE } from '../../utils/constant';
import { useState } from 'react';

const useRunSettlement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: runSettlement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settlements'] }); // Refresh the settlement list
        },
    });
};

const useUpdateSettlementStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSettlementStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settlements'] });
        },
    });
};

const SettlementTable = () => {
    const navigate = useNavigate();
    const { mutate, isPending } = useRunSettlement();
    const { data: settlements = [], isLoading, isError } = useSettlementsByStore();
    const { mutate: updateMutate, isPending: isUpdating } = useUpdateSettlementStatus();
    const [settlementStates, setSettlementStates] = useState({});

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading settlements</div>;

    const handleRunSettlement = () => {
        mutate();
    };

    const handleStoreTypeChange = (settlementId, value) => {
        setSettlementStates((prev) => ({
            ...prev,
            [settlementId]: value,
        }));
    };

    const handleUpdateClick = (settlementId) => {
        const newStatus = settlementStates[settlementId];
        updateMutate({ settlementId, status: newStatus });
    };

    return (
        <div>
            <div className='flex justify-between'>
                <h2 className="text-xl font-semibold mb-4">Settlements</h2>
                <button
                    className='bg-green-500 text-white border border-green-300 px-4 py-2 cursor-pointer disabled:opacity-50'
                    type="button"
                    onClick={handleRunSettlement}
                    disabled={isPending}
                >
                    {isPending ? 'Running...' : 'Run Settlement'}
                </button>
            </div>
            <table className="min-w-full mt-2 border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Settlement ID</th>
                        <th className="border p-2">Date Range</th>
                        <th className="border p-2">Total Payout</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {settlements.map((s) => {
                        const selected = settlementStates[s.settlementId];
                        const isModified = selected && selected !== s.status;

                        return (
                            <tr key={s._id} className="text-center">
                                <td className="border p-2">{s.settlementId}</td>
                                <td className="border p-2">{new Date(s.fromDate).toLocaleDateString()} - {new Date(s.toDate).toLocaleDateString()}</td>
                                <td className="border p-2">₹{s.totals.totalPayout}</td>
                                <td className="border p-2">{s.status}</td>
                                <td className="border px-3 py-2 align-top">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                                        {/* View Button */}
                                        <button
                                            onClick={() => navigate(`/settlement/${s.settlementId}`)}
                                            className="text-blue-600 cursor-pointer font-medium underline hover:text-blue-800 transition"
                                        >
                                            View
                                        </button>

                                        {/* Status Dropdown */}
                                        <CustomSelect
                                            options={Object.values(SETTLEMENT_STATE)}
                                            value={selected || ''}
                                            onChange={(value) => handleStoreTypeChange(s.settlementId, value)}
                                            classNames="min-w-[150px] max-w-[250px] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm border border-gray-300"
                                            placeholder="Select Status"
                                            showClear={false}
                                        />

                                        {/* Update Button */}
                                        {isModified && (
                                            <button
                                                className="bg-blue-600 cursor-pointer text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleUpdateClick(s.settlementId)}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? 'Updating...' : 'Update'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SettlementTable;