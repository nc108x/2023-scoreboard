import Countdown from "react-countdown";
import { zeroPad, calcTimeDelta, formatTimeDelta } from "react-countdown";

import Box from "@mui/material/Box";

import theme from "../Theme.js";
import { ThemeProvider } from "@mui/material/styles";

export default function Timer({ startTime, countdownAmt }) {
  let renderer = ({ minutes, seconds, milliseconds, completed }) => {
    if (completed) {
      return (
        <ThemeProvider theme={theme}>
          <Box sx={{ typography: "subtitle2", fontSize: 32 }}>END</Box>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme}>
          <Box sx={{ typography: "subtitle2", fontSize: 32 }}>
            {zeroPad(minutes)}:{zeroPad(seconds)}:{zeroPad(milliseconds, 3)}
          </Box>
        </ThemeProvider>
      );
    }
  };

  return (
    <>
      <Countdown
        date={startTime + countdownAmt}
        precision={3}
        intervalDelay={0}
        renderer={renderer}
      />
    </>
  );
}
