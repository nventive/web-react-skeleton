import EPermission from "@enums/EPermission";
import withPermissionGuard from "@hocs/withPermissionGuard";
import Home from "@pages/home/Home";

const withPermissionHome = withPermissionGuard(Home, EPermission.HomeRead);

export default withPermissionHome;
