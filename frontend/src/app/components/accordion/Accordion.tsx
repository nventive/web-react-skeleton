import {
  type AccordionProps,
  Accordion as MuiAccordion,
  styled,
} from "@mui/material";

const StyledMuiAccordion = styled(MuiAccordion)(({ theme }) => ({
  boxShadow: theme.shadows[4],
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
