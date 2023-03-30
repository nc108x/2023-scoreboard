import { useState, useRef } from "react";
import Grid from "@mui/material/Grid";

import theme from "./Theme.js";
import { ThemeProvider } from "@mui/material/styles";

import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";
import ControlPanel from "./components/ControlPanel.js";

const empty_poles = Array(11).fill(["empty"]);

function App() {
  const [gameState, setGameState] = useState({
    state: "IDLE",
    startTime: Date.now(),
    countdownAmt: 60000,
  });

  const [poles, setPoles] = useState(empty_poles);
  const [pointInTime, setPointInTime] = useState(-1);
  const history = useRef([empty_poles]);

  const [redDragon, setRedDragon] = useState("FIERY");
  const [blueDragon, setBlueDragon] = useState("WAR");

  const redScore = useRef(0);
  const blueScore = useRef(0);
  const winner = useRef(null);

  function scoreHandler(e, pole_no, color) {
    /* to prevent right click menu from showing up */
    e.preventDefault();
    let temp = [...poles];
    temp[pole_no] = [...poles[pole_no], color];
    setPoles(temp);
    console.log(temp);

    /* update the timeline so that undo will work as intended */
    /* when a new ring is added, prune the future and set the current point in time to be the present */
    /* setHistory([...history.slice(0, history.length + pointInTime + 1), temp]); */
    history.current = [
      ...history.current.slice(0, history.current.length + pointInTime + 1),
      temp,
    ];
    setPointInTime(-1);
  }

  function resetHandler() {
    setPoles(empty_poles);
    /* setHistory(Array(1).fill(Array(11).fill(Array(1).fill("empty")))); */
    history.current = [empty_poles];
    setPointInTime(-1);
    setGameState({
      state: "IDLE",
      startTime: Date.now(),
      countdownAmt: 60000,
    });
    winner.current = null;
  }

  function swapDragons() {
    /* setRedDragon(redDragon == "FIERY" ? "WAR" : "FIERY"); */
    /* setBlueDragon(blueDragon == "FIERY" ? "WAR" : "FIERY"); */
    setRedDragon(redDragon == "FIERY" ? "WAR" : "FIERY");
    setBlueDragon(blueDragon == "FIERY" ? "WAR" : "FIERY");
  }

  /* present will be denoted by -1 */
  /* since history.at(-1) corresponds to the newest entry in the stack */
  /* pointInTime should never be positive */
  function undo() {
    console.log(history.current);
    if (Math.abs(pointInTime) == history.current.length) {
      console.log("CAN'T UNDO ANY FURTHER");
      return;
    }
    setPointInTime(pointInTime - 1);
    setPoles(history.current.at(pointInTime - 1));
  }

  function redo() {
    if (pointInTime + 1 == 0) {
      console.log("CAN'T REDO ANY FURTHER");
      return;
    }
    setPointInTime(pointInTime + 1);
    setPoles(history.current.at(pointInTime + 1));
  }

  function checkEndgame(topRings) {
    const redWinCon = topRings.slice(0, 8);
    const blueWinCon = topRings.slice(3, 11);

    /* console.log(redWinCon); */
    /* console.log(blueWinCon); */

    if (redWinCon.every((currVal) => currVal == "red")) {
      console.log("RED GREAT VICTORY");
      winner.current = redDragon;
    } else if (blueWinCon.every((currVal) => currVal == "blue")) {
      console.log("BLUE GREAT VICTORY");
      winner.current = blueDragon;
    } else {
      console.log("KEEP PLAYING NERD");
      winner.current = null;
    }
  }

  function checkScore() {
    const type1 = [0, 1, 2, 8, 9, 10];
    const type2 = [3, 4, 6, 7];
    /* let type3 = 5; */

    let redScore_t = 0;
    let blueScore_t = 0;

    let topRings = [];

    for (let i = 0; i < poles.length; i++) {
      /* console.log("Pole " + i + " " + poles[i].at(-1)); */

      topRings[i] = poles[i].at(-1);
      let scoreIncrease = 0;

      if (topRings[i] == "empty") {
        continue;
      }

      if (type1.includes(i)) {
        if (
          (i < 5 && topRings[i] == "blue") ||
          (i > 5 && topRings[i] == "red")
        ) {
          scoreIncrease = 25;
        } else {
          scoreIncrease = 10;
        }
      } else if (type2.includes(i)) {
        scoreIncrease = 30;
      } else {
        scoreIncrease = 70;
      }

      if (topRings[i] == "red") {
        redScore_t += scoreIncrease;
      } else {
        blueScore_t += scoreIncrease;
      }
    }

    /* console.log([redScore_t, blueScore_t]); */
    /* console.log(history); */
    /* console.log(pointInTime); */

    checkEndgame(topRings);

    return [redScore_t, blueScore_t];
  }

  /* update score */

  const [temp1, temp2] = checkScore();
  redScore.current = temp1;
  blueScore.current = temp2;
  /* if (winner.current == null) { */
  /*   const [temp1, temp2] = checkScore(); */
  /*   redScore.current = temp1; */
  /*   blueScore.current = temp2; */
  /* } else if (timerState.state != "END") { */
  /*   setTimerState({ */
  /*     state: "END", */
  /*     startTime: timerState.startTime, */
  /*     countdownAmt: timerState.countdownAmt, */
  /*   }); */
  /* } */

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          sx={{ textAlign: "center" }}
        >
          <Grid container justifyContent="space-evenly">
            <ControlPanel
              resetHandler={resetHandler}
              swapDragons={swapDragons}
              undo={undo}
              redo={redo}
              timerState={gameState}
              setTimerState={setGameState}
            />
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            sx={{ position: "relative", height: "462px" }}
          >
            <Grid item>
              <Info
                score={redScore.current}
                dragonName={redDragon}
                color="red"
              />
            </Grid>

            <Grid item>
              <Gamefield
                poles={poles}
                scoreHandler={scoreHandler}
                disabled={gameState.state != "GAME"}
              />
            </Grid>

            <Grid item>
              <Info
                score={blueScore.current}
                dragonName={blueDragon}
                color="blue"
              />
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default App;
