import {
  TableRow as MuiTableRow,
  styled,
  TableCell,
  TableRowProps,
} from "@mui/material";
import style from "@styles/style.module.scss";

interface ITableRow extends TableRowProps {
  columns: string[];
}

const StyledMuiTableRow = styled(MuiTableRow)({
  "&:last-child td, &:last-child th": { border: 0 },
  "&:nth-of-type(odd)": {
    backgroundColor: style["basic-background"],
  },
});

export default function TableRow({ columns, ...props }: ITableRow) {
  return (
    <StyledMuiTableRow {...props}>
      {columns.map((column, index) => (
        <TableCell key={index}>{column}</TableCell>
      ))}
    </StyledMuiTableRow>
  );
}
