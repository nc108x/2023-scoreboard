import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Log({ history }) {
  console.log(history);
  const temp = history.map((a) => {
    return (
      <TableBody>
        <TableCell>{"hi"}</TableCell>
      </TableBody>
    );
  });

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 200, minWidth: 300 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableHead>
        {temp}
      </Table>
    </TableContainer>
  );
}
