import {
  TableRow as MuiTableRow,
  TableCell,
  TableRowProps,
} from "@mui/material";
import { styled } from "@mui/material-pigment-css";

interface ITableRow extends TableRowProps {
  columns: string[];
}

const StyledMuiTableRow = styled(MuiTableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": { border: 0 },
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.background.default,
  },
}));

export default function TableRow({ columns, ...props }: ITableRow) {
  return (
    <StyledMuiTableRow {...props}>
      {columns.map((column, index) => (
        <TableCell key={index}>{column}</TableCell>
      ))}
    </StyledMuiTableRow>
  );
}
