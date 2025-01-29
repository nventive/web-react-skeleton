import "@mui/material/styles";
import {} from "@mui/material/themeCssVarsAugmentation";

declare module "@mui/material/styles" {
  // Named like this to augment the existing ZIndex theme type
  interface ZIndex {
    debugBanner: number;
    loading: number;
  }

  interface CustomSpacing {
    a: string;
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  }

  interface CustomBorderRadius {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  }

  interface Theme {
    zIndex: ZIndex;
    customProperties: {
      spacing: CustomSpacing;
      borderRadius: CustomBorderRadius;
      bottomNavigationHeight: number;
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    zIndex?: Partial<ZIndex>;
    customProperties?: {
      spacing?: Partial<CustomSpacing>;
      borderRadius?: Partial<CustomBorderRadius>;
      bottomNavigationHeight?: number;
    };
  }
}
