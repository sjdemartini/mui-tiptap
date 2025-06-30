import { createSvgIcon } from "@mui/material";

/**
 * A modified version of the FormatInkHighlighter icon, with the horizontal bar
 * below the highlighter removed.
 *
 * This allows us to control/render the color of the bar independently, via a
 * separate icon (mui-tipap's FormatColorBar).
 */
const FormatInkHighlighterNoBar = createSvgIcon(
  <path d="M 10.6 8 l 5.4 5.425 l -4 4 q -0.6 0.6 -1.413 0.6 t -1.412 -0.6 L 8.5 18 h -5 l 3.15 -3.125 q -0.6 -0.6 -0.625 -1.438 T 6.6 12 l 4 -4 Z M 12 6.575 L 16 2.6 q 0.6 -0.6 1.413 -0.6 t 1.412 0.6 l 2.6 2.575 q 0.6 0.6 0.6 1.413 T 21.425 8 l -4 4 L 12 6.575 Z" />,
  "FormatInkHighlighterNoBar",
);

export default FormatInkHighlighterNoBar;
