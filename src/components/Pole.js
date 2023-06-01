import { useGameStates } from "./StatesContextProvider.js";

import { elapsedTime } from "./Timer.js";

import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import { enqueueSnackbar } from "notistack";

export default function Pole({
  x,
  y,
  index,
  rings,
  orientation,
}) {
  const { gameState1, setGameState1 } = useGameStates();

  function scoreHandler(e, pole_no, color) {
    /* to prevent right click menu from showing up */
    e.preventDefault();

    const ringsScored = gameState1.historyDelta
      .slice((gameState1.pointInTime + 1) * -1)
      .filter((element) => element[0] == color).length;

    if (ringsScored == 40) {
      enqueueSnackbar(
        (color == "red" ? gameState1.redDragon : gameState1.blueDragon) +
          " Dragon has used up their rings!",
        {
          variant: "error",
        }
      );
      return;
    }

    if (gameState1.stage == "GAME" || gameState1.stage == "END") {
      let temp = [...gameState1.currPoles];
      temp[pole_no] = [...gameState1.currPoles[pole_no], color];

      /* update the timeline so that undo/redo will work as intended */
      /* when a new ring is added, prune the (undone) future and set the current point in time to be the present */
      if (gameState1.stage == "GAME") {
        /* also update delta for the log */
        setGameState1({
          history: [
            ...gameState1.history.slice(
              0,
              gameState1.history.length + gameState1.pointInTime + 1
            ),
            temp,
          ],
          historyDelta: [
            ...gameState1.historyDelta.slice(
              0,
              gameState1.historyDelta.length + gameState1.pointInTime + 1
            ),
            [
              color,
              pole_no,
              elapsedTime.min + ":" + elapsedTime.sec + ":" + elapsedTime.ms,
            ],
          ],
          pointInTime: -1,
          currPoles: temp,
        });
      } else {
        /* game has ended */
        /* same thing as above but fix timestamp and ping user with a warning */
        enqueueSnackbar("Currently modifying rings after game has ended.", {
          variant: "warning",
        });

        setGameState1({
          history: [
            ...gameState1.history.slice(
              0,
              gameState1.history.length + gameState1.pointInTime + 1
            ),
            temp,
          ],
          historyDelta: [
            ...gameState1.historyDelta.slice(
              0,
              gameState1.historyDelta.length + gameState1.pointInTime + 1
            ),
            [color, pole_no, "03:00:00"],
          ],
          pointInTime: -1,
          currPoles: temp,
        });
      }
    } else {
      enqueueSnackbar("Cannot interact with poles in preparation time!", {
        variant: "error",
      });
    }
  }

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
        onClick={(e) => scoreHandler(e, index, "red")}
        onContextMenu={(e) => scoreHandler(e, index, "blue")}
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
