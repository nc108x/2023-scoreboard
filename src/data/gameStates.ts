export enum Pole {
  RED = "RED",
  BLUE = "BLUE",
}

export enum Orientation {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export enum GameState {
  PREP = "PREP",
  GAME = "GAME",
  END = "END",
}

export interface State {
  state: GameState;
  startTime: string;
  countdownAmt: number;
  fieldOrientation: Orientation;
  field: {
    red: string;
    blue: string;
  };
}

export interface States2023 extends State {
  poles: Pole[][];
  pointInTime: number;
  history: Pole[][][];
}
