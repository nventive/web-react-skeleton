import EPermission from "@enums/EPermission";
import withAuth from "@hocs/withAuth";
import Dashboard from "@pages/dashbaord/Dashboard";

const withAuthDashboard = withAuth(Dashboard, EPermission.DashboardRead);

export default withAuthDashboard;
