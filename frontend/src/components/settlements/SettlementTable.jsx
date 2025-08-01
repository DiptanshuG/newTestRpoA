import { useSettlementsByStore, runSettlement } from '../../services/settlementService';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRunSettlement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: runSettlement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settlements'] }); // Refresh the settlement list
        },
    });
};

const SettlementTable = () => {
    const navigate = useNavigate();
    const { mutate, isPending } = useRunSettlement();
    const { data: settlements = [], isLoading, isError } = useSettlementsByStore();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading settlements</div>;

    const handleRunSettlement = () => {
        mutate();
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
                        <th className="border p-2">Total Orders</th>
                        <th className="border p-2">Total Payout</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {settlements.map((s) => (
                        <tr key={s._id} className="text-center">
                            <td className="border p-2">{s.settlementId}</td>
                            <td className="border p-2">{new Date(s.fromDate).toLocaleDateString()} - {new Date(s.toDate).toLocaleDateString()}</td>
                            <td className="border p-2">{s.totals.totalOrders}</td>
                            <td className="border p-2">₹{s.totals.totalPayout}</td>
                            <td className="border p-2">{s.status}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => navigate(`/settlement/${s.settlementId}`)}
                                    className="text-blue-600 underline"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SettlementTable;