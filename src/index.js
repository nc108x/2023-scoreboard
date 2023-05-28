import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { StatesContextProvider } from "./components/StatesContextProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StatesContextProvider>
      <App />
    </StatesContextProvider>
  </React.StrictMode>
);
