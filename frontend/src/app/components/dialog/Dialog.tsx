import { type DialogProps, Dialog as MuiDialog, styled } from "@mui/material";

const StyledMuiDialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: theme.spacing(2),
  },
}));

export default function Dialog({ ...props }: DialogProps) {
  return (
    <StyledMuiDialog disableScrollLock {...props}>
      {props.children}
    </StyledMuiDialog>
  );
}
