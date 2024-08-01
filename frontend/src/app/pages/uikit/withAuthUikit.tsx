import EPermission from "@enums/EPermission";
import withAuth from "@hocs/withAuth";
import UiKit from "./UiKit";

const withAuthUikit = withAuth(UiKit, EPermission.UikitRead);

export default withAuthUikit;
