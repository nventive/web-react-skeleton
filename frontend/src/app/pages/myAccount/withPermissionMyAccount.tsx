import EPermission from "@enums/EPermission";
import withPermissionGuard from "@hocs/withPermissionGuard";
import MyAccount from "@pages/myAccount/MyAccount";

const withPermissionMyAccount = withPermissionGuard(
  MyAccount,
  EPermission.DashboardRead,
);

export default withPermissionMyAccount;
