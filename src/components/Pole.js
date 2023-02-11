import { useState } from "react";
import Fab from "@mui/material/Fab";

/* pole button component */
export default function Pole({ color, type }) {
  let [rings, setRings] = useState([]);

  function redScoreHandler() {
    setRings([...rings, "red"]);

    /* console.log(color); */
    /* console.log(type); */
    /* console.log(rings); */
  }

  function blueScoreHandler(e) {
    /* to prevent right click menu from showing up */
    e.preventDefault();
    setRings([...rings, "blue"]);

    /* console.log(color); */
    /* console.log(type); */
    /* console.log(rings); */
  }

  /* determine current of pole */
  /* TODO fix the colors */
  color =
    rings.at(-1) == "red"
      ? "error"
      : rings.at(-1) == "blue"
      ? "info"
      : "warning";

  return (
    <Fab
      color={color}
      onClick={redScoreHandler}
      onContextMenu={(e) => {
        blueScoreHandler(e);
      }}
    >
      hey
    </Fab>
  );
}
