import { createTheme } from "@mui/material";
import style from "@styles/style.module.scss";

const parseMedia = (media: string) => parseInt(media.replace("px", ""));

const theme = createTheme({
  breakpoints: {
    values: {
      lg: parseMedia(style["media-lg"]),
      md: parseMedia(style["media-md"]),
      sm: parseMedia(style["media-sm"]),
      xl: parseMedia(style["media-xl"]),
      xs: parseMedia(style["media-xs"]),
    },
  },
  palette: {
    common: {
      black: style["basic-darkest"],
      white: style["basic-brightest"],
    },
    primary: {
      contrastText: style["basic-brightest"],
      dark: style["primary-dark"],
      light: style["primary-light"],
      main: style["primary-main"],
    },
    secondary: {
      contrastText: style["basic-brightest"],
      dark: style["secondary-dark"],
      light: style["secondary-light"],
      main: style["secondary-main"],
    },
  },
});

export default theme;
