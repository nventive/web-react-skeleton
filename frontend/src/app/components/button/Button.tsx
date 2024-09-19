import { ButtonProps, Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material-pigment-css";

const StyledMuiButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.customProperties.borderRadius.xs,
}));
interface IButton extends ButtonProps {
  target?: string;
}

export default function Button({ children, ...props }: IButton) {
  return <StyledMuiButton {...props}>{children}</StyledMuiButton>;
}
