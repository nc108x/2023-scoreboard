import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

export default function Pole({
  pos,
  rings,
  disabled,
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
    <Tooltip TransitionComponent={Zoom} title={hover}>
      {/* <div> */}
      <Fab
        disabled={disabled}
        color={color}
        onClick={redScoreHandler}
        onContextMenu={blueScoreHandler}
        sx={{
          position: "absolute",
          top: pos,
          "&.Mui-disabled": {
            background: "#bac2de",
          },
        }}
      ></Fab>
      {/* </div> */}
    </Tooltip>
  );
}
