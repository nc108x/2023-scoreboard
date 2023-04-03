import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

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
  function nextTimerState() {
    console.log("ENTER NEXT STATE");
    switch (gameState.state) {
      case "IDLE":
        console.log("REMAIN AT IDLE");
        break;

      case "PREP":
        setGameState({
          state: "GAME",
          startTime: Date.now(),
          countdownAmt: THREE_MINS,
        });

        countdownApi.current.start();

        console.log("GO TO GAME");
        break;

      case "GAME":
        setGameState({
          state: "END",
          startTime: Date.now(),
          countdownAmt: 0,
        });

        console.log("GO TO STOP");
        break;

      case "STOP":
        console.log("REMAIN AT STOP");
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

      if (gameState.state == "IDLE") {
        setGameState({
          state: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
        });
      }
    } else {
      countdownApi.current.pause();
      setTimerRun(false);
    }
  }

  return (
    <>
      <Grid item>
        <Timer
          timerState={gameState}
          setApi={setApi}
          onComplete={nextTimerState}
        />
        <Grid item>
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
