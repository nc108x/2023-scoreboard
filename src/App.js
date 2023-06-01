import { useState, useRef } from "react";
import Grid from "@mui/material/Grid";

import theme from "./Theme.js";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";
import ControlPanel from "./components/ControlPanel.js";
import Log from "./components/Log.js";
import Options from "./components/Options.js";

import { SnackbarProvider, enqueueSnackbar } from "notistack";

import { useGameStates } from "./components/StatesContextProvider.js";

function App() {
  const { gameState1 } = useGameStates();

  const winner = useRef({ winner: false, time: -1 });

  const [orientation, setOrientation] = useState("red");

  /* passed to options menu */
  function toggleOrientation() {
    if (orientation == "red") {
      setOrientation("blue");
    } else {
      setOrientation("red");
    }
  }

  /* called by checkScore */
  function checkEndgame(topRings) {
    const redWinCon = topRings.slice(0, 8);
    const blueWinCon = topRings.slice(3, 11);

    if (redWinCon.every((currVal) => currVal == "red")) {
      enqueueSnackbar(gameState1.redDragon1 + " Dragon has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      winner.current.winner = "red";
      if (winner.current.time == -1) {
        winner.current.time = gameState1.historyDelta.length;
      }
    } else if (blueWinCon.every((currVal) => currVal == "blue")) {
      enqueueSnackbar(gameState1.blueDragon1 + " Dragon has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      winner.current.winner = "blue";
      if (winner.current.time == -1) {
        winner.current.time = gameState1.historyDelta.length;
      }
    } else {
      winner.current.winner = false;
      winner.current.time = -1;
    }
  }

  /* runs every time on rerender */
  function checkScore() {
    const type1 = [0, 1, 2, 8, 9, 10];
    const type2 = [3, 4, 6, 7];

    let redScore = 0;
    let blueScore = 0;

    let topRings = [];

    for (let i = 0; i < gameState1.currPoles.length; i++) {
      topRings[i] = gameState1.currPoles[i].at(-1);
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
        redScore += scoreIncrease;
      } else {
        blueScore += scoreIncrease;
      }
    }

    checkEndgame(topRings);

    return [redScore, blueScore];
  }

  function exportData(type) {
    let exportStr = "";

    if (type == 0) {
      let timestamp = new Date();
      timestamp.toISOString();
      exportStr = exportStr.concat(timestamp);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? "RED" : "BLUE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? "BLUE" : "RED"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? redScore : blueScore
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.redDragon1 == "FIERY" ? blueScore : redScore
      );
      exportStr = exportStr.concat(";");

      const fieryColor = gameState1.redDragon1 == "FIERY" ? "red" : "blue";

      exportStr = exportStr.concat(
        gameState1.historyDelta.filter((element) => element[0] == fieryColor)
          .length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState1.historyDelta.filter(
          (element) => element[0] != fieryColor && element != "empty"
        ).length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        winner.current.winner != false ? "TRUE" : "FALSE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        winner.current.winner
          ? winner.current.winner == "red"
            ? gameState1.redDragon1
            : gameState1.blueDragon1
          : redScore > blueScore
          ? gameState1.redDragon1
          : blueScore > redScore
          ? gameState1.blueDragon1
          : "TIE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        winner.current.winner != false
          ? gameState1.historyDelta.at(-1)[2]
          : "03:00:00"
      );
      exportStr = exportStr.concat(";");
    } else {
      for (let i = 0; i < gameState1.currPoles.length; i++) {
        switch (gameState1.currPoles[i].at(-1)) {
          case "empty":
            exportStr = exportStr.concat("0;");
            break;
          case "red":
            exportStr = exportStr.concat("r;");
            break;
          case "blue":
            exportStr = exportStr.concat("b;");
            break;
        }
      }
    }

    return exportStr.slice(0, -1);
  }

  /* update score */
  const [redScore, blueScore] = checkScore();

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={1500}>
          <Options toggleOrientation={toggleOrientation} />
          <Grid
            container
            direction="column"
            justifyContent="space-evenly"
            spacing={3}
            sx={{
              textAlign: "center",
            }}
          >
            <Grid container item justifyContent="space-evenly">
              <ControlPanel exportData={exportData} />
            </Grid>
            <Grid container item direction="row">
              <Grid
                container
                direction="column"
                alignItems="center"
                xs={4}
                justifyContent="space-between"
              >
                <Grid item>
                  <Info score={redScore} color="red" winner={winner.current} />
                </Grid>

                <Grid item>
                  <Log
                    color="red"
                    winner={winner.current}
                    orientation={orientation}
                  />
                </Grid>
              </Grid>

              <Grid container direction="column" alignItems="center" xs={4}>
                <Gamefield orientation={orientation} />
              </Grid>

              <Grid
                container
                direction="column"
                alignItems="center"
                xs={4}
                justifyContent="space-between"
              >
                <Grid item>
                  <Info
                    score={blueScore}
                    color="blue"
                    winner={winner.current}
                  />
                </Grid>

                <Grid item>
                  <Log winner={winner.current} orientation={orientation} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
