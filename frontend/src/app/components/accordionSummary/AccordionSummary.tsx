import CaretIcon from "@icons/CaretIcon";
import {
  AccordionSummaryProps,
  AccordionSummary as MuiAccordionSummary,
  styled,
} from "@mui/material";
import style from "@styles/style.module.scss";

const StyledMuiAccordionSummary = styled(MuiAccordionSummary)({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: style["spacing-md"],
    alignItems: "center",
  },
});

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