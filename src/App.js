import { useState } from "react";
import Grid from "@mui/material/Grid";

import theme from "./Theme.js";
import { ThemeProvider } from "@mui/material/styles";

import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";
import ControlPanel from "./components/ControlPanel.js";

function App() {
  let [poles, setPoles] = useState(Array(11).fill(Array(1).fill("empty")));
  let [history, setHistory] = useState(
    Array(1).fill(Array(11).fill(Array(1).fill("empty")))
  );
  let [pointInTime, setPointInTime] = useState(-1);
  /* console.log(history); */
  let [redDragon, setRedDragon] = useState("FIERY");
  let [blueDragon, setBlueDragon] = useState("WAR");

  function redScoreHandler(pole_no) {
    let temp = [...poles];
    temp[pole_no] = [...poles[pole_no], "red"];

    setPoles(temp);
    setHistory([...history.slice(0, history.length - pointInTime + 1), temp]);
    setPointInTime(-1);
  }

  function blueScoreHandler(e, pole_no) {
    /* to prevent right click menu from showing up */
    e.preventDefault();
    let temp = [...poles];
    temp[pole_no] = [...poles[pole_no], "blue"];

    setPoles(temp);
    setHistory([...history.slice(0, history.length - pointInTime + 1), temp]);
    setPointInTime(-1);
  }

  function resetPoles() {
    setPoles(Array(11).fill(Array(1).fill("empty")));
    setHistory(Array(1).fill(Array(11).fill(Array(1).fill("empty"))));
    setPointInTime(-1);
  }

  function swapDragons() {
    setRedDragon(redDragon == "FIERY" ? "WAR" : "FIERY");
    setBlueDragon(blueDragon == "FIERY" ? "WAR" : "FIERY");
  }

  /* present will be denoted by -1 */
  /* since history.at(-1) corresponds to the newest entry in the stack */
  function undo() {
    console.log("test");
    setPointInTime(pointInTime - 1);
    console.log(pointInTime - 1);
    setPoles(history.at(pointInTime - 1));
    console.log(history.at(pointInTime - 1));
    console.log("end");
  }

  function checkScore() {
    let type1 = [0, 1, 2, 8, 9, 10];
    let type2 = [3, 4, 6, 7];
    /* let type3 = 5; */

    let redScore = 0;
    let blueScore = 0;

    for (let i = 0; i < poles.length; i++) {
      console.log("Pole " + i + " " + poles[i].at(-1));

      let targetTeam = poles[i].at(-1);
      let scoreIncrease = 0;

      if (targetTeam == "empty") {
        continue;
      }

      if (type1.includes(i)) {
        if ((i < 5 && targetTeam == "blue") || (i > 5 && targetTeam == "red")) {
          scoreIncrease = 25;
        } else {
          scoreIncrease = 10;
        }
      } else if (type2.includes(i)) {
        scoreIncrease = 30;
      } else {
        scoreIncrease = 70;
      }

      if (targetTeam == "red") {
        redScore += scoreIncrease;
      } else {
        blueScore += scoreIncrease;
      }
    }

    console.log([redScore, blueScore]);
    return [redScore, blueScore];
  }

  /* update score */
  let [redScore, blueScore] = checkScore();

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
              resetPoles={resetPoles}
              swapDragons={swapDragons}
              undo={undo}
            />
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            sx={{ position: "relative", height: "462px" }}
          >
            <Grid item>
              <Info score={redScore} dragonName={redDragon} color="red" />
            </Grid>

            <Grid item>
              <Gamefield
                poles={poles}
                redScoreHandler={redScoreHandler}
                blueScoreHandler={blueScoreHandler}
              />
            </Grid>

            <Grid item>
              <Info score={blueScore} dragonName={blueDragon} color="blue" />
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default App;
