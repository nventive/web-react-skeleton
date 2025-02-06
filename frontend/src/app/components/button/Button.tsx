import { type ButtonProps, Button as MuiButton, styled } from "@mui/material";

const StyledMuiButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.customProperties.borderRadius.xs,
}));
interface IButton extends ButtonProps {
  target?: string;
}

export default function Button({ children, ...props }: IButton) {
  return <StyledMuiButton {...props}>{children}</StyledMuiButton>;
}
