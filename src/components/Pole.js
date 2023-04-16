import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

export default function Pole({
  x,
  y,
  index,
  rings,
  redScoreHandler,
  blueScoreHandler,
  orientation,
}) {
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
    <Tooltip TransitionComponent={Zoom} title={hover}>
      <Fab
        color={color}
        onClick={redScoreHandler}
        onContextMenu={blueScoreHandler}
        sx={{
          position: "absolute",
          top: y,
          left: x,
          fontSize: 28,
        }}
      >
        {orientation == "red" ? index + 1 : 11 - index}
      </Fab>
    </Tooltip>
  );
}
