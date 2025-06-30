import { createSvgIcon } from "@mui/material";

/**
 * A modified version of the BorderColor icon from @mui/icons-material, with
 * the horizontal bar below the pencil removed.
 *
 * This allows us to control/render the color of the bar independently, via a
 * separate icon (mui-tipap's FormatColorBar).
 */
const BorderColorNoBar = createSvgIcon(
  <path d="M 13.06 5.19 l 3.75 3.75 L 7.75 18 H 4 v -3.75 l 9.06 -9.06 z m 4.82 2.68 l -3.75 -3.75 l 1.83 -1.83 c 0.39 -0.39 1.02 -0.39 1.41 0 l 2.34 2.34 c 0.39 0.39 0.39 1.02 0 1.41 l -1.83 1.83 z" />,
  "BorderColorNoBar",
);

export default BorderColorNoBar;
