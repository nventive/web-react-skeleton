import { ButtonProps, Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material-pigment-css";
import style from "@styles/style.module.scss";

const StyledMuiButton = styled(MuiButton)({
  borderRadius: style["border-radius-xs"],
});

interface IButton extends ButtonProps {
  target?: string;
}

export default function Button({ children, ...props }: IButton) {
  return <StyledMuiButton {...props}>{children}</StyledMuiButton>;
}
