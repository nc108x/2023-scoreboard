import { useState, createContext, useContext } from "react";

const emptyPoles = Array(11).fill(["empty"]);

const initialState = {
  stage: "PREP",
  startTime: Date.now(),
  countdownAmt: 0,
  history1: [emptyPoles],
  pointInTime: -1,
  currPoles1: emptyPoles,
  redDragon1: "FIERY",
  blueDragon1: "WAR",
};

const StatesContext = createContext({});

export function StatesContextProvider({ children }) {
  const [gameState1, _setGameState] = useState(initialState);

  function setGameState1(newState) {
    const copy = structuredClone(gameState1);
    _setGameState({ ...copy, ...newState });
  }

  return (
    <StatesContext.Provider value={{ gameState1, setGameState1 }}>
      {children}
    </StatesContext.Provider>
  );
}

export const useGameStates = () => useContext(StatesContext);
