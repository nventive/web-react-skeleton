import ExternalLinkOutlined from "@icons/ExternalLinkOutlined";
import { LinkProps, Link as MuiLink } from "@mui/material";
import { styled } from "@mui/material-pigment-css";

const StyledMuiLink = styled(MuiLink)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.primary.main,
  textDecorationColor: "unset",
  cursor: "pointer",

  ".external-link": {
    marginLeft: theme.customProperties.spacing.xxs,
  },
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
      {external && <ExternalLinkOutlined className="external-link" />}
    </StyledMuiLink>
  );
}
