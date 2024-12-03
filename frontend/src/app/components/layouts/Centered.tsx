import { styled } from "@mui/material-pigment-css";

interface ILayout {
  className?: string;
  children: React.ReactNode;
}

const LayoutAuth = styled("main")(({ theme }) => ({
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

function Centered({ className, children }: ILayout) {
  return (
    <LayoutAuth className={className}>
      <div className="content">{children}</div>
    </LayoutAuth>
  );
}

export default Centered;
