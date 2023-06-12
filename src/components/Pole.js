import { useGameStates } from "./StatesContextProvider.js";

import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import { enqueueSnackbar } from "notistack";

export default function Pole({ x, y, index, rings }) {
  const { gameState, setGameState, options, timeInfo } = useGameStates();

  function scoreHandler(e, pole_no, color) {
    /* to prevent right click menu from showing up */
    e.preventDefault();

    const ringsScored = gameState.historyDelta
      .slice((gameState.pointInTime + 1) * -1)
      .filter((element) => element[0] == color).length;

    if (ringsScored == 40) {
      enqueueSnackbar(
        (color == "RED" ? gameState.redDragon : gameState.blueDragon) +
          " Dragon has used up their rings!",
        {
          variant: "error",
        }
      );
      return;
    }

    if (gameState.stage == "GAME" || gameState.stage == "END") {
      let temp = [...gameState.currPoles];
      temp[pole_no] = [...gameState.currPoles[pole_no], color];

      /* update the timeline so that undo/redo will work as intended */
      /* when a new ring is added, prune the (undone) future and set the current point in time to be the present */
      if (gameState.stage == "GAME") {
        /* also update delta for the log */
        setGameState({
          history: [
            ...gameState.history.slice(
              0,
              gameState.history.length + gameState.pointInTime + 1
            ),
            temp,
          ],
          historyDelta: [
            ...gameState.historyDelta.slice(
              0,
              gameState.historyDelta.length + gameState.pointInTime + 1
            ),
            [
              color,
              pole_no,
              timeInfo.current.elapsedTime.min +
                ":" +
                timeInfo.current.elapsedTime.sec +
                ":" +
                timeInfo.current.elapsedTime.ms,
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

        setGameState({
          history: [
            ...gameState.history.slice(
              0,
              gameState.history.length + gameState.pointInTime + 1
            ),
            temp,
          ],
          historyDelta: [
            ...gameState.historyDelta.slice(
              0,
              gameState.historyDelta.length + gameState.pointInTime + 1
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
    rings.at(-1) == "RED"
      ? "redTeam"
      : rings.at(-1) == "BLUE"
      ? "blueTeam"
      : "standbyColor";

  const hover =
    "Red: " +
    rings.filter((element) => element == "RED").length +
    " | Blue: " +
    rings.filter((element) => element == "BLUE").length;

  return (
    <Tooltip TransitionComponent={Zoom} title={hover}>
      <Fab
        color={color}
        onClick={(e) => scoreHandler(e, index, "RED")}
        onContextMenu={(e) => scoreHandler(e, index, "BLUE")}
        sx={{
          position: "absolute",
          top: y,
          left: x,
          fontSize: 28,
        }}
      >
        {!options.labels ? "" : (options.orientation == "SOUTH" ? index + 1 : 11 - index)}
      </Fab>
    </Tooltip>
  );
}
