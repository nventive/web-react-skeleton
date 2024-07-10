import EPermission from "@enums/EPermission";
import withAuth from "@hocs/withAuth";
import Home from "@pages/home/Home";

const withAuthHome = withAuth(Home, EPermission.HomeRead);

export default withAuthHome;
