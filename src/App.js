import { useState, useRef } from "react";
import Grid from "@mui/material/Grid";

import theme from "./Theme.js";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";
import ControlPanel from "./components/ControlPanel.js";
import Log from "./components/Log.js";
import { elapsedTime } from "./components/Timer.js";

import { SnackbarProvider, enqueueSnackbar } from "notistack";

const empty_poles = Array(11).fill(["empty"]);
const ONE_MIN = 60000;

function App() {
  const [gameState, setGameState] = useState({
    state: "IDLE",
    startTime: Date.now(),
    countdownAmt: ONE_MIN,
  });

  const [poles, setPoles] = useState(empty_poles);
  const [pointInTime, setPointInTime] = useState(-1);
  /* a 3d array representing the timeline */
  const history = useRef([empty_poles]);
  const historyDelta = useRef(["empty"]);

  const [redDragon, setRedDragon] = useState("FIERY");
  const [blueDragon, setBlueDragon] = useState("WAR");
  const winner = useRef(null);

  function scoreHandler(e, pole_no, color) {
    /* to prevent right click menu from showing up */
    e.preventDefault();

    const ringsScored = historyDelta.current
      .slice((pointInTime + 1) * -1)
      .filter((element) => element[0] == color).length;
    if (ringsScored == 40) {
      enqueueSnackbar(
        (color == "red" ? redDragon : blueDragon) +
          " Dragon has used up their rings!",
        {
          variant: "error",
        }
      );
      return;
    }

    if (gameState.state == "GAME" || gameState.state == "END") {
      let temp = [...poles];
      temp[pole_no] = [...poles[pole_no], color];
      setPoles(temp);
      console.log(temp);

      /* update the timeline so that undo will work as intended */
      /* when a new ring is added, prune the future and set the current point in time to be the present */
      history.current = [
        ...history.current.slice(0, history.current.length + pointInTime + 1),
        temp,
      ];
      setPointInTime(-1);

      /* update delta for the log */
      if (gameState.state == "GAME") {
        historyDelta.current = [
          [
            color,
            pole_no,
            elapsedTime.min + ":" + elapsedTime.sec + ":" + elapsedTime.ms,
          ],

          ...historyDelta.current.slice((pointInTime + 1) * -1),
        ];
      } else {
        enqueueSnackbar("Currently modifying rings after game has ended.", {
          variant: "warning",
        });

        historyDelta.current = [
          [color, pole_no, "03:00:00"],

          ...historyDelta.current.slice((pointInTime + 1) * -1),
        ];
      }
    } else {
      enqueueSnackbar(
        "Cannot interact with poles in " +
          gameState.state.toLowerCase() +
          " state!",
        {
          variant: "error",
        }
      );
    }
  }

  function resetHandler() {
    setPoles(empty_poles);
    history.current = [empty_poles];
    setPointInTime(-1);
    historyDelta.current = ["empty"];
    setGameState({
      state: "IDLE",
      startTime: Date.now(),
      countdownAmt: ONE_MIN,
    });
    winner.current = null;

    enqueueSnackbar("Game field has been reset.", {
      variant: "success",
    });
  }

  function swapDragons() {
    setRedDragon(redDragon == "FIERY" ? "WAR" : "FIERY");
    setBlueDragon(blueDragon == "FIERY" ? "WAR" : "FIERY");

    enqueueSnackbar("Dragons have been swapped.", {
      variant: "success",
    });
  }

  /* present will be denoted by -1 */
  /* since history.at(-1) corresponds to the newest entry in the stack */
  /* pointInTime should never be positive */
  function undo() {
    console.log(history.current);
    if (Math.abs(pointInTime) == history.current.length) {
      console.log("CAN'T UNDO ANY FURTHER");

      enqueueSnackbar("Cannot undo any further!", {
        variant: "error",
      });
      return;
    }

    if (gameState.state == "END") {
      enqueueSnackbar("Currently modifying rings after game has ended.", {
        variant: "warning",
      });
    }
    setPointInTime(pointInTime - 1);
    setPoles(history.current.at(pointInTime - 1));
  }

  function redo() {
    if (pointInTime + 1 == 0) {
      console.log("CAN'T REDO ANY FURTHER");

      enqueueSnackbar("Cannot redo any further!", {
        variant: "error",
      });
      return;
    }

    if (gameState.state == "END") {
      enqueueSnackbar("Currently modifying rings after game has ended.", {
        variant: "warning",
      });
    }
    setPointInTime(pointInTime + 1);
    setPoles(history.current.at(pointInTime + 1));
  }

  /* called by checkScore */
  function checkEndgame(topRings) {
    const redWinCon = topRings.slice(0, 8);
    const blueWinCon = topRings.slice(3, 11);

    /* console.log(redWinCon); */
    /* console.log(blueWinCon); */

    if (redWinCon.every((currVal) => currVal == "red")) {
      console.log("RED GREAT VICTORY");

      enqueueSnackbar(redDragon + " Dragon has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      winner.current = redDragon;
    } else if (blueWinCon.every((currVal) => currVal == "blue")) {
      console.log("BLUE GREAT VICTORY");

      enqueueSnackbar(blueDragon + " Dragon has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });
      winner.current = blueDragon;
    } else {
      console.log("KEEP PLAYING NERD");
      winner.current = null;
    }
  }

  /* runs every time on rerender */
  function checkScore() {
    const type1 = [0, 1, 2, 8, 9, 10];
    const type2 = [3, 4, 6, 7];
    /* let type3 = 5; */

    let redScore = 0;
    let blueScore = 0;

    let topRings = [];

    for (let i = 0; i < poles.length; i++) {
      /* console.log("Pole " + i + " " + poles[i].at(-1)); */

      topRings[i] = poles[i].at(-1);
      let scoreIncrease = 0;

      if (topRings[i] == "empty") {
        continue;
      }

      if (type1.includes(i)) {
        if (
          (i < 5 && topRings[i] == "blue") ||
          (i > 5 && topRings[i] == "red")
        ) {
          scoreIncrease = 25;
        } else {
          scoreIncrease = 10;
        }
      } else if (type2.includes(i)) {
        scoreIncrease = 30;
      } else {
        scoreIncrease = 70;
      }

      if (topRings[i] == "red") {
        redScore += scoreIncrease;
      } else {
        blueScore += scoreIncrease;
      }
    }

    /* console.log([redScore_t, blueScore_t]); */
    /* console.log(history); */
    /* console.log(pointInTime); */

    checkEndgame(topRings);

    return [redScore, blueScore];
  }

  /* update score */
  const [redScore, blueScore] = checkScore();
  /* console.log(winner.current); */
  /* console.log(history.current); */
  /* console.log(history.current.at(0)); */

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={1500}>
          <Grid
            container
            direction="column"
            justifyContent="space-evenly"
            spacing={3}
            sx={{
              textAlign: "center",
            }}
          >
            <Grid container item justifyContent="space-evenly">
              <ControlPanel
                resetHandler={resetHandler}
                swapDragons={swapDragons}
                undo={undo}
                redo={redo}
                gameState={gameState}
                setGameState={setGameState}
              />
            </Grid>
            <Grid container item direction="row">
              <Grid
                container
                direction="column"
                alignItems="center"
                xs={4}
                justifyContent="space-between"
              >
                <Grid item>
                  <Info
                    score={redScore}
                    dragonName={redDragon}
                    color="red"
                    historyDelta={historyDelta.current.slice(
                      (pointInTime + 1) * -1
                    )}
                    winner={winner.current}
                  />
                </Grid>

                <Grid item>
                  <Log
                    historyDelta={historyDelta.current.slice(
                      (pointInTime + 1) * -1
                    )}
                    color="red"
                  />
                </Grid>
              </Grid>

              <Grid container direction="column" alignItems="center" xs={4}>
                <Gamefield poles={poles} scoreHandler={scoreHandler} />
              </Grid>

              <Grid
                container
                direction="column"
                alignItems="center"
                xs={4}
                justifyContent="space-between"
              >
                <Grid item>
                  <Info
                    score={blueScore}
                    dragonName={blueDragon}
                    color="blue"
                    historyDelta={historyDelta.current.slice(
                      (pointInTime + 1) * -1
                    )}
                    winner={winner.current}
                  />
                </Grid>

                <Grid item>
                  <Log
                    historyDelta={historyDelta.current.slice(
                      (pointInTime + 1) * -1
                    )}
                    color="blue"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
