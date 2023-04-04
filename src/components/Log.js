import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Log({ historyDelta, color, pointInTime }) {
  const logTable = historyDelta.map((action, index) => {
    if (
      action != "empty" &&
      action[0] == color &&
      index >= -(pointInTime + 1)
    ) {
      return (
        <TableRow key={index} sx={{ bgColor: "redTeam.main" }}>
          <TableCell>{"Scored pole " + (action[1] + 1)}</TableCell>
          <TableCell>{action[2]}</TableCell>
        </TableRow>
      );
    }
  });

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 200, minHeight: 200, maxWidth: 300, minWidth: 300 }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{"ACTION"}</TableCell>
            <TableCell>{"TIME"}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{logTable}</TableBody>
      </Table>
    </TableContainer>
  );
}
