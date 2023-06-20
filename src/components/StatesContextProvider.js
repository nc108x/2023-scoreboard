import { useFirebase } from "./FirebaseProvider.js";

import { useState, createContext, useContext, useRef, useEffect } from "react";

import { useObjectVal } from "react-firebase-hooks/database";

const emptyPoles = Array(11).fill(["empty"]);

/* history: 3d array representing the timeline */
/* historyDelta: the change in each entry of the timeline */
/* currPoles: 2d array representing all the poles */
const initialState = {
  stage: "PREP",
  startTime: Date.now(),
  countdownAmt: 60000,
  timerRunning: false,
  timerFallthrough: false,
  history: [emptyPoles],
  historyDelta: ["empty"],
  pointInTime: -1,
  currPoles: emptyPoles,
  redDragon: "征龍WAR DRAGON",
  blueDragon: "火之龍FIERY DRAGON",
  firstScorer: "NA",
};

const initialResult = {
  winner: false,
  winTime: -1,
  redScore: 0,
  blueScore: 0,
};

/* orientation: where red is located */
const defaultOptions = {
  orientation: "SOUTH",
  sync: false,
  labels: true,
};

const defaultTimeInfo = {
  startTime: Date.now(),
  elapsedTime: { min: 0, sec: 0, ms: 0 },
  remainingTime: { min: 0, sec: 0, ms: 0 },
};

const StatesContext = createContext({});

export default function StatesContextProvider({ children }) {
  const { dbRef, mutate } = useFirebase();

  const [gameState, _setGameState] = useState(initialState);
  /* TODO maybe don't use ref? there should be a better option */
  /* don't think ref is supposed to be used this way */
  const gameResult = useRef(initialResult);
  const [options, _setOptions] = useState(defaultOptions);
  /* const elapsedTime = useRef({ min: 0, sec: 0, ms: 0 }); */
  const timeInfo = useRef(defaultTimeInfo);

  function setGameState(newState) {
    if (options.sync) {
      mutate({ ...newState });
    } else {
      const copy = structuredClone(gameState);
      _setGameState({ ...copy, ...newState });
    }
  }

  function setOptions(newOptions) {
    const copy = structuredClone(options);
    _setOptions({ ...copy, ...newOptions });
  }

  const [dbState, loading, error] = useObjectVal(dbRef);

  useEffect(() => {
    if (options.sync) {
      if (typeof dbState == "undefined") {
        _setGameState(initialState);
      } else {
        const copy = structuredClone(gameState);
        _setGameState({ ...copy, ...dbState });
      }
    }
  }, [dbState]);

  useEffect(() => {
    if (true) timeInfo.current.startTime = Date.now();
  }, [dbState?.startTime]);

  return (
    <StatesContext.Provider
      value={{
        gameState,
        setGameState,
        gameResult,
        options,
        setOptions,
        timeInfo,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
}

export const useGameStates = () => useContext(StatesContext);
