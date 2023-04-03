import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Log({ historyDelta, color }) {
  console.log(historyDelta);
  const logTable = historyDelta.map((action) => {
    if (action != "empty" && action[0] == color) {
      return (
        <TableBody>
          <TableCell>{"Scored pole " + (action[1] + 1)}</TableCell>
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
            <TableCell>Test</TableCell>
          </TableRow>
        </TableHead>
        {logTable}
      </Table>
    </TableContainer>
  );
}
