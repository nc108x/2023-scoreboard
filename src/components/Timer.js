import Countdown from "react-countdown";
import { zeroPad, calcTimeDelta, formatTimeDelta } from "react-countdown";

export default function Timer({ startTime, countdownAmt }) {
  let renderer = ({ minutes, seconds, milliseconds, completed }) => {
    if (completed) {
      return "END";
    } else {
      return (
        <span>
          {zeroPad(minutes)}:{zeroPad(seconds)}:{zeroPad(milliseconds, 3)}
        </span>
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
