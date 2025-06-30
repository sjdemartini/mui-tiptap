import { createSvgIcon } from "@mui/material";

/**
 * A modified version of the FormatColorText icon from @mui/icons-material, with
 * the horizontal bar below the "A" letter removed.
 *
 * This allows us to control/render the color of the bar independently, via a
 * separate icon (mui-tipap's FormatColorBar).
 */
const FormatColorTextNoBar = createSvgIcon(
  <path d="M 5.49 17 h 2.42 l 1.27 -3.58 h 5.65 L 16.09 17 h 2.42 L 13.25 3 h -2.5 L 5.49 17 z m 4.42 -5.61 l 2.03 -5.79 h 0.12 l 2.03 5.79 H 9.91 z" />,
  "FormatColorTextNoBar",
);

export default FormatColorTextNoBar;
