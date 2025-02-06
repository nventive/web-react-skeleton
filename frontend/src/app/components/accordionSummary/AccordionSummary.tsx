import CaretIcon from "@icons/CaretIcon";
import {
  type AccordionSummaryProps,
  AccordionSummary as MuiAccordionSummary,
  styled,
} from "@mui/material";

const StyledMuiAccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    alignItems: "center",
  },
}));

export default function AccordionSummary({
  children,
  expandIcon = <CaretIcon width={16} height={16} />,
  ...props
}: AccordionSummaryProps) {
  return (
    <StyledMuiAccordionSummary {...props} expandIcon={expandIcon}>
      {children}
    </StyledMuiAccordionSummary>
  );
}
