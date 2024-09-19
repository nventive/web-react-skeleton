import ExternalLinkOutlined from "@icons/ExternalLinkOutlined";
import { LinkProps, Link as MuiLink } from "@mui/material";
import { styled } from "@mui/material-pigment-css";

const StyledMuiLink = styled(MuiLink)(({ theme }) => ({
  display: "flex",
  color: theme.palette.primary.main,
  textDecorationColor: "unset",
  cursor: "pointer",
}));

interface ILink extends LinkProps {
  external?: boolean;
}

export default function Link({
  children,
  underline = "hover",
  external,
  rel,
  target,
  ...props
}: ILink) {
  return (
    <StyledMuiLink
      {...props}
      underline={underline}
      rel={rel || external ? "noreferrer" : undefined}
      target={target || external ? "_blank" : undefined}
    >
      {children}
      {external && <ExternalLinkOutlined className="ml-xxs" />}
    </StyledMuiLink>
  );
}
