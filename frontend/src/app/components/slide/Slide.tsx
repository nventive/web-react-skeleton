import { Slide as MuiSlide, SlideProps } from "@mui/material";

export default function Slide({
  direction = "up",
  timeout = 500,
  ...props
}: SlideProps) {
  return <MuiSlide direction={direction} timeout={timeout} {...props} />;
}
