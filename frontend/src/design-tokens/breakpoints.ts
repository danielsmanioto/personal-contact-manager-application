export const breakpoints = {
  mobile: '0px',
  tablet: '640px',
  desktop: '1024px',
  xl: '1280px',
} as const

export const breakpointRanges = {
  mobile: { min: 0, max: 639 },
  tablet: { min: 640, max: 1023 },
  desktop: { min: 1024, max: 1279 },
  xl: { min: 1280, max: Infinity },
} as const

export type Breakpoints = typeof breakpoints
