import { useGameStates } from "./StatesContextProvider.js";

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

import Timer from "./Timer.js";

const ONE_MIN = 60000;
const THREE_MINS = 180000;
const empty_poles = Array(11).fill(["empty"]);

export default function ControlPanel({ exportData }) {
  const { gameState1, setGameState1 } = useGameStates();

  const [confirmReset, setConfirmReset] = useState(false);
  const [showExport, setShowExport] = useState(false);
  /* TODO maybe consider refactoring this? */
  const [timerRun, setTimerRun] = useState(false);

  /* to allow us to use the CountdownApi outside of Timer.js */
  const countdownApi = useRef();
  const setApi = (ref) => {
    if (!ref) return;

    countdownApi.current = ref.getApi();
  };

  /* used to trigger autostart when going from prep to game */
  const fallthrough = useRef(false);

  function setTimerStage(stage) {
    switch (stage) {
      case "PREP":
        setGameState1({
          stage: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
        });

        break;
      case "GAME":
        setGameState1({
          stage: "GAME",
          startTime: Date.now(),
          countdownAmt: THREE_MINS,
        });
        break;
      case "END":
        setGameState1({
          stage: "END",
          startTime: Date.now(),
          countdownAmt: 0,
        });
        break;
    }
  }

  /* triggered when current countdown arrives at zero */
  /* automatically goes to next state of the game */
  /* can also be triggered manually */
  function nextTimerState(force) {
    fallthrough.current = false;
    switch (gameState1.stage) {
      case "PREP":
        if (force) {
          setTimerRun(false);
          enqueueSnackbar("Fast forward to game time.", {
            variant: "success",
          });
        } else {
          fallthrough.current = true;
          setTimerRun(true);
          enqueueSnackbar("Game time has started.", {
            variant: "info",
          });
        }

        setTimerStage("GAME");
        break;

      case "GAME":
        setTimerRun(false);
        if (force) {
          enqueueSnackbar("Fast forward to end.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Game has ended.", {
            variant: "info",
          });
        }

        setTimerStage("END");
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
    fallthrough.current = false;
    setTimerRun(false);
    /* if timer is running alr just go to beginning of the CURRENT state */
    if (timerRun) {
      setTimerStage(gameState1.stage);

      switch (gameState1.stage) {
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
      switch (gameState1.stage) {
        case "PREP":
          enqueueSnackbar("Nothing to rewind.", {
            variant: "error",
          });
          break;

        case "GAME":
          setTimerStage("PREP");
          enqueueSnackbar("Rewind to preparation time.", {
            variant: "success",
          });
          break;

        case "END":
          setTimerStage("GAME");
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
    fallthrough.current = false;
    if (gameState1.stage == "END") {
      return;
    }

    if (countdownApi.current?.isPaused() || countdownApi.current?.isStopped()) {
      setTimerRun(true);

      countdownApi.current.start();
      enqueueSnackbar("Timer started.", {
        variant: "success",
      });

      if (gameState1.stage == "PREP") {
        enqueueSnackbar("Preparation time has started.", {
          variant: "info",
        });
      }
    } else {
      setTimerRun(false);
      countdownApi.current.pause();
      enqueueSnackbar("Timer paused.", {
        variant: "success",
      });
    }
  }

  function swapDragons() {
    setGameState1({
      redDragon1: gameState1.redDragon1 == "FIERY" ? "WAR" : "FIERY",
      blueDragon1: gameState1.blueDragon1 == "FIERY" ? "WAR" : "FIERY",
    });

    enqueueSnackbar("Dragons have been swapped.", {
      variant: "success",
    });
  }

  function resetHandler() {
    setGameState1({
      stage: "PREP",
      startTime: Date.now(),
      countdownAmt: 60000,
      history: [empty_poles],
      historyDelta: ["empty"],
      pointInTime: -1,
      currPoles: empty_poles,
      winner: { winner: false, timer: -1 },
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
    if (-gameState1.pointInTime == gameState1.history.length) {
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
    setGameState1({
      pointInTime: gameState1.pointInTime - 1,
      currPoles: gameState1.history.at(gameState1.pointInTime - 1),
    });
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
    setGameState1({
      pointInTime: gameState1.pointInTime + 1,
      currPoles: gameState1.history.at(gameState1.pointInTime + 1),
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

  return (
    <>
      <Grid item>
        <Timer
          timerState={gameState1}
          setApi={setApi}
          onComplete={() => nextTimerState(false)}
          fallthrough={fallthrough.current}
        />
        <Grid item>{"Current state: " + gameState1.stage}</Grid>
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
              gameState1.stage == "END"
                ? () => setShowExport(true)
                : timerBtnHandler
            }
          >
            {gameState1.stage == "END"
              ? "EXPORT"
              : timerRun == false
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

                  setTimerRun(false);
                  countdownApi.current.pause();
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
