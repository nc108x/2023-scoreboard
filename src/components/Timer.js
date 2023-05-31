import { useGameStates } from "./StatesContextProvider.js";

import { useRef } from "react";

import Countdown from "react-countdown";
import { zeroPad } from "react-countdown";

import Box from "@mui/material/Box";

import useSound from "use-sound";
import countdownSFX from "../assets/sfx/countdown.mp3";

export let elapsedTime = 0;
export let remainingTime = 0;

function msToTime(og_ms) {
  const ms = ("0" + Math.floor((og_ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((og_ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(og_ms / 60 / 1000)).slice(-2);
  return { min, sec, ms };
}

/* TODO consider moving Timer.js up? or find a more elegant method of transporting elapsedTime */
export default function Timer({ setApi, onComplete, fallthrough }) {
  const { gameState1 } = useGameStates();

  const [playCountdown] = useSound(countdownSFX, { volume: 0.25 });
  const playingCountdown = useRef(false);

  function onTick(time) {
    const min = time.minutes;
    const sec = time.seconds;
    const ms = time.milliseconds;
    remainingTime = { min, sec, ms };

    remainingTime = msToTime(min * 60000 + sec * 1000 + ms);
    elapsedTime = msToTime(
      gameState1.countdownAmt - (min * 60000 + sec * 1000 + ms)
    );

    if (
      remainingTime.sec == 3 &&
      remainingTime.ms == 10 &&
      !playingCountdown.current &&
      gameState1.stage == "PREP"
    ) {
      playCountdown();
      playingCountdown.current = true;
    } else if (remainingTime.sec == 2) {
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
        key={gameState1.startTime}
        date={gameState1.startTime + gameState1.countdownAmt}
        precision={3}
        intervalDelay={0}
        renderer={renderer}
        autoStart={fallthrough && gameState1.state == "GAME" ? true : false}
        ref={setApi}
        onComplete={onComplete}
        onTick={onTick}
      />
    </>
  );
}
