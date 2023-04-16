import Countdown from "react-countdown";
import { zeroPad } from "react-countdown";

import Box from "@mui/material/Box";

/* NOTE elapsed time is ONLY FOR GAME */
/* it assumes countdown is 3mins */
export let elapsedTime = 0;
export let remainingTime = 0;

function msToTime(og_ms) {
  const ms = ("0" + Math.floor((og_ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((og_ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(og_ms / 60 / 1000)).slice(-2);
  return { min, sec, ms };
}

/* TODO consider moving Timer.js up? or find a more elegant method of transporting elapsedTime */
export default function Timer({ timerState, setApi, onComplete }) {
  function onTick(time) {
    const min = time.minutes;
    const sec = time.seconds;
    const ms = time.milliseconds;
    remainingTime = { min, sec, ms };

    remainingTime = msToTime(min * 60000 + sec * 1000 + ms);
    elapsedTime = msToTime(180000 - (min * 60000 + sec * 1000 + ms));
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
        key={timerState.startTime.toString()}
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
