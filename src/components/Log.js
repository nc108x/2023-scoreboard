import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Log({ historyDelta, color }) {
  const logTable = historyDelta.map((action, index) => {
    if (action != "empty" && action[0] == color) {
      return (
        <TableBody key={index}>
          <TableCell>{"Scored pole " + (action[1] + 1)}</TableCell>
          <TableCell>{action[2]}</TableCell>
        </TableBody>
      );
    }
  });

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 200, minHeight: 200, maxWidth: 300, minWidth: 300 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{"ACTION"}</TableCell>
            <TableCell>{"TIME"}</TableCell>
          </TableRow>
        </TableHead>
        {logTable}
      </Table>
    </TableContainer>
  );
}
