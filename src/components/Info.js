import { useGameStates } from "./StatesContextProvider.js";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Info({ color }) {
  const { gameState, gameResult } = useGameStates();

  let bgColor;
  let name;

  if (color == "red") {
    bgColor = "redTeam.main";
    name = gameState.redDragon;
  } else {
    bgColor = "blueTeam.main";
    name = gameState.blueDragon;
  }

  const ringsScored = gameState.historyDelta
    .slice(0, gameState.historyDelta.length + gameState.pointInTime + 1)
    .filter((element) => element[0] == color).length;

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
        <Typography variant="h4">{name + "\nDRAGON"}</Typography>
        <Typography variant="h4">{color == "red" ? gameResult.current.redScore : gameResult.current.blueScore}</Typography>
        <Typography variant="h6">{"Rings scored: " + ringsScored}</Typography>
        <Typography variant="h6">
          {"Rings remaining: " + (40 - ringsScored)}
        </Typography>
        <Typography variant="h6">
          <Box sx={{ backgroundColor: "#a6e3a1", borderRadius: 2 }}>
            {gameResult.current.winner == color ? "CHEY-YO" : " "}
          </Box>
        </Typography>
      </Paper>
    </>
  );
}
