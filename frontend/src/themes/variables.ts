import { CustomBorderRadius, CustomSpacing } from "@mui/material";
import { BreakpointsOptions, ZIndex } from "@mui/material/styles";

export const breakpoints: BreakpointsOptions["values"] = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export const zIndex: Partial<ZIndex> = {
  debugBanner: 1200,
  cookieBanner: 1201,
  loading: 1000,
};

export const spacingValues: CustomSpacing = {
  a: "auto",
  xxs: "0.25rem",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem",
};

export const borderRadius: CustomBorderRadius = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
};
