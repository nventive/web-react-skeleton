import Slide from "@components/slide/Slide";
import { DialogProps, Dialog as MuiDialog, styled } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import style from "@styles/style.module.scss";
import { forwardRef, JSXElementConstructor, ReactElement, Ref } from "react";

const StyledMuiDialog = styled(MuiDialog)({
  "& .MuiDialog-paper": {
    margin: style["spacing-md"],
  },
});

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<unknown, JSXElementConstructor<unknown>>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

export default function Dialog({ ...props }: DialogProps) {
  return (
    <StyledMuiDialog
      disableScrollLock
      TransitionComponent={Transition}
      {...props}
    >
      {props.children}
    </StyledMuiDialog>
  );
}
