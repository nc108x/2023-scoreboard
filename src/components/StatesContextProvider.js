import { useState, createContext, useContext, createRef, useRef } from "react";

const emptyPoles = Array(11).fill(["empty"]);

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

const StatesContext = createContext({});

export function StatesContextProvider({ children }) {
  const [gameState, _setGameState] = useState(initialState);
  /* TODO maybe don't use ref? there should be a better option */
  /* don't think ref is supposed to be used this way */
  const gameResult = useRef(initialResult);

  function setGameState(newState) {
    const copy = structuredClone(gameState);
    _setGameState({ ...copy, ...newState });
  }

  return (
    <StatesContext.Provider value={{ gameState, setGameState, gameResult }}>
      {children}
    </StatesContext.Provider>
  );
}

export const useGameStates = () => useContext(StatesContext);
