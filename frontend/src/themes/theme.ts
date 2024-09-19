import { createTheme } from "@mui/material/styles";
import palette from "./palette";

const theme = createTheme({
  cssVariables: true,
  breakpoints: {
    values: {
      xs: 640,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1440,
    },
  },
  zIndex: {
    debugBanner: 100,
    cookieBanner: 200,
    loading: 1000,
  },
  palette: palette(),
  customProperties: {
    borderRadius: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
    },
    time: {
      normal: "0.35s",
      slow: "0.5s",
    },
  },
});

export default theme;
