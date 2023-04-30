import { extendTailwindMerge, fromTheme } from 'tailwind-merge';
import useBreakpoint from 'use-breakpoint';

export const tw = extendTailwindMerge({
  classGroups: {
    size: [
      {
        s: [fromTheme('spacing')],
      },
    ],
  },
});

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useTailwindBreakpointValue(
  values: { [key in keyof typeof BREAKPOINTS]: any },
  defaultBreakpoint?: keyof typeof BREAKPOINTS,
) {
  if (defaultBreakpoint === undefined) {
    defaultBreakpoint = 'md';
  }

  const { breakpoint } = useBreakpoint(BREAKPOINTS, defaultBreakpoint, false);

  return values[breakpoint];
}
