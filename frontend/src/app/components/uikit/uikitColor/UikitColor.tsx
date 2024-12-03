import { Palette, PaletteColor } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material-pigment-css";
import { useCallback, useMemo } from "react";

interface IUikitColor {
  color: keyof Palette;
}

export default function UikitColor({ color }: IUikitColor) {
  const theme = useTheme();
  const paletteColor = useMemo(
    () => theme.palette[color] as PaletteColor,
    [color, theme.palette],
  );

  const colorItem = useCallback((bgColor: string, label: string) => {
    return (
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        bgcolor={bgColor}
        size={"grow"}
        flexBasis={50}
      >
        {label}
      </Grid>
    );
  }, []);

  return (
    <Grid container direction={"column"}>
      {colorItem(paletteColor.main, `${color}.main`)}
      {colorItem(paletteColor.light, `${color}.light`)}
      {colorItem(paletteColor.dark, `${color}.dark`)}
      {colorItem(paletteColor.contrastText, `${color}.contrastText`)}
    </Grid>
  );
}
