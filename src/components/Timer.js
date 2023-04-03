import Countdown from "react-countdown";
import { zeroPad } from "react-countdown";

import Box from "@mui/material/Box";

export let elapsedTime = 0;

/* TODO consider moving Timer.js up? or find a more elegant method of transporting elapsedTime */
export default function Timer({ timerState, setApi, onComplete }) {
  function onTick(time) {
    const minutes = time.minutes;
    const seconds = time.seconds;
    const milliseconds = time.milliseconds;
    elapsedTime = { minutes, seconds, milliseconds };
    /* console.log(elapsedTime); */
  }

  let renderer = ({ minutes, seconds, milliseconds }) => {
    return (
      <>
        <Box sx={{ typography: "subtitle2", fontSize: 48 }}>
          {zeroPad(minutes)}:{zeroPad(seconds)}:{zeroPad(milliseconds, 3)}
        </Box>
      </>
    );
  };

  return (
    <>
      <Countdown
        date={timerState.startTime + timerState.countdownAmt}
        precision={3}
        intervalDelay={0}
        renderer={renderer}
        autoStart={false}
        ref={setApi}
        onComplete={onComplete}
        onTick={onTick}
      />
    </>
  );
}
