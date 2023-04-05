import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Timer from "./Timer.js";

const ONE_MIN = 60000;
const THREE_MINS = 180000;
const INF = 999999999999999;

export default function ControlPanel({
  resetHandler,
  swapDragons,
  undo,
  redo,
  gameState,
  setGameState,
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  /* TODO maybe consider refactoring this? */
  const [timerRun, setTimerRun] = useState(false);

  /* to allow us to use the CountdownApi outside of Timer.js */
  const countdownApi = useRef();
  const setApi = (ref) => {
    if (!ref) return;

    countdownApi.current = ref.getApi();
  };

  /* triggered when current countdown arrives at zero */
  /* automatically goes to next state of the game */
  /* can also be triggered manually */
  function nextTimerState(force) {
    console.log("ENTER NEXT STATE");

    switch (gameState.state) {
      case "IDLE":
        console.log("REMAIN AT IDLE");

        if (force) {
          enqueueSnackbar("Start the timer before trying to fast forward.", {
            variant: "warning",
          });
        }
        break;

      case "PREP":
        console.log("GO TO GAME");
        setGameState({
          state: "GAME",
          startTime: Date.now(),
          countdownAmt: THREE_MINS,
        });
        countdownApi.current.start();

        enqueueSnackbar("Game has started.", {
          variant: "info",
        });
        break;

      case "GAME":
        console.log("GO TO END");
        setGameState({
          state: "END",
          startTime: Date.now(),
          countdownAmt: 0,
        });

        enqueueSnackbar("Game has ended.", {
          variant: "info",
        });
        break;

      case "END":
        console.log("REMAIN AT END");

        if (force) {
          enqueueSnackbar("Please reset the timer to start a new game.", {
            variant: "warning",
          });
        }
        break;
    }
  }

  function prevTimerState() {
    console.log("ENTER PREV STATE");
    switch (gameState.state) {
      case "IDLE":
        console.log("REMAIN AT IDLE");

        enqueueSnackbar("Nothing to rewind.", {
          variant: "warning",
        });
        break;

      case "PREP":
        console.log("GO TO IDLE");
        setGameState({
          state: "IDLE",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
        });

        setTimerRun(false);
        countdownApi.current.pause();

        enqueueSnackbar("Going back to idle.", {
          variant: "info",
        });
        break;

      case "GAME":
        console.log("GO TO PREP");
        setGameState({
          state: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
        });

        enqueueSnackbar("Going back to prep.", {
          variant: "info",
        });
        break;

      case "END":
        console.log("REMAIN AT END");

        enqueueSnackbar("Cannot rewind after game has ended.", {
          variant: "warning",
        });
        break;
    }
  }

  /* triggered when button is clicked */
  /* toggles between starting and pausing current countdown */
  function timerBtnHandler() {
    console.log("BUTTON CLICKED");

    if (countdownApi.current?.isPaused() || countdownApi.current?.isStopped()) {
      countdownApi.current.start();
      setTimerRun(true);

      enqueueSnackbar("Timer started.", {
        variant: "info",
      });

      if (gameState.state == "IDLE") {
        setGameState({
          state: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
        });

        enqueueSnackbar("Prep time has started.", {
          variant: "info",
        });
      }
    } else {
      countdownApi.current.pause();
      setTimerRun(false);

      enqueueSnackbar("Timer paused.", {
        variant: "info",
      });
    }
  }

  return (
    <>
      <Grid item>
        <Timer
          timerState={gameState}
          setApi={setApi}
          onComplete={() => nextTimerState(false)}
        />
        <Grid item>
          <Button onClick={prevTimerState}>{"<<"}</Button>
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
          <Button onClick={timerBtnHandler}>
            {gameState.state == "END"
              ? "---"
              : timerRun == false
              ? "START"
              : "PAUSE"}
          </Button>
          <Button onClick={() => nextTimerState(true)}>{">>"}</Button>

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
        </Grid>
      </Grid>
    </>
  );
}
