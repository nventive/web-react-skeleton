import ExternalLinkOutlined from "@icons/ExternalLinkOutlined";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";
import { Link as RRLink, type LinkProps as RRLinkProps } from "react-router";

type ILink = MuiLinkProps &
  RRLinkProps & {
    external?: boolean;
  };

export default function Link({
  children,
  underline = "hover",
  external,
  rel,
  target,
  ...props
}: ILink) {
  return (
    <MuiLink
      {...props}
      sx={(theme) => ({
        display: "inline-flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        textDecorationColor: "unset",
        cursor: "pointer",
        ".external-link": {
          marginLeft: theme.customProperties.spacing.xxs,
        },
      })}
      component={RRLink}
      underline={underline}
      rel={rel || external ? "noreferrer" : undefined}
      target={target || external ? "_blank" : undefined}
    >
      {children}
      {external && <ExternalLinkOutlined className="external-link" />}
    </MuiLink>
  );
}
