import Box from "@mui/material/Box";

import Pole from "./Pole.js";

import gamefield from "../assets/gamefield.png";

/* coords for each pole */
const pos_x = [25, 25, 25, 130, 130, 200, 280, 280, 380, 380, 380];
const pos_y = [10, 200, 390, 120, 280, 200, 120, 280, 10, 200, 390];

export default function Gamefield({ poles, scoreHandler }) {
  const poleButtons = poles.map((pole, index) => {
    return (
      <Pole
        key={index}
        x={pos_x[index]}
        y={pos_y[index]}
        rings={pole}
        redScoreHandler={(e) => scoreHandler(e, index, "red")}
        blueScoreHandler={(e) => scoreHandler(e, index, "blue")}
      />
    );
  });

  return (
    <>
      <Box
        sx={{
          width: 462,
          height: 462,
          backgroundImage: "url(" + gamefield + ")",
          position: "relative",
        }}
      >
        {poleButtons}
      </Box>
    </>
  );
}
