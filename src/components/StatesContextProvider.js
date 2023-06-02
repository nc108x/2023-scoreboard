import { useState, createContext, useContext, useRef } from "react";

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
};

const StatesContext = createContext({});

export default function StatesContextProvider({ children }) {
  const [gameState, _setGameState] = useState(initialState);
  /* TODO maybe don't use ref? there should be a better option */
  /* don't think ref is supposed to be used this way */
  const gameResult = useRef(initialResult);
  const [options, _setOptions] = useState(defaultOptions);
  const elapsedTime = useRef({ min: 0, sec: 0, ms: 0 });

  function setGameState(newState) {
    const copy = structuredClone(gameState);
    _setGameState({ ...copy, ...newState });
  }

  function setOptions(newOptions) {
    const copy = structuredClone(options);
    _setOptions({ ...copy, ...newOptions });
  }

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
