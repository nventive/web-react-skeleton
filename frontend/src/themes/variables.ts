import { CustomBorderRadius, CustomSpacing, CustomTime } from "@mui/material";
import { BreakpointsOptions, ZIndex } from "@mui/material/styles";

export const breakpoints: BreakpointsOptions["values"] = {
  xs: 640,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1440,
};

export const zIndex: Partial<ZIndex> = {
  debugBanner: 100,
  cookieBanner: 200,
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

export const time: CustomTime = {
  normal: "0.35s",
  slow: "0.5s",
};
