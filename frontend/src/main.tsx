import { ThemeProvider } from "@emotion/react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import theme from "./app/shared/theme";

ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
);
