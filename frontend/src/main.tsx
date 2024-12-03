import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";

import "@mui/material-pigment-css/styles.css";

ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
).render(
  <StrictMode>
    <HelmetProvider>
      <CssBaseline />
      <App />
    </HelmetProvider>
  </StrictMode>,
);
