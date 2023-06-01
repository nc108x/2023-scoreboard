import { useGameStates } from "./StatesContextProvider.js";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Info({
  score,
  color,
  winner,
}) {
  const { gameState1 } = useGameStates();

  let bgColor;
  let name;

  if (color == "red") {
    bgColor = "redTeam.main";
    name = gameState1.redDragon;
  } else {
    bgColor = "blueTeam.main";
    name = gameState1.blueDragon;
  }

  const ringsScored = gameState1.historyDelta.filter(
    (element) => element[0] == color
  ).length;

  return (
    <>
      <Paper
        elevation={10}
        sx={{
          width: "330px",
          backgroundColor: bgColor,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4">
          {name + "\nDRAGON"}
        </Typography>
        <Typography variant="h4">{score}</Typography>
        <Typography variant="h6">{"Rings scored: " + ringsScored}</Typography>
        <Typography variant="h6">
          {"Rings remaining: " + (40 - ringsScored)}
        </Typography>
        <Typography variant="h6">
          <Box sx={{ backgroundColor: "#a6e3a1", borderRadius: 2 }}>
            {winner.winner == color ? "CHEY-YO" : " "}
          </Box>
        </Typography>
      </Paper>
    </>
  );
}
