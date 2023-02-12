import { useState } from "react";
import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";

function App() {
  let [poles, setPoles] = useState(Array(11).fill(Array(0)));

  function redScoreHandler(pole_no) {
    let temp = [...poles];
    temp[pole_no] = [...poles[pole_no], "red"];

    setPoles(temp);
  }

  function blueScoreHandler(e, pole_no) {
    /* to prevent right click menu from showing up */
    e.preventDefault();
    let temp = [...poles];
    temp[pole_no] = [...poles[pole_no], "blue"];

    setPoles(temp);
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

      if (targetTeam == null) {
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
  }

  checkScore();

  /* console.log("this is a test"); */
  /* console.log(poles); */
  return (
    <div className="main">
      <Info />

      <Gamefield
        poles={poles}
        redScoreHandler={redScoreHandler}
        blueScoreHandler={blueScoreHandler}
      />

      <Info />
    </div>
  );
}

export default App;
