import Box from "@mui/material/Box";

import Pole from "./Pole.js";
import gamefield_red from "../assets/gamefield_clean_red.png";
import gamefield_blue from "../assets/gamefield_clean_blue.png";

/* coords for each pole */
const pos_x_red = [25, 200, 380, 130, 280, 200, 130, 280, 25, 200, 380];
const pos_y_red = [390, 390, 390, 280, 280, 200, 120, 120, 10, 10, 10];

const pos_x_blue = [380, 200, 25, 280, 130, 200, 280, 130, 380, 200, 25];
const pos_y_blue = [10, 10, 10, 120, 120, 200, 280, 280, 390, 390, 390];

export default function Gamefield({ poles, scoreHandler, orientation }) {
  const poleButtons = poles.map((pole, index) => {
    return (
      <Pole
        key={index}
        index={index}
        x={orientation == "red" ? pos_x_red[index] : pos_x_blue[index]}
        y={orientation == "red" ? pos_y_red[index] : pos_y_blue[index]}
        rings={pole}
        redScoreHandler={(e) => scoreHandler(e, index, "red")}
        blueScoreHandler={(e) => scoreHandler(e, index, "blue")}
        orientation={orientation}
      />
    );
  });

  const gamefield = orientation == "red" ? gamefield_red : gamefield_blue;

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
