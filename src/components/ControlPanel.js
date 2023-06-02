import { useGameStates } from "./StatesContextProvider.js";

import Timer from "./Timer.js";

import { useState, useRef, useCallback, useEffect } from "react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import emptyExcel from "../results_blank.xlsx";

import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import { enqueueSnackbar } from "notistack";

const ONE_MIN = 60000;
const THREE_MINS = 180000;
const empty_poles = Array(11).fill(["empty"]);

export default function ControlPanel({}) {
  const { gameState, setGameState, gameResult } = useGameStates();

  const [confirmReset, setConfirmReset] = useState(false);
  const [showExport, setShowExport] = useState(false);

  /* to allow us to use the CountdownApi outside of Timer.js */
  const countdownApi = useRef();
  const setApi = (ref) => {
    if (!ref) return;

    countdownApi.current = ref.getApi();
  };

  /* to start/stop timer based on gameState */
  useEffect(() => {
    if (gameState.timerRunning) {
      countdownApi.current.start();
    } else {
      countdownApi.current.pause();
    }
  }, [gameState.timerRunning]);

  function setTimerStage(stage, running, fallthrough) {
    switch (stage) {
      case "PREP":
        setGameState({
          stage: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
          timerRunning: running,
          timerFallthrough: fallthrough,
        });

        break;
      case "GAME":
        setGameState({
          stage: "GAME",
          startTime: Date.now(),
          countdownAmt: THREE_MINS,
          timerRunning: running,
          timerFallthrough: fallthrough,
        });
        break;
      case "END":
        setGameState({
          stage: "END",
          startTime: Date.now(),
          countdownAmt: 0,
          timerRunning: running,
          timerFallthrough: fallthrough,
        });
        break;
    }
  }

  /* triggered when current countdown arrives at zero */
  /* automatically goes to next state of the game */
  /* can also be triggered manually */
  function nextTimerState(force) {
    switch (gameState.stage) {
      case "PREP":
        setTimerStage("GAME", !force, !force);

        if (force) {
          enqueueSnackbar("Fast forward to game time.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Game time has started.", {
            variant: "info",
          });
        }
        break;

      case "GAME":
        setTimerStage("END", false, false);
        if (force) {
          enqueueSnackbar("Fast forward to end.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Game has ended.", {
            variant: "info",
          });
        }
        break;

      case "END":
        if (force) {
          enqueueSnackbar("Please reset the scoreboard to start a new game.", {
            variant: "error",
          });
        }
        break;
    }
  }

  function prevTimerState() {
    /* if timer is running alr just go to beginning of the CURRENT state */
    if (gameState.timerRunning) {
      setTimerStage(gameState.stage, false, false);

      switch (gameState.stage) {
        case "PREP":
          enqueueSnackbar("Rewind to beginning of preparation time.", {
            variant: "success",
          });
          break;
        case "GAME":
          enqueueSnackbar("Rewind to beginning of game time.", {
            variant: "success",
          });
          break;
      }
    } else {
      /* go to previous state */
      switch (gameState.stage) {
        case "PREP":
          enqueueSnackbar("Nothing to rewind.", {
            variant: "error",
          });
          break;

        case "GAME":
          setTimerStage("PREP", false, false);
          enqueueSnackbar("Rewind to preparation time.", {
            variant: "success",
          });
          break;

        case "END":
          setTimerStage("GAME", false, false);
          enqueueSnackbar("Rewind to game time.", {
            variant: "success",
          });
          break;
      }
    }
  }

  /* triggered when button is clicked */
  /* toggles between starting and pausing current countdown */
  function timerBtnHandler() {
    if (gameState.stage == "END") {
      return;
    }

    if (countdownApi.current?.isPaused() || countdownApi.current?.isStopped()) {
      setGameState({ timerRunning: true, timerFallthrough: false });

      /* countdownApi.current.start(); */
      enqueueSnackbar("Timer started.", {
        variant: "success",
      });

      if (gameState.stage == "PREP") {
        enqueueSnackbar("Preparation time has started.", {
          variant: "info",
        });
      }
    } else {
      setGameState({ timerRunning: false, timerFallthrough: false });
      /* countdownApi.current.pause(); */
      enqueueSnackbar("Timer paused.", {
        variant: "success",
      });
    }
  }

  function swapDragons() {
    setGameState({
      redDragon: gameState.redDragon == "FIERY" ? "WAR" : "FIERY",
      blueDragon: gameState.blueDragon == "FIERY" ? "WAR" : "FIERY",
    });

    enqueueSnackbar("Dragons have been swapped.", {
      variant: "success",
    });
  }

  function resetHandler() {
    setGameState({
      stage: "PREP",
      startTime: Date.now(),
      countdownAmt: 60000,
      timerRunning: false,
      history: [empty_poles],
      historyDelta: ["empty"],
      pointInTime: -1,
      currPoles: empty_poles,
    });

    enqueueSnackbar("Scoreboard has been reset.", {
      variant: "success",
    });
  }

  /* present will be denoted by -1 */
  /* since history.at(-1) corresponds to the newest entry in the stack */
  /* pointInTime should never be positive */
  /* undo/redo works by manipulating pointInTime */
  function undo() {
    if (-gameState.pointInTime == gameState.history.length) {
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
    setGameState({
      pointInTime: gameState.pointInTime - 1,
      currPoles: gameState.history.at(gameState.pointInTime - 1),
    });
  }

  function redo() {
    if (gameState.pointInTime == -1) {
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
    setGameState({
      pointInTime: gameState.pointInTime + 1,
      currPoles: gameState.history.at(gameState.pointInTime + 1),
    });
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
    [gameState.pointInTime]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", undoShortcut);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", undoShortcut);
    };
  }, [undoShortcut]);

  function exportData(type) {
    let exportStr = "";

    if (type == 0) {
      let timestamp = new Date();
      timestamp.toISOString();
      exportStr = exportStr.concat(timestamp);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState.redDragon == "FIERY" ? "RED" : "BLUE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState.redDragon == "FIERY" ? "BLUE" : "RED"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState.redDragon == "FIERY"
          ? gameResult.current.redScore
          : gameResult.current.blueScore
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState.redDragon == "FIERY"
          ? gameResult.current.blueScore
          : gameResult.current.redScore
      );
      exportStr = exportStr.concat(";");

      const fieryColor = gameState.redDragon == "FIERY" ? "RED" : "BLUE";

      exportStr = exportStr.concat(
        gameState.historyDelta.filter((element) => element[0] == fieryColor)
          .length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState.historyDelta.filter(
          (element) => element[0] != fieryColor && element != "empty"
        ).length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameResult.current.winner != false ? "TRUE" : "FALSE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameResult.current.winner
          ? gameResult.current.winner == "RED"
            ? gameState.redDragon
            : gameState.blueDragon
          : gameResult.current.redScore > gameResult.current.blueScore
          ? gameState.redDragon
          : gameResult.current.blueScore > gameResult.current.redScore
          ? gameState.blueDragon
          : "TIE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameResult.current.winner != false
          ? gameState.historyDelta.at(-1)[2]
          : "03:00:00"
      );
      exportStr = exportStr.concat(";");
    } else {
      for (let i = 0; i < gameState.currPoles.length; i++) {
        switch (gameState.currPoles[i].at(-1)) {
          case "empty":
            exportStr = exportStr.concat("0;");
            break;
          case "RED":
            exportStr = exportStr.concat("r;");
            break;
          case "BLUE":
            exportStr = exportStr.concat("b;");
            break;
        }
      }
    }

    return exportStr.slice(0, -1);
  }

  return (
    <>
      <Grid item>
        <Timer
          timerState={gameState}
          setApi={setApi}
          onComplete={() => nextTimerState(false)}
          /* fallthrough={fallthrough.current} */
        />
        <Grid item>{"Current state: " + gameState.stage}</Grid>
        <Grid item>
          <Tooltip
            TransitionComponent={Zoom}
            title={"Rewind to previous state"}
          >
            <Button onClick={prevTimerState}>{"<<"}</Button>
          </Tooltip>
          <Button
            onClick={() => {
              setConfirmReset(true);
            }}
          >
            RESET
          </Button>
          <Button onClick={swapDragons}>SWAP</Button>
          <Button onClick={undo}>UNDO</Button>
          <Button onClick={redo}>REDO</Button>
          <Button
            onClick={
              gameState.stage == "END"
                ? () => setShowExport(true)
                : timerBtnHandler
            }
          >
            {gameState.stage == "END"
              ? "EXPORT"
              : gameState.timerRunning == false
              ? "START"
              : "PAUSE"}
          </Button>
          <Tooltip
            TransitionComponent={Zoom}
            title={"Fast forward to next state"}
          >
            <Button onClick={() => nextTimerState(true)}>{">>"}</Button>
          </Tooltip>

          {/* prompt to confirm before reset */}
          <Dialog
            open={confirmReset}
            onClose={() => {
              setConfirmReset(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Reset current game state?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {
                  "All poles will be emptied. This action cannot be undone because I am too lazy to implement this feature."
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setConfirmReset(false);
                }}
                autoFocus
              >
                {"等等先不要"}
              </Button>
              <Button
                onClick={() => {
                  setConfirmReset(false);
                  resetHandler();

                  /* setTimerRun(false); */
                  /* countdownApi.current.pause(); */
                }}
              >
                {"繼續開game啦咁多野講"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* export */}
          <Dialog
            open={showExport}
            onClose={() => {
              setShowExport(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Export data"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Typography paragraph="true">
                  {"Copy the following to the Excel spreadsheet:\n\n"}
                </Typography>
                <Typography>{exportData(0)}</Typography>
                <Typography paragraph="true">
                  {"("}
                  <Link href={emptyExcel} download="results_blank.xlsx">
                    {"Blank spreadsheet download here"}
                  </Link>
                  {")"}
                </Typography>
                <Typography>{"Pole states:"}</Typography>
                <Typography>{exportData(1)}</Typography>
                <Typography>
                  {
                    "NOTE: use CTRL+SHIFT+V when pasting this string to keep formatting"
                  }
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setShowExport(false);
                }}
                autoFocus
              >
                {"Done"}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
}
