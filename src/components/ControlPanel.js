import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { enqueueSnackbar } from "notistack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import Timer from "./Timer.js";

export default function ControlPanel({
  resetHandler,
  swapDragons,
  undo,
  redo,
  gameState,
  setGameState,
  exportData,
}) {
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

  /* triggered when current countdown arrives at zero */
  /* automatically goes to next state of the game */
  /* can also be triggered manually */
  function nextTimerState(force) {
    fallthrough.current = false;
    switch (gameState.state) {
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

        setGameState("GAME");
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

        setGameState("END");
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
      setGameState(gameState.state);

      switch (gameState.state) {
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
      switch (gameState.state) {
        case "PREP":
          enqueueSnackbar("Nothing to rewind.", {
            variant: "error",
          });
          break;

        case "GAME":
          setGameState("PREP");
          enqueueSnackbar("Rewind to preparation time.", {
            variant: "success",
          });
          break;

        case "END":
          setGameState("GAME");
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
    if (gameState.state == "END") {
      return;
    }

    if (countdownApi.current?.isPaused() || countdownApi.current?.isStopped()) {
      setTimerRun(true);

      countdownApi.current.start();
      enqueueSnackbar("Timer started.", {
        variant: "success",
      });

      if (gameState.state == "PREP") {
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

  return (
    <>
      <Grid item>
        <Timer
          timerState={gameState}
          setApi={setApi}
          onComplete={() => nextTimerState(false)}
          fallthrough={fallthrough.current}
        />
        <Grid item>{"Current state: " + gameState.state}</Grid>
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
              gameState.state == "END"
                ? () => setShowExport(true)
                : timerBtnHandler
            }
          >
            {gameState.state == "END"
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
                <Typography>
                  {"Copy the following to the Excel spreadsheet:\n\n"}
                </Typography>
                <Typography>{exportData()}</Typography>
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
