import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableProps,
  TableRow,
} from "@mui/material";

interface ITable extends TableProps {
  columnTitles: string[];
}

export default function Table({ children, columnTitles, ...props }: ITable) {
  return (
    <TableContainer>
      <MuiTable {...props}>
        <TableHead>
          <TableRow>
            {columnTitles.map((columnTitle, index) => (
              <TableCell key={index}>{columnTitle}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </MuiTable>
    </TableContainer>
  );
}
