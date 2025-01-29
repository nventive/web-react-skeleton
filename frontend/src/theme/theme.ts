import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";
import { borderRadius, breakpoints, spacingValues, zIndex } from "./variables";

const theme = createTheme({
  cssVariables: true, // creates css variables for theme values
  breakpoints: {
    values: breakpoints,
  },
  shape: {
    // Resetting the default multiplier of 4 for borderRadius
    // We can use fixed values from the variables.ts file
    borderRadius: 1,
  },
  zIndex: zIndex,
  palette: palette(),
  typography,
  // You can use the spacingValues from the variables.ts file or numbers (used as multiplier values)
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
    bottomNavigationHeight: 76,
  },
  components: {
    MuiCssBaseline: {},
  },
});

export default theme;
