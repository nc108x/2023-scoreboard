import Countdown from "react-countdown";
import { zeroPad } from "react-countdown";

import Box from "@mui/material/Box";

export default function Timer({
  startTime,
  countdownAmt,
  setCountdownAmt,
  setApi,
  onComplete,
}) {
  console.log(setCountdownAmt);
  let renderer = ({ minutes, seconds, milliseconds, api }) => {
    return (
      <>
        <Box sx={{ typography: "subtitle2", fontSize: 32 }}>
          {zeroPad(minutes)}:{zeroPad(seconds)}:{zeroPad(milliseconds, 3)}
        </Box>
      </>
    );
  };
  /* console.log(onComplete); */

  return (
    <>
      <Countdown
        date={startTime + countdownAmt}
        precision={3}
        intervalDelay={0}
        renderer={renderer}
        autoStart={false}
        ref={setApi}
        onComplete={onComplete}
      />
    </>
  );
}
