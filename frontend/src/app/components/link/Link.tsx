import { LinkProps, Link as MuiLink, styled } from "@mui/material";
import style from "@styles/style.module.scss";

const StyledMuiLink = styled(MuiLink)({
  display: "flex",
  color: style["primary-main"],
  textDecorationColor: "unset",
  cursor: "pointer",
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
