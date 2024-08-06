import { LinkProps, Link as MuiLink, styled } from "@mui/material";
import style from "@styles/style.module.scss";

const StyledMuiLink = styled(MuiLink)({
  color: style["primary-main"],
  cursor: "pointer",
  display: "flex",
  textDecorationColor: "unset",
});

export default function Link({
  children,
  underline = "hover",
  ...props
}: LinkProps) {
  return (
    <StyledMuiLink underline={underline} {...props}>
      {children}
    </StyledMuiLink>
  );
}
