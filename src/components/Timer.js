import Countdown from "react-countdown";
import { zeroPad, CountdownApi } from "react-countdown";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const ONE_MIN = 60000;
const THREE_MINS = 180000;
const INF = 9999999999999999;
const STOP = 0;

export default function Timer({
  startTime,
  countdownAmt,
  setCountdownAmt,
  state,
  stateUpdate,
}) {
  console.log(setCountdownAmt);
  let renderer = ({ minutes, seconds, milliseconds, api }) => {
    function toggle() {
      if (api.isStopped()) {
        api.start();
      } else {
        api.stop();
      }
    }

    function btnCallback() {
      /* stateUpdate(); */
      toggle();
    }

    return (
      <>
        <Box sx={{ typography: "subtitle2", fontSize: 32 }}>
          {zeroPad(minutes)}:{zeroPad(seconds)}:{zeroPad(milliseconds, 3)}
        </Box>
      </>
    );
  };

  /* function onStop() { */
  /*   setCountdownAmt(STOP); */
  /* } */
  /**/
  /* function onStart() { */
  /*   setCountdownAmt(ONE_MIN); */
  /* } */

  return (
    <>
      <Countdown
        date={startTime + countdownAmt}
        precision={3}
        intervalDelay={0}
        renderer={renderer}
        autoStart={false}
        /* onStop={onStop} */
        /* onStart={onStart} */
      />
    </>
  );
}
