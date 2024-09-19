import { AccordionProps, Accordion as MuiAccordion } from "@mui/material";
import { styled } from "@mui/material-pigment-css";

const StyledMuiAccordion = styled(MuiAccordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

export default function Accordion({ children, ...props }: AccordionProps) {
  return (
    <StyledMuiAccordion {...props} disableGutters elevation={0} square>
      {children}
    </StyledMuiAccordion>
  );
}
