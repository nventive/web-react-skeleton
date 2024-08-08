import { Slide as MuiSlide, SlideProps } from "@mui/material";
import { forwardRef, Ref } from "react";

const Slide = forwardRef(function Slide(
  { direction = "up", timeout = 5000, ...props }: SlideProps,
  ref: Ref<unknown>,
) {
  return (
    <MuiSlide ref={ref} direction={direction} timeout={timeout} {...props} />
  );
});

export default Slide;
