import Slide from "@components/slide/Slide";
import { DialogProps, Dialog as MuiDialog } from "@mui/material";
import { styled } from "@mui/material-pigment-css";

const StyledMuiDialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: theme.spacing(2),
  },
}));

export default function Dialog({ ...props }: DialogProps) {
  return (
    <StyledMuiDialog
      disableScrollLock
      TransitionComponent={Slide}
      TransitionProps={{
        timeout: 500,
      }}
      {...props}
    >
      {props.children}
    </StyledMuiDialog>
  );
}
