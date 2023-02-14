import Fab from "@mui/material/Fab";

import theme from "../Theme.js";
import { ThemeProvider } from "@mui/material/styles";

export default function Pole({
  pos,
  rings,
  redScoreHandler,
  blueScoreHandler,
}) {
  /* determine current of pole */
  let color =
    rings.at(-1) == "red"
      ? "redTeam"
      : rings.at(-1) == "blue"
      ? "blueTeam"
      : "standbyColor";

  return (
    <ThemeProvider theme={theme}>
      <Fab
        color={color}
        onClick={redScoreHandler}
        onContextMenu={blueScoreHandler}
        sx={{ position: "absolute", top: pos }}
      ></Fab>
    </ThemeProvider>
  );
}
