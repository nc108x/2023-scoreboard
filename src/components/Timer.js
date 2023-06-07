import { useGameStates } from "./StatesContextProvider.js";

import { useRef } from "react";

import Box from "@mui/material/Box";

import Countdown from "react-countdown";
import { zeroPad } from "react-countdown";

import useSound from "use-sound";
import countdownSFX from "../assets/sfx/countdown.mp3";

function msToTime(og_ms) {
  const ms = ("0" + Math.floor((og_ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((og_ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(og_ms / 60 / 1000)).slice(-2);
  return { min, sec, ms };
}

export default function Timer({ setApi, onComplete, fallthrough }) {
  const { gameState, timeInfo } = useGameStates();

  const [playCountdown] = useSound(countdownSFX, { volume: 0.25 });
  const playingCountdown = useRef(false);

  function onTick(time) {
    const min = time.minutes;
    const sec = time.seconds;
    const ms = time.milliseconds;

    timeInfo.current.remainingTime = msToTime(min * 60000 + sec * 1000 + ms);
    timeInfo.current.elapsedTime = msToTime(
      gameState.countdownAmt - (min * 60000 + sec * 1000 + ms)
    );

    if (
      timeInfo.current.remainingTime.sec == 3 &&
      timeInfo.current.remainingTime.ms == 10 &&
      !playingCountdown.current &&
      gameState.stage == "PREP"
    ) {
      playCountdown();
      playingCountdown.current = true;
    } else if (timeInfo.current.remainingTime.sec == 2) {
      playingCountdown.current = false;
    }
  }

  let renderer = ({ minutes, seconds, milliseconds }) => {
    return (
      <>
        <Box sx={{ typography: "subtitle2", fontSize: 84 }}>
          {zeroPad(minutes)}:{zeroPad(seconds)}:{zeroPad(milliseconds, 3)}
        </Box>
      </>
    );
  };

  return (
    <>
      <Countdown
        key={timeInfo.current.startTime}
        date={timeInfo.current.startTime + gameState.countdownAmt}
        precision={3}
        intervalDelay={0}
        renderer={renderer}
        autoStart={gameState.timerFallthrough && gameState.stage == "GAME" ? true : false}
        ref={setApi}
        onComplete={onComplete}
        onTick={onTick}
      />
    </>
  );
}
