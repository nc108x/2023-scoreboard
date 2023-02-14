import Fab from "@mui/material/Fab";

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
    <Fab
      color={color}
      onClick={redScoreHandler}
      onContextMenu={blueScoreHandler}
      sx={{ position: "absolute", top: pos }}
    ></Fab>
  );
}
