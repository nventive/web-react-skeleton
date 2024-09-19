import { PaletteOptions } from "@mui/material/styles";
// this is an example - colors can come from any other place
import colors from "@mui/material/colors";

export default function getPalette(): PaletteOptions {
  const { blue, red, orange, cyan, green, grey } = colors;

  const contrastText = "#fff";

  return {
    common: {
      black: "#000",
      white: "#fff",
    },
    primary: {
      100: blue[100],
      200: blue[200],
      light: blue[300],
      400: blue[400],
      main: blue[500],
      dark: blue[600],
      700: blue[700],
      900: blue[900],
      contrastText,
    },
    secondary: {
      100: grey[100],
      200: grey[200],
      light: grey[300],
      400: grey[400],
      main: grey[500],
      600: grey[600],
      dark: grey[700],
      800: grey[800],
      A100: grey.A100,
      A200: grey.A400,
      A400: grey.A700,
      contrastText,
    },
    error: {
      light: red[200],
      main: red[400],
      dark: red[700],
      contrastText,
    },
    warning: {
      light: orange[300],
      main: orange[500],
      dark: orange[700],
      contrastText: grey[100],
    },
    info: {
      light: cyan[300],
      main: cyan[500],
      dark: cyan[700],
      contrastText,
    },
    success: {
      light: green[300],
      main: green[500],
      dark: green[700],
      contrastText,
    },
    grey,
  };
}
