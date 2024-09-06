import { createTheme } from "@mui/material";
// import style from "@/styles/style.module.scss";

// const parseMedia = (media: string) => parseInt(media.replace("px", ""));

const theme = createTheme(
  {
    cssVariables: true,
  },
  /* {
  breakpoints: {
    values: {
      xs: parseMedia(style["media-xs"]),
      sm: parseMedia(style["media-sm"]),
      md: parseMedia(style["media-md"]),
      lg: parseMedia(style["media-lg"]),
      xl: parseMedia(style["media-xl"]),
    },
  },
  palette: {
    common: {
      black: style["basic-darkest"],
      white: style["basic-brightest"],
    },
    primary: {
      light: style["primary-light"],
      main: style["primary-main"],
      dark: style["primary-dark"],
      contrastText: style["basic-brightest"],
    },
    secondary: {
      light: style["secondary-light"],
      main: style["secondary-main"],
      dark: style["secondary-dark"],
      contrastText: style["basic-brightest"],
    },
  },
} */
);

export default theme;
