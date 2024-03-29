import { useGameStates } from "./components/StatesContextProvider.js";

import Gamefield from "./components/Gamefield.js";
import Info from "./components/Info.js";
import ControlPanel from "./components/ControlPanel.js";
import Log from "./components/Log.js";
import Options from "./components/Options.js";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import { green } from "@mui/material/colors";

import theme from "./Theme.js";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { SnackbarProvider, enqueueSnackbar } from "notistack";

function App() {
  const { gameState, gameResult, options } = useGameStates();

  /* called by checkScore */
  function checkEndgame(topRings) {
    const redWinCon = topRings.slice(0, 8);
    const blueWinCon = topRings.slice(3, 11);

    if (redWinCon.every((currVal) => currVal == "RED")) {
      enqueueSnackbar(gameState.redDragon + " has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      gameResult.current.winner = "RED";
      if (gameResult.current.winTime == -1) {
        gameResult.current.winTime = gameState.historyDelta.length;
      }
    } else if (blueWinCon.every((currVal) => currVal == "BLUE")) {
      enqueueSnackbar(gameState.blueDragon + " has ended the game!", {
        variant: "success",
        preventDuplicate: true,
      });

      gameResult.current.winner = "BLUE";
      if (gameResult.current.winTime == -1) {
        gameResult.current.winTime = gameState.historyDelta.length;
      }
    } else {
      gameResult.current.winner = false;
      gameResult.current.winTime = -1;
    }
  }

  /* runs every time on rerender */
  function checkScore() {
    const type1 = [0, 1, 2, 8, 9, 10];
    const type2 = [3, 4, 6, 7];

    let redScore = 0;
    let blueScore = 0;

    let topRings = [];

    for (let i = 0; i < gameState.currPoles.length; i++) {
      topRings[i] = gameState.currPoles[i].at(-1);
      let scoreIncrease = 0;

      if (topRings[i] == "empty") {
        continue;
      }

      if (type1.includes(i)) {
        if (
          (i < 5 && topRings[i] == "BLUE") ||
          (i > 5 && topRings[i] == "RED")
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

      if (topRings[i] == "RED") {
        redScore += scoreIncrease;
      } else {
        blueScore += scoreIncrease;
      }
    }

    gameResult.current.redScore = redScore;
    gameResult.current.blueScore = blueScore;
    checkEndgame(topRings);
  }

  /* update score */
  checkScore();

  function SyncIndicator() {
    if (options.sync) {
      return (
        <>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              left: "90%",
              top: 16,
              color: green[500],
            }}
          >
            <CircleIcon sx={{ fontSize: 16 }} />
            {"SYNC ENABLED"}
          </Typography>
        </>
      );
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={1500}
          disableWindowBlurListener={true}
        >
          <Options />
          <SyncIndicator />
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
              <ControlPanel />
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
                  <Info color="RED" />
                </Grid>

                <Grid item>
                  <Log color="RED" />
                </Grid>
              </Grid>

              <Grid container direction="column" alignItems="center" xs={4}>
                <Gamefield />
              </Grid>

              <Grid
                container
                direction="column"
                alignItems="center"
                xs={4}
                justifyContent="space-between"
              >
                <Grid item>
                  <Info color="BLUE" />
                </Grid>

                <Grid item>
                  <Log color="BLUE" />
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
