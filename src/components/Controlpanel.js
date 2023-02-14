import { useState } from "react";

import Timer from "./Timer.js";

const ONE_MIN = 60000;
const THREE_MINS = 180000;
const INF = 9999999999999999;

export default function ControlPanel() {
  let [startTime, setStartTime] = useState(Date.now());
  let [countdownAmt, setCountdownAmt] = useState(ONE_MIN);

  return <Timer startTime={startTime} countdownAmt={countdownAmt} />;
}
