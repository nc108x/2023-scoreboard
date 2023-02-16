import Fab from "@mui/material/Fab";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

export default function Pole({
  pos,
  rings,
  redScoreHandler,
  blueScoreHandler,
}) {
  /* determine current of pole */
  const color =
    rings.at(-1) == "red"
      ? "redTeam"
      : rings.at(-1) == "blue"
        ? "blueTeam"
        : "standbyColor";

  const hover =
    "Red: " +
    rings.filter((element) => element == "red").length +
    " | Blue: " +
    rings.filter((element) => element == "blue").length;

  return (
    <Tooltip title={hover}>
      <Fab
        color={color}
        onClick={redScoreHandler}
        onContextMenu={blueScoreHandler}
        sx={{ position: "absolute", top: pos }}
      ></Fab>
    </Tooltip>
  );
}
