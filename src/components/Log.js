import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Log({ historyDelta, color }) {
  let bgColor;
  if (color == "red") {
    bgColor = "redTeam.main";
  } else {
    bgColor = "blueTeam.main";
  }

  const logTable = historyDelta.map((action, index) => {
    if (action != "empty" && action[0] == color) {
      return (
        <TableRow key={index}>
          <TableCell>{"Scored pole " + (action[1] + 1)}</TableCell>
          <TableCell>{action[2]}</TableCell>
        </TableRow>
      );
    }
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        height: 200,
        width: 330,

        "& th: nth-of-type(n)": {
          backgroundColor: "#ffffff",
        },
        /* "& tr: nth-of-type(n)": { */
        /*   backgroundColor: bgColor, */
        /* }, */
      }}
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
