import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App"

export const container = document.getElementById("root");

// create a root
const root = ReactDOM.createRoot(container);

// initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)