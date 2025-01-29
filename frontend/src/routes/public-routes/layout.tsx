import { styled } from "@mui/material";
import { Outlet } from "react-router";

const Layout = styled("main")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),

  [theme.breakpoints.up("xs")]: {
    flex: "1 1 auto",
  },

  "> .content": {
    maxWidth: 442,
    width: "100%",

    [theme.breakpoints.up("sm")]: {
      maxWidth: 442,
    },
  },
}));

export default function Centered() {
  return (
    <Layout>
      <div className="content">
        <Outlet />
      </div>
    </Layout>
  );
}
