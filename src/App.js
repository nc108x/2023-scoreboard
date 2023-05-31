import { useState, useRef, useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";

import theme from "./Theme.js";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";
import ControlPanel from "./components/ControlPanel.js";
import Log from "./components/Log.js";
import { elapsedTime } from "./components/Timer.js";
import Options from "./components/Options.js";

import { SnackbarProvider, enqueueSnackbar } from "notistack";

import { useGameStates } from "./components/StatesContextProvider.js";

const empty_poles = Array(11).fill(["empty"]);
const ONE_MIN = 60000;
const THREE_MINS = 180000;

function App() {
  const { gameState1, setGameState1 } = useGameStates();
  console.log(gameState1);
  /* don't call setGameState_real just use setGameState (defined below) */
  const [gameState, setGameState_real] = useState({
    state: "PREP",
    startTime: Date.now(),
    countdownAmt: ONE_MIN,
  });

  const [poles, setPoles] = useState(empty_poles);
  const [pointInTime, setPointInTime] = useState(-1);
  /* a 3d array representing the timeline */
  const history = useRef([empty_poles]);
  const historyDelta = useRef(["empty"]);

  const winner = useRef({ winner: false, time: -1 });

  const [orientation, setOrientation] = useState("red");

  /* passed to options menu */
  function toggleOrientation() {
    if (orientation == "red") {
      setOrientation("blue");
    } else {
      setOrientation("red");
    }
  }

  /* function setGameState(state) { */
  /*   switch (state) { */
  /*     case "PREP": */
  /*       setGameState_real({ */
  /*         state: "PREP", */
  /*         startTime: Date.now(), */
  /*         countdownAmt: ONE_MIN, */
  /*       }); */
  /*       break; */
  /*     case "GAME": */
  /*       setGameState_real({ */
  /*         state: "GAME", */
  /*         startTime: Date.now(), */
  /*         countdownAmt: THREE_MINS, */
  /*       }); */
  /*       break; */
  /*     case "END": */
  /*       setGameState_real({ */
  /*         state: "END", */
  /*         startTime: Date.now(), */
  /*         countdownAmt: 0, */
  /*       }); */
  /*       break; */
  /*     default: */
  /*       setGameState_real(state); */
  /*   } */
  /* } */

  function scoreHandler(e, pole_no, color) {
    /* to prevent right click menu from showing up */
    e.preventDefault();

    const ringsScored = historyDelta.current
      .slice((gameState1.pointInTime + 1) * -1)
      .filter((element) => element[0] == color).length;

    if (ringsScored == 40) {
      /* enqueueSnackbar( */
      /*   (color == "red" ? redDragon : blueDragon) + */
      /*     " Dragon has used up their rings!", */
      /*   { */
      /*     variant: "error", */
      /*   } */
      /* ); */
      return;
    }

    if (gameState1.stage == "GAME" || gameState1.stage == "END") {
      let temp = [...poles];
      temp[pole_no] = [...poles[pole_no], color];
      setPoles(temp);

      /* update the timeline so that undo/redo will work as intended */
      /* when a new ring is added, prune the (undone) future and set the current point in time to be the present */
      history.current = [
        ...history.current.slice(0, history.current.length + gameState1.pointInTime + 1),
        temp,
      ];
      setPointInTime(-1);

      if (gameState1.stage == "GAME") {
        /* update delta for the log */
        historyDelta.current = [
          ...historyDelta.current.slice(
            0,
            historyDelta.current.length + gameState1.pointInTime + 1
          ),
          [
            color,
            pole_no,
            elapsedTime.min + ":" + elapsedTime.sec + ":" + elapsedTime.ms,
          ],
        ];
      } else {
        /* game has ended */
        /* same thing as above but fix timestamp and ping user with a warning */
        enqueueSnackbar("Currently modifying rings after game has ended.", {
          variant: "warning",
        });

        historyDelta.current = [
          ...historyDelta.current.slice(
            0,
            historyDelta.current.length + gameState1.pointInTime + 1
          ),
          [color, pole_no, "03:00:00"],
        ];
      }
    } else {
      enqueueSnackbar("Cannot interact with poles in preparation time!", {
        variant: "error",
      });
    }
  }

  function resetHandler() {
    /* setGameState("PREP"); */
    setGameState1({
      stage: "PREP",
      startTime: Date.now(),
      countdownAmt: 60000,
    })
    setPoles(empty_poles);
    history.current = [empty_poles];
    setPointInTime(-1);
    historyDelta.current = ["empty"];
    winner.current = { winner: false, time: -1 };

    enqueueSnackbar("Scoreboard has been reset.", {
      variant: "success",
    });
  }

  /* present will be denoted by -1 */
  /* since history.at(-1) corresponds to the newest entry in the stack */
  /* pointInTime should never be positive */
  /* undo/redo works by manipulating pointInTime */
  function undo() {
    if (-gameState1.pointInTime == history.current.length) {
      enqueueSnackbar("Cannot undo any further!", {
        variant: "error",
      });
      return;
    }

    if (gameState1.state == "END") {
      enqueueSnackbar("Currently modifying rings after game has ended.", {
        variant: "warning",
      });
    }
    /* setPointInTime(pointInTime - 1); */
    setGameState1({pointInTime: gameState1.pointInTime - 1})
    setPoles(history.current.at(gameState1.pointInTime - 1));
  }

  function redo() {
    if (gameState1.pointInTime == -1) {
      enqueueSnackbar("Cannot redo any further!", {
        variant: "error",
      });
      return;
    }

    if (gameState1.state == "END") {
      enqueueSnackbar("Currently modifying rings after game has ended.", {
        variant: "warning",
      });
    }
    /* setPointInTime(pointInTime + 1); */
    setGameState1({pointInTime: gameState1.pointInTime + 1})
    setPoles(history.current.at(gameState1.pointInTime + 1));
  }

  /* called by checkScore */
  function checkEndgame(topRings) {
    const redWinCon = topRings.slice(0, 8);
    const blueWinCon = topRings.slice(3, 11);

    if (redWinCon.every((currVal) => currVal == "red")) {
      enqueueSnackbar(gameState1.redDragon1 + " Dragon has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      winner.current.winner = "red";
      if (winner.current.time == -1) {
        winner.current.time = historyDelta.current.length;
      }
    } else if (blueWinCon.every((currVal) => currVal == "blue")) {
      enqueueSnackbar(gameState1.blueDragon1 + " Dragon has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      winner.current.winner = "blue";
      if (winner.current.time == -1) {
        winner.current.time = historyDelta.current.length;
      }
    } else {
      winner.current.winner = false;
      winner.current.time = -1;
    }
  }

  /* runs every time on rerender */
  function checkScore() {
    const type1 = [0, 1, 2, 8, 9, 10];
    const type2 = [3, 4, 6, 7];

    let redScore = 0;
    let blueScore = 0;

    let topRings = [];

    for (let i = 0; i < poles.length; i++) {
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

    checkEndgame(topRings);

    return [redScore, blueScore];
  }

  function exportData(type) {
    let exportStr = "";

    if (type == 0) {
      let timestamp = new Date();
      timestamp.toISOString();
      exportStr = exportStr.concat(timestamp);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? "RED" : "BLUE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? "BLUE" : "RED"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? redScore : blueScore
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? blueScore : redScore
      );
      exportStr = exportStr.concat(";");

      const fieryColor = gameState1.redDragon1 == "FIERY" ? "red" : "blue";

      exportStr = exportStr.concat(
        historyDelta.current.filter((element) => element[0] == fieryColor)
          .length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        historyDelta.current.filter(
          (element) => element[0] != fieryColor && element != "empty"
        ).length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        winner.current.winner != false ? "TRUE" : "FALSE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        winner.current.winner
          ? winner.current.winner == "red"
            ? gameState1.redDragon1
            : gameState1.blueDragon1
          : redScore > blueScore
          ? gameState1.redDragon1
          : blueScore > redScore
          ? gameState1.blueDragon1
          : "TIE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        winner.current.winner != false
          ? historyDelta.current.at(-1)[2]
          : "03:00:00"
      );
      exportStr = exportStr.concat(";");
    } else {
      for (let i = 0; i < poles.length; i++) {
        switch (poles[i].at(-1)) {
          case "empty":
            exportStr = exportStr.concat("0;");
            break;
          case "red":
            exportStr = exportStr.concat("r;");
            break;
          case "blue":
            exportStr = exportStr.concat("b;");
            break;
        }
      }
    }

    return exportStr.slice(0, -1);
  }

  const undoShortcut = useCallback(
    (event) => {
      const platform = navigator.platform;
      if (platform.startsWith("Mac")) {
        if (event.key == "z" && event.metaKey == true) {
          event.preventDefault();
          undo();
        }
      } else {
        if (event.key == "z" && event.ctrlKey == true) {
          event.preventDefault();
          undo();
        }
      }
    },
    [gameState1.pointInTime]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", undoShortcut);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", undoShortcut);
    };
  }, [undoShortcut]);

  /* update score */
  const [redScore, blueScore] = checkScore();

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={1500}>
          <Options toggleOrientation={toggleOrientation} />
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
                undo={undo}
                redo={redo}
                exportData={exportData}
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
                    color="red"
                    historyDelta={historyDelta.current.slice(
                      0,
                      historyDelta.current.length + gameState1.pointInTime + 1
                    )}
                    winner={winner.current}
                  />
                </Grid>

                <Grid item>
                  <Log
                    historyDelta={historyDelta.current.slice(
                      0,
                      historyDelta.current.length + gameState1.pointInTime + 1
                    )}
                    color="red"
                    winner={winner.current}
                    orientation={orientation}
                  />
                </Grid>
              </Grid>

              <Grid container direction="column" alignItems="center" xs={4}>
                <Gamefield
                  poles={poles}
                  scoreHandler={scoreHandler}
                  orientation={orientation}
                />
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
                    color="blue"
                    historyDelta={historyDelta.current.slice(
                      0,
                      historyDelta.current.length + gameState1.pointInTime + 1
                    )}
                    winner={winner.current}
                  />
                </Grid>

                <Grid item>
                  <Log
                    historyDelta={historyDelta.current.slice(
                      0,
                      historyDelta.current.length + gameState1.pointInTime + 1
                    )}
                    color="blue"
                    winner={winner.current}
                    orientation={orientation}
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
