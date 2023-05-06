import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
