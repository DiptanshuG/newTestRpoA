import DashboardLayout from '../layout/DashboardLayout';
import SettlementTable from '../components/settlements/SettlementTable';

const SettlementsList = () => {
    return (
        <DashboardLayout title="All Settlements">
            <SettlementTable />
        </DashboardLayout>
    );
};

export default SettlementsList;