import { AccordionProps, Accordion as MuiAccordion } from "@mui/material";
import { styled } from "@mui/material-pigment-css";
import style from "@styles/style.module.scss";

const StyledMuiAccordion = styled(MuiAccordion)({
  border: `1px solid ${style["stone-veryLight"]}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
});

export default function Accordion({ children, ...props }: AccordionProps) {
  return (
    <StyledMuiAccordion {...props} disableGutters elevation={0} square>
      {children}
    </StyledMuiAccordion>
  );
}
