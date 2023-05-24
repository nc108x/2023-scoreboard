import Grid from "@mui/material/Grid";
import { useCallback, useEffect, useRef, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme.js";

import ControlPanel from "./components/ControlPanel.js";
import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";
import Log from "./components/Log.js";
import Options from "./components/Options.js";
import { elapsedTime } from "./components/Timer.js";

import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useFirebase } from "./components/FirebaseProvider.js";
import { ref } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";

const empty_poles = Array(11).fill(["empty"]);
const ONE_MIN = 60000;
const THREE_MINS = 180000;

const initialState = {
  state: "PREP",
  startTime: Date.now(),
  countdownAmt: ONE_MIN,
  fieldOrientation: "red",
  field: {
    red: "FIERY",
    blue: "WAR",
  },
  poles: empty_poles,
  pointInTime: -1,
  history: [empty_poles],
};

function App() {
  const { db } = useFirebase();
  const [value, loading, error] = useObjectVal(ref(db, "2023"), {
    keyField: "id",
  });

  console.log(value, error);

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

  const [redDragon, setRedDragon] = useState("FIERY");
  const [blueDragon, setBlueDragon] = useState("WAR");
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

  function setGameState(state) {
    switch (state) {
      case "PREP":
        setGameState_real({
          state: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
        });
        break;
      case "GAME":
        setGameState_real({
          state: "GAME",
          startTime: Date.now(),
          countdownAmt: THREE_MINS,
        });
        break;
      case "END":
        setGameState_real({
          state: "END",
          startTime: Date.now(),
          countdownAmt: 0,
        });
        break;
      default:
        setGameState_real(state);
    }
  }

  function scoreHandler(e, pole_no, color) {
    /* to prevent right click menu from showing up */
    e.preventDefault();

    const ringsScored = historyDelta.current
      .slice((pointInTime + 1) * -1)
      .filter((element) => element[0] == color).length;

    if (ringsScored == 40) {
      enqueueSnackbar(
        (color == "red" ? redDragon : blueDragon) + " Dragon has used up their rings!",
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

      /* update the timeline so that undo/redo will work as intended */
      /* when a new ring is added, prune the (undone) future and set the current point in time to be the present */
      history.current = [
        ...history.current.slice(0, history.current.length + pointInTime + 1),
        temp,
      ];
      setPointInTime(-1);

      if (gameState.state == "GAME") {
        /* update delta for the log */
        historyDelta.current = [
          ...historyDelta.current.slice(0, historyDelta.current.length + pointInTime + 1),
          [color, pole_no, elapsedTime.min + ":" + elapsedTime.sec + ":" + elapsedTime.ms],
        ];
      } else {
        /* game has ended */
        /* same thing as above but fix timestamp and ping user with a warning */
        enqueueSnackbar("Currently modifying rings after game has ended.", {
          variant: "warning",
        });

        historyDelta.current = [
          ...historyDelta.current.slice(0, historyDelta.current.length + pointInTime + 1),
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
    setGameState("PREP");
    setPoles(empty_poles);
    history.current = [empty_poles];
    setPointInTime(-1);
    historyDelta.current = ["empty"];
    winner.current = { winner: false, time: -1 };

    enqueueSnackbar("Scoreboard has been reset.", {
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
  /* undo/redo works by manipulating pointInTime */
  function undo() {
    if (-pointInTime == history.current.length) {
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
    if (pointInTime == -1) {
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

    if (redWinCon.every((currVal) => currVal == "red")) {
      enqueueSnackbar(redDragon + " Dragon has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      winner.current.winner = "red";
      if (winner.current.time == -1) {
        winner.current.time = historyDelta.current.length;
      }
    } else if (blueWinCon.every((currVal) => currVal == "blue")) {
      enqueueSnackbar(blueDragon + " Dragon has ended the game!", {
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
        if ((i < 5 && topRings[i] == "blue") || (i > 5 && topRings[i] == "red")) {
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

  function exportData() {
    let exportStr = "";

    let timestamp = new Date();
    timestamp.toISOString();
    exportStr = exportStr.concat(timestamp);
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(redDragon == "FIERY" ? "RED" : "BLUE");
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(redDragon == "FIERY" ? "BLUE" : "RED");
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(redDragon == "FIERY" ? redScore : blueScore);
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(redDragon == "FIERY" ? blueScore : redScore);
    exportStr = exportStr.concat(";");

    const fieryColor = redDragon == "FIERY" ? "red" : "blue";

    exportStr = exportStr.concat(
      historyDelta.current.filter((element) => element[0] == fieryColor).length
    );
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(
      historyDelta.current.filter((element) => element[0] != fieryColor && element != "empty")
        .length
    );
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(winner.current.winner != false ? "TRUE" : "FALSE");
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(
      winner.current.winner
        ? winner.current.winner == "red"
          ? redDragon
          : blueDragon
        : redScore > blueScore
        ? redDragon
        : blueScore > redScore
        ? blueDragon
        : "TIE"
    );
    exportStr = exportStr.concat(";");

    exportStr = exportStr.concat(
      winner.current.winner != false ? historyDelta.current.at(-1)[2] : "03:00:00"
    );
    exportStr = exportStr.concat(";");
    return exportStr;
  }

  const undoShortcut = useCallback(
    (event) => {
      const platform = navigator.platform;
      console.log(platform);
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
    [pointInTime]
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
                swapDragons={swapDragons}
                undo={undo}
                redo={redo}
                gameState={gameState}
                setGameState={setGameState}
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
                    dragonName={redDragon}
                    color="red"
                    historyDelta={historyDelta.current.slice(
                      0,
                      historyDelta.current.length + pointInTime + 1
                    )}
                    winner={winner.current}
                  />
                </Grid>

                <Grid item>
                  <Log
                    historyDelta={historyDelta.current.slice(
                      0,
                      historyDelta.current.length + pointInTime + 1
                    )}
                    color="red"
                    winner={winner.current}
                    orientation={orientation}
                  />
                </Grid>
              </Grid>

              <Grid container direction="column" alignItems="center" xs={4}>
                <Gamefield poles={poles} scoreHandler={scoreHandler} orientation={orientation} />
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
                      0,
                      historyDelta.current.length + pointInTime + 1
                    )}
                    winner={winner.current}
                  />
                </Grid>

                <Grid item>
                  <Log
                    historyDelta={historyDelta.current.slice(
                      0,
                      historyDelta.current.length + pointInTime + 1
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
