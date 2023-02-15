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
const STOP = 0;

export default function ControlPanel({
  resetPoles,
  swapDragons,
  undo,
  redo,
  timerState,
  setTimerState,
}) {
  let [confirmReset, setConfirmReset] = useState(false);

  /* to allow us to use the CountdownApi outside of Timer.js */
  const countdownApi = useRef();
  const setApi = (ref) => {
    if (!ref) return;

    countdownApi.current = ref.getApi();
    countdownApi.current.start();
  };

  /* triggered when current countdown arrives at zero */
  /* automatically goes to next state of the game */
  function nextTimerState() {
    console.log("ENTER NEXT STATE");
    switch (timerState.state) {
      case "PREP":
        setTimerState({
          state: "GAME",
          startTime: Date.now(),
          countdownAmt: THREE_MINS,
        });

        console.log("GO TO GAME");
        break;
      case "GAME":
        setTimerState({
          state: "IDLE",
          startTime: Date.now(),
          countdownAmt: STOP,
        });

        console.log("GO TO IDLE");
        break;
    }
  }

  /* triggered when button is clicked */
  /* toggles between starting and stopping current countdown */
  function timerBtnHandler() {
    console.log("BUTTON CLICKED");
    switch (timerState.state) {
      case "IDLE":
        setTimerState({
          state: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
        });

        console.log("GOING FROM IDLE TO PREP");
        break;

      case "PREP":
      case "GAME":
        setTimerState({
          state: "IDLE",
          startTime: Date.now(),
          countdownAmt: STOP,
        });

        console.log("GOING FROM PREP/GAME TO IDLE");
        break;
    }
  }

  return (
    <>
      <Grid item>
        <Timer
          timerState={timerState}
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
          <Button onClick={undo}>REDO</Button>
          <Button onClick={timerBtnHandler}>
            {timerState.state == "IDLE" ? "START" : "STOP"}
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
                All poles will be emptied. This action cannot be undone because
                I am too lazy to implement this feature.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setConfirmReset(false);
                  resetPoles();
                }}
              >
                繼續開game啦咁多野講
              </Button>
              <Button
                onClick={() => {
                  setConfirmReset(false);
                }}
                autoFocus
              >
                等等先不要
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
}