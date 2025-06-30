import { createSvgIcon } from "@mui/material";

/**
 * A modified version of the FormatColorFill icon from @mui/icons-material, with
 * the horizontal bar below the "fill bucket" removed.
 *
 * This allows us to control/render the color of the bar independently, via a
 * separate icon (mui-tipap's FormatColorBar).
 */
const FormatColorFillNoBar = createSvgIcon(
  <path d="M 16.56 8.94 L 7.62 0 L 6.21 1.41 l 2.38 2.38 l -5.15 5.15 c -0.59 0.59 -0.59 1.54 0 2.12 l 5.5 5.5 c 0.29 0.29 0.68 0.44 1.06 0.44 s 0.77 -0.15 1.06 -0.44 l 5.5 -5.5 c 0.59 -0.58 0.59 -1.53 0 -2.12 z M 5.21 10 L 10 5.21 L 14.79 10 H 5.21 z M 19 11.5 s -2 2.17 -2 3.5 c 0 1.1 0.9 2 2 2 s 2 -0.9 2 -2 c 0 -1.33 -2 -3.5 -2 -3.5 z" />,
  "FormatColorFillNoBar",
);

export default FormatColorFillNoBar;
