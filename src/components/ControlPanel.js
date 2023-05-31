import { useGameStates } from "./StatesContextProvider.js";

import { useState, useRef } from "react";
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

export default function ControlPanel({
  resetHandler,
  undo,
  redo,
  exportData,
}) {
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
          stage1: "PREP",
          startTime1: Date.now(),
          countdownAmt1: ONE_MIN,
        });

        break;
      case "GAME":
        setGameState1({
          stage1: "GAME",
          startTime1: Date.now(),
          countdownAmt1: THREE_MINS,
        });
        break;
      case "END":
        setGameState1({
          stage1: "END",
          startTime1: Date.now(),
          countdownAmt1: 0,
        });
        break;
    }
  }

  /* triggered when current countdown arrives at zero */
  /* automatically goes to next state of the game */
  /* can also be triggered manually */
  function nextTimerState(force) {
    fallthrough.current = false;
    switch (gameState1.stage1) {
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
      setTimerStage(gameState1.stage1);

      switch (gameState1.stage1) {
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
      switch (gameState1.stage1) {
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

  return (
    <>
      <Grid item>
        <Timer
          timerState={gameState1}
          setApi={setApi}
          onComplete={() => nextTimerState(false)}
          fallthrough={fallthrough.current}
        />
        <Grid item>{"Current state: " + gameState1.stage1}</Grid>
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
              gameState1.stage1 == "END"
                ? () => setShowExport(true)
                : timerBtnHandler
            }
          >
            {gameState1.stage1 == "END"
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
