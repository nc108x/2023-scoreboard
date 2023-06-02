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
  history: [emptyPoles],
  historyDelta: ["empty"],
  pointInTime: -1,
  currPoles: emptyPoles,
  redDragon: "FIERY",
  blueDragon: "WAR",
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
};

const StatesContext = createContext({});

export default function StatesContextProvider({ children }) {
  const { dbRef, mutate } = useFirebase();

  const [gameState, _setGameState] = useState(initialState);
  /* TODO maybe don't use ref? there should be a better option */
  /* don't think ref is supposed to be used this way */
  const gameResult = useRef(initialResult);
  const [options, _setOptions] = useState(defaultOptions);
  const elapsedTime = useRef({ min: 0, sec: 0, ms: 0 });

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
    if (typeof dbState != "undefined" && options.sync) {
      const copy = structuredClone(gameState);
      _setGameState({...copy, ...dbState});
    } else {
      _setGameState(initialState);
    }
  }, [dbState]);


  return (
    <StatesContext.Provider
      value={{
        gameState,
        setGameState,
        gameResult,
        options,
        setOptions,
        elapsedTime,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
}

export const useGameStates = () => useContext(StatesContext);
