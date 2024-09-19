import { Theme, SxProps } from "@mui/material/styles";
import {} from "@mui/material/themeCssVarsAugmentation";

declare module "@mui/material-pigment-css" {
  interface ThemeArgs {
    theme: Theme;
  }
}

declare module "@mui/material/styles" {
  interface ZIndex {
    debugBanner: number;
    cookieBanner: number;
    loading: number;
  }

  interface Theme {
    zIndex: ZIndex;
    customProperties: {
      borderRadius: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
      };
      time: {
        normal: string;
        slow: string;
      };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    zIndex?: Partial<ZIndex>;
    customProperties?: {
      borderRadius?: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
      };
      time?: {
        normal: string;
        slow: string;
      };
    };
  }
}

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
