import { useState } from "react";
import Fab from "@mui/material/Fab";

export default function Pole({
  pos,
  rings,
  redScoreHandler,
  blueScoreHandler,
}) {
  /* let [rings, setRings] = useState([]); */

  /* function redScoreHandler() { */
  /*   setRings([...rings, "red"]); */

  /* console.log(color); */
  /* console.log(type); */
  /*   console.log(rings); */
  /* } */

  /* function blueScoreHandler(e) { */
  /* to prevent right click menu from showing up */
  /*   e.preventDefault(); */
  /*   setRings([...rings, "blue"]); */
  /**/
  /*   console.log(color); */
  /*   console.log(type); */
  /*   console.log(rings); */
  /* } */

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
