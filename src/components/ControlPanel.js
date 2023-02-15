import { useState, useRef, useEffect } from "react";
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
const INF = 9999999999999999;
const STOP = 0;

export default function ControlPanel({ resetPoles, swapDragons, undo, redo }) {
  let [timerState, setTimerState] = useState("IDLE");
  let [startTime, setStartTime] = useState(Date.now());
  let [countdownAmt, setCountdownAmt] = useState(STOP);
  let [confirmReset, setConfirmReset] = useState(false);

  const countdownApi = useRef();
  const setApi = (ref) => {
    if (!ref) return;

    countdownApi.current = ref.getApi();
    countdownApi.current.start();
  };

  function timerToggle() {
    if (countdownApi.current.isStopped()) {
      countdownApi.current.start();
    } else {
      countdownApi.current.stop();
    }
  }

  function stateBridge() {
    console.log("ENTER BRIDGE");
    if (timerState == "PREP") {
      setTimerState("GAME");
      setStartTime(Date.now());
      setCountdownAmt(THREE_MINS);
      console.log("GO TO GAME");
    } else if (timerState == "GAME") {
      setTimerState("IDLE");
      setCountdownAmt(STOP);
      console.log("GO TO IDLE");
    }
  }

  function timerBtnHandler() {
    console.log("BUTTON CLICKED");
    switch (timerState) {
      case "IDLE":
        console.log("GOING FROM IDLE TO PREP");
        setStartTime(Date.now());
        setCountdownAmt(ONE_MIN);
        setTimerState("PREP");
        break;

      case "PREP":
      case "GAME":
        console.log("GOING FROM PREP/GAME TO IDLE");
        setCountdownAmt(STOP);
        setTimerState("IDLE");
        break;
    }
    timerToggle();
  }

  return (
    <>
      <Grid item>
        <Timer
          startTime={startTime}
          countdownAmt={countdownAmt}
          setCountdownAmt={setCountdownAmt}
          setApi={setApi}
          /* onComplete={() => { */
          /*   console.log("heyyy"); */
          /* }} */
          onComplete={stateBridge}
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
            {timerState == "IDLE" ? "START" : "STOP"}
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
