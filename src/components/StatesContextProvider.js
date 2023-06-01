import { useState, createContext, useContext } from "react";

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
  winner: { winner: false, time: -1 },
};

const initialResult = {
  winner: false,
  timer: -1,
  redScore: 0,
  blueScore: 0,
};

const StatesContext = createContext({});

export function StatesContextProvider({ children }) {
  const [gameState, _setGameState] = useState(initialState);
  const [gameResult, _setGameResult] = useState(initialResult);

  function setGameState(newState) {
    const copy = structuredClone(gameState);
    _setGameState({ ...copy, ...newState });
  }

  function setGameResult(newResult) {
    const copy = structuredClone(gameResult);
    _setGameResult({ ...copy, ...newResult});
  }

  return (
    <StatesContext.Provider value={{ gameState, setGameState }}>
      {children}
    </StatesContext.Provider>
  );
}

export const useGameStates = () => useContext(StatesContext);
