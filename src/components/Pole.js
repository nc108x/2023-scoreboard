import Fab from "@mui/material/Fab";

export default function Pole({
  pos,
  rings,
  redScoreHandler,
  blueScoreHandler,
}) {
  /* determine current of pole */
  /* TODO fix the colors */
  let color =
    rings.at(-1) == "red"
      ? "error"
      : rings.at(-1) == "blue"
      ? "info"
      : "warning";

  return (
    <Fab
      color={color}
      onClick={redScoreHandler}
      onContextMenu={blueScoreHandler}
      sx={{ position: "absolute", top: pos }}
    ></Fab>
  );
}
