import { useGameStates } from "./StatesContextProvider.js";

import Box from "@mui/material/Box";

import Pole from "./Pole.js";
import gamefield_red from "../assets/gamefield_clean_red.png";
import gamefield_blue from "../assets/gamefield_clean_blue.png";

/* coords for each pole */
const pos_x_red = [25, 200, 380, 130, 280, 200, 130, 280, 25, 200, 380];
const pos_y_red = [390, 390, 390, 280, 280, 200, 120, 120, 10, 10, 10];

const pos_x_blue = [380, 200, 25, 280, 130, 200, 280, 130, 380, 200, 25];
const pos_y_blue = [10, 10, 10, 120, 120, 200, 280, 280, 390, 390, 390];

export default function Gamefield({}) {
  const { gameState, options } = useGameStates();

  const poleButtons = gameState.currPoles.map((pole, index) => {
    return (
      <Pole
        key={index}
        index={index}
        x={
          options.orientation == "SOUTH" ? pos_x_red[index] : pos_x_blue[index]
        }
        y={
          options.orientation == "SOUTH" ? pos_y_red[index] : pos_y_blue[index]
        }
        rings={pole}
      />
    );
  });

  const gamefield =
    options.orientation == "SOUTH" ? gamefield_red : gamefield_blue;

  return (
    <>
      <Box
        sx={{
          minWidth: 462,
          minHeight: 462,
          width: "50%",
          backgroundImage: "url(" + gamefield + ")",
          position: "relative",
        }}
      >
        {poleButtons}
      </Box>
    </>
  );
}
