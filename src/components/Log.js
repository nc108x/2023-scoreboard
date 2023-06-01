import { useGameStates } from "./StatesContextProvider.js";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Log({ color, winner, orientation }) {
  const { gameState } = useGameStates();

  const logTable = gameState.historyDelta
    .slice(0, gameState.historyDelta.length + gameState.pointInTime + 1)
    .reverse()
    .map((action, index) => {
      if (action != "empty" && action[0] == color) {
        if (
          winner.winner == color &&
          index == gameState.historyDelta.length - winner.time
        ) {
          return (
            <>
              <TableRow key={index + 100}>
                <TableCell>{"CHEY-YO"}</TableCell>
                <TableCell>{action[2]}</TableCell>
              </TableRow>
              <TableRow key={index}>
                <TableCell>
                  {"Scored pole " +
                    (orientation == "red" ? action[1] + 1 : 11 - action[1])}
                </TableCell>
                <TableCell>{action[2]}</TableCell>
              </TableRow>
            </>
          );
        }
        return (
          <TableRow key={index}>
            <TableCell>
              {"Scored pole " +
                (orientation == "red" ? action[1] + 1 : 11 - action[1])}
            </TableCell>
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
            <TableCell>ACTION</TableCell>
            <TableCell>TIME</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{logTable}</TableBody>
      </Table>
    </TableContainer>
  );
}
