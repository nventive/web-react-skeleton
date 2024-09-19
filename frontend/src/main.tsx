import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

import "@mui/material-pigment-css/styles.css";

ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
