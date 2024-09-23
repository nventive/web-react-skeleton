import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";
import { breakpoints, zIndex, spacingValues, borderRadius } from "./variables";

const theme = createTheme({
  cssVariables: true, // creates css variables for theme values
  breakpoints: {
    values: breakpoints,
  },
  zIndex: zIndex,
  palette: palette(),
  typography,
  spacing: (value: number | keyof typeof spacingValues) => {
    if (typeof value === "number") {
      return `${0.25 * value}rem`;
    }
    return spacingValues[value];
  },
  // custom properties will also be available as css variables
  // for example: --mui-customProperties-spacing-a
  customProperties: {
    spacing: spacingValues,
    borderRadius: borderRadius,
  },
});

export default theme;
