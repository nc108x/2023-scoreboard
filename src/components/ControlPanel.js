import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Timer from "./Timer.js";

const ONE_MIN = 60000;
const THREE_MINS = 180000;
const INF = 9999999999999999;
const STOP = 0;

export default function ControlPanel({ resetPoles }) {
  let [timerState, setTimerState] = useState("IDLE");
  let [startTime, setStartTime] = useState(Date.now());
  let [countdownAmt, setCountdownAmt] = useState(ONE_MIN);

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
          <Button onClick={resetPoles}>RESET</Button>
          <Button>test</Button>
          <Button>test</Button>
        </Grid>
      </Grid>
    </>
  );
}
