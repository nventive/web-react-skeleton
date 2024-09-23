import { Theme, SxProps } from "@mui/material/styles";
import {} from "@mui/material/themeCssVarsAugmentation";

// Extend the Pigment CSS theme types with Material UI Theme
declare module "@mui/material-pigment-css" {
  interface ThemeArgs {
    theme: Theme;
  }
}

declare module "@mui/material/styles" {
  // Named like this to augment the existing ZIndex theme type
  interface ZIndex {
    debugBanner: number;
    cookieBanner: number;
    loading: number;
  }

  interface CustomSpacing {
    a: string;
    xxs: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  }

  interface CustomBorderRadius {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  }

  interface CustomTime {
    normal: string;
    slow: string;
  }

  interface Theme {
    zIndex: ZIndex;
    customProperties: {
      spacing: CustomSpacing;
      borderRadius: CustomBorderRadius;
      time: Partial<CustomTime>;
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    zIndex?: Partial<ZIndex>;
    customProperties?: {
      spacing?: Partial<CustomSpacing>;
      borderRadius?: Partial<CustomBorderRadius>;
      time?: Partial<CustomTime>;
    };
  }
}

// Allows typescript to recognize sx prop on HTML elements
declare global {
  namespace React {
    interface HTMLAttributes {
      sx?: SxProps<Theme>;
    }
    interface SVGProps {
      sx?: SxProps<Theme>;
    }
  }
}
