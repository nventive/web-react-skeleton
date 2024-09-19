import { ReactNode } from "react";
import { styled } from "@mui/material-pigment-css";

interface ILayout {
  children: ReactNode;
  className?: string;
}

const LayoutContainer = styled("main")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(2),
  alignItems: "center",
  backgroundColor: "#fafafb", // TODO: get this from theme

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },

  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(6),
  },

  [theme.breakpoints.up("xl")]: {
    padding: theme.spacing(8),
  },

  "> .content": {
    maxWidth: "82.5rem",
    width: "100%",
  },
}));

function Container({ children, className }: ILayout) {
  return (
    <LayoutContainer className={className}>
      <div className="content">{children}</div>
    </LayoutContainer>
  );
}

const LayoutAuth = styled("main")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fafafb", // TODO: get this from theme

  [theme.breakpoints.up("xs")]: {
    flex: "1 1 auto",
  },

  "> .content": {
    maxWidth: "82.5rem",
    width: "100%",

    [theme.breakpoints.up("xs")]: {
      maxWidth: 442,
      padding: theme.spacing(2),
    },
  },
}));

function Auth({ children, className }: ILayout) {
  return (
    <LayoutAuth className={className}>
      <div className="content">{children}</div>
    </LayoutAuth>
  );
}

const Layout = {
  Container,
  Auth,
};

export default Layout;
