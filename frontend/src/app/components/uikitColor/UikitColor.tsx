import { Grid, Palette, PaletteColor, useTheme } from "@mui/material";
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
        item
        className="flex align-center justify-center"
        xs
        height={50}
        bgcolor={bgColor}
      >
        {label}
      </Grid>
    );
  }, []);

  return (
    <Grid container>
      {colorItem(paletteColor.main, `${color}.main`)}
      {colorItem(paletteColor.light, `${color}.light`)}
      {colorItem(paletteColor.dark, `${color}.dark`)}
      {colorItem(paletteColor.contrastText, `${color}.contrastText`)}
    </Grid>
  );
}
