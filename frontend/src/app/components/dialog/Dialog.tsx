import Slide from "@components/slide/Slide";
import { DialogProps, Dialog as MuiDialog, styled } from "@mui/material";
import style from "@styles/style.module.scss";

const StyledMuiDialog = styled(MuiDialog)({
  "& .MuiDialog-paper": {
    margin: style["spacing-md"],
  },
});

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
