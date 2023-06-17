import { useGameStates } from "./StatesContextProvider.js";

import Timer from "./Timer.js";
import { ResetPrompt, ExportPrompt } from "./Prompts.js";

import { useState, useRef, useCallback, useEffect } from "react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import { enqueueSnackbar } from "notistack";

const ONE_MIN = 60000;
const THREE_MINS = 180000;
const emptyPoles = Array(11).fill(["empty"]);

export default function ControlPanel({}) {
  const { gameState, setGameState, gameResult, timeInfo } = useGameStates();

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showExport, setShowExport] = useState(false);

  /* to allow us to use the CountdownApi outside of Timer.js */
  const countdownApi = useRef();
  const setApi = (ref) => {
    if (!ref) return;

    countdownApi.current = ref.getApi();
  };

  /* to start/stop timer based on gameState */
  useEffect(() => {
    if (gameState.timerRunning) {
      countdownApi.current.start();
    } else {
      countdownApi.current.pause();
    }
  }, [gameState.timerRunning]);

  function setTimerStage(stage, running, fallthrough) {
    switch (stage) {
      case "PREP":
        setGameState({
          stage: "PREP",
          startTime: Date.now(),
          countdownAmt: ONE_MIN,
          timerRunning: running,
          timerFallthrough: fallthrough,
        });
        timeInfo.current.startTime = Date.now();
        break;

      case "GAME":
        setGameState({
          stage: "GAME",
          startTime: Date.now(),
          countdownAmt: THREE_MINS,
          timerRunning: running,
          timerFallthrough: fallthrough,
        });
        timeInfo.current.startTime = Date.now();
        break;

      case "END":
        setGameState({
          stage: "END",
          startTime: Date.now(),
          countdownAmt: 0,
          timerRunning: running,
          timerFallthrough: fallthrough,
        });
        timeInfo.current.startTime = Date.now();
        break;
    }
  }

  /* triggered when current countdown arrives at zero */
  /* automatically goes to next state of the game */
  /* can also be triggered manually */
  function nextTimerState(force) {
    switch (gameState.stage) {
      case "PREP":
        setTimerStage("GAME", !force, !force);

        if (force) {
          enqueueSnackbar("Fast forward to game time.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Game time has started.", {
            variant: "info",
          });
        }
        break;

      case "GAME":
        setTimerStage("END", false, false);
        if (force) {
          enqueueSnackbar("Fast forward to end.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Game has ended.", {
            variant: "info",
          });
        }
        break;

      case "END":
        if (force) {
          enqueueSnackbar("Please reset the scoreboard to start a new game.", {
            variant: "error",
          });
        }
        break;
    }
  }

  function prevTimerState() {
    /* if timer is running alr just go to beginning of the CURRENT state */
    if (gameState.timerRunning) {
      setTimerStage(gameState.stage, false, false);

      switch (gameState.stage) {
        case "PREP":
          enqueueSnackbar("Rewind to beginning of preparation time.", {
            variant: "success",
          });
          break;
        case "GAME":
          enqueueSnackbar("Rewind to beginning of game time.", {
            variant: "success",
          });
          break;
      }
    } else {
      /* go to previous state */
      switch (gameState.stage) {
        case "PREP":
          enqueueSnackbar("Nothing to rewind.", {
            variant: "error",
          });
          break;

        case "GAME":
          setTimerStage("PREP", false, false);
          enqueueSnackbar("Rewind to preparation time.", {
            variant: "success",
          });
          break;

        case "END":
          setTimerStage("GAME", false, false);
          enqueueSnackbar("Rewind to game time.", {
            variant: "success",
          });
          break;
      }
    }
  }

  /* triggered when button is clicked */
  /* toggles between starting and pausing current countdown */
  function timerBtnHandler() {
    if (gameState.stage == "END") {
      return;
    }

    if (countdownApi.current?.isPaused() || countdownApi.current?.isStopped()) {
      setGameState({ timerRunning: true, timerFallthrough: false });

      enqueueSnackbar("Timer started.", {
        variant: "success",
      });

      if (gameState.stage == "PREP") {
        enqueueSnackbar("Preparation time has started.", {
          variant: "info",
        });
      }
    } else {
      setGameState({ timerRunning: false, timerFallthrough: false });
      enqueueSnackbar("Timer paused.", {
        variant: "success",
      });
    }
  }

  function swapDragons() {
    setGameState({
      redDragon: gameState.blueDragon,
      blueDragon: gameState.redDragon,
    });

    enqueueSnackbar("Teams have been swapped.", {
      variant: "success",
    });
  }

  function resetHandler() {
    setGameState({
      stage: "PREP",
      startTime: Date.now(),
      countdownAmt: 60000,
      timerRunning: false,
      history: [emptyPoles],
      historyDelta: ["empty"],
      pointInTime: -1,
      currPoles: emptyPoles,
      firstScorer: "NA",
    });

    timeInfo.current = {
      startTime: Date.now(),
      elapsedTime: { min: 0, sec: 0, ms: 0 },
      remainingTime: { min: 0, sec: 0, ms: 0 },
    };

    enqueueSnackbar("Scoreboard has been reset.", {
      variant: "success",
    });
  }

  /* present will be denoted by -1 */
  /* since history.at(-1) corresponds to the newest entry in the stack */
  /* pointInTime should never be positive */
  /* undo/redo works by manipulating pointInTime */
  function undo() {
    if (-gameState.pointInTime == gameState.history.length) {
      enqueueSnackbar("Cannot undo any further!", {
        variant: "error",
      });
      return;
    }

    if (gameState.state == "END") {
      enqueueSnackbar("Currently modifying rings after game has ended.", {
        variant: "warning",
      });
    }
    setGameState({
      pointInTime: gameState.pointInTime - 1,
      currPoles: gameState.history.at(gameState.pointInTime - 1),
    });
  }

  function redo() {
    if (gameState.pointInTime == -1) {
      enqueueSnackbar("Cannot redo any further!", {
        variant: "error",
      });
      return;
    }

    if (gameState.state == "END") {
      enqueueSnackbar("Currently modifying rings after game has ended.", {
        variant: "warning",
      });
    }
    setGameState({
      pointInTime: gameState.pointInTime + 1,
      currPoles: gameState.history.at(gameState.pointInTime + 1),
    });
  }

  const undoShortcut = useCallback(
    (event) => {
      const platform = navigator.platform;
      if (platform.startsWith("Mac")) {
        if (event.key == "z" && event.metaKey == true) {
          event.preventDefault();
          undo();
        }
      } else {
        if (event.key == "z" && event.ctrlKey == true) {
          event.preventDefault();
          undo();
        }
      }
    },
    [gameState]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", undoShortcut);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", undoShortcut);
    };
  }, [undoShortcut]);

  const redoShortcut = useCallback(
    (event) => {
      const platform = navigator.platform;
      if (platform.startsWith("Mac")) {
        if (event.key == "y" && event.metaKey == true) {
          event.preventDefault();
          redo();
        }
      } else {
        if (event.key == "y" && event.ctrlKey == true) {
          event.preventDefault();
          redo();
        }
      }
    },
    [gameState]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", redoShortcut);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", redoShortcut);
    };
  }, [redoShortcut]);

  function exportData(type) {
    let exportStr = "";

    if (type == 0) {
      let timestamp = new Date();
      exportStr = exportStr.concat(timestamp);
      exportStr = exportStr.slice(0, exportStr.indexOf("G"));
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(gameState.redDragon);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(gameState.blueDragon);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(gameResult.current.redScore);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(gameResult.current.blueScore);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState.historyDelta.filter((element) => element[0] == "RED").length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameState.historyDelta.filter((element) => element[0] == "BLUE").length
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameResult.current.winner != false ? "TRUE" : "FALSE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameResult.current.winner
          ? gameResult.current.winner == "RED"
            ? gameState.redDragon
            : gameState.blueDragon
          : gameResult.current.redScore > gameResult.current.blueScore
          ? gameState.redDragon
          : gameResult.current.blueScore > gameResult.current.redScore
          ? gameState.blueDragon
          : "TIE"
      );
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(gameState.firstScorer);
      exportStr = exportStr.concat(";");

      exportStr = exportStr.concat(
        gameResult.current.winner != false
          ? gameState.historyDelta.at(-1)[2]
          : "03:00.00"
      );

    } else {
      for (let i = 0; i < gameState.currPoles.length; i++) {
        switch (gameState.currPoles[i].at(-1)) {
          case "empty":
            exportStr = exportStr.concat("0;");
            break;
          case "RED":
            exportStr = exportStr.concat("r;");
            break;
          case "BLUE":
            exportStr = exportStr.concat("b;");
            break;
        }
      }
    }

    return exportStr;
  }

  return (
    <>
      <Grid item>
        <Timer
          timerState={gameState}
          setApi={setApi}
          onComplete={() => nextTimerState(false)}
        />
        <Grid item>{"Current state: " + gameState.stage}</Grid>
        <Grid item>
          <Tooltip
            TransitionComponent={Zoom}
            title={"Rewind to previous state"}
          >
            <Button onClick={prevTimerState}>{"<<"}</Button>
          </Tooltip>
          <Button
            onClick={() => {
              setShowConfirmReset(true);
            }}
          >
            RESET
          </Button>
          <Button onClick={swapDragons}>SWAP</Button>
          <Button onClick={undo}>UNDO</Button>
          <Button onClick={redo}>REDO</Button>
          <Button
            onClick={
              gameState.stage == "END"
                ? () => setShowExport(true)
                : timerBtnHandler
            }
          >
            {gameState.stage == "END"
              ? "EXPORT"
              : gameState.timerRunning == false
              ? "START"
              : "PAUSE"}
          </Button>
          <Tooltip
            TransitionComponent={Zoom}
            title={"Fast forward to next state"}
          >
            <Button onClick={() => nextTimerState(true)}>{">>"}</Button>
          </Tooltip>

          <ResetPrompt
            showConfirmReset={showConfirmReset}
            setShowConfirmReset={setShowConfirmReset}
            resetHandler={resetHandler}
          />

          <ExportPrompt
            showExport={showExport}
            setShowExport={setShowExport}
            exportData={exportData}
          />
        </Grid>
      </Grid>
    </>
  );
}
