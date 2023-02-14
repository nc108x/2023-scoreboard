import { useState } from "react";
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

export default function ControlPanel({ resetPoles }) {
  let [timerState, setTimerState] = useState("IDLE");
  let [startTime, setStartTime] = useState(Date.now());
  let [countdownAmt, setCountdownAmt] = useState(ONE_MIN);
  let [confirmReset, setConfirmReset] = useState(false);

  function stateUpdate() {
    switch (timerState) {
      case "IDLE":
        setTimerState("PREP");
        break;

      case "PREP":
      case "GAME":
        setTimerState("IDLE");
        break;
    }
    console.log(timerState);
  }

  return (
    <>
      <Grid item>
        <Timer
          startTime={startTime}
          countdownAmt={countdownAmt}
          setCountdownAmt={setCountdownAmt}
          state={timerState}
          stateUpdate={stateUpdate}
        />
        <Grid item>
          <Button
            onClick={() => {
              setConfirmReset(true);
            }}
          >
            RESET
          </Button>
          <Button>test</Button>
          <Button>test</Button>

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
                I am lazy.
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
