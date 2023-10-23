import { extendTailwindMerge, fromTheme } from "tailwind-merge";

export const tw = extendTailwindMerge({
  classGroups: {
    size: [
      {
        s: [fromTheme("spacing")],
      },
    ],
  },
});
