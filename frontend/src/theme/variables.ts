import type { CustomBorderRadius, CustomSpacing } from "@mui/material";
import type { BreakpointsOptions, ZIndex } from "@mui/material/styles";

export const breakpoints: BreakpointsOptions["values"] = {
  xs: 0,
  sm: 444,
  md: 900,
  lg: 1200,
  xl: 1440,
};

export const zIndex: Partial<ZIndex> = {
  appBar: 9,
  /**
   * You can define z-index values for your custom components here. For example, you can define the following:
   *    debugBanner: 100,
   * and this will be available as a css variable like so: --mui-zIndex-debugBanner
   */
};

export const spacingValues: CustomSpacing = {
  a: "auto",
  xxs: 1,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
};

export const borderRadius: CustomBorderRadius = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 50,
};
