import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import FirebaseProvider from "./components/FirebaseProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </React.StrictMode>
);
