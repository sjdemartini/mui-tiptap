import { createSvgIcon } from "@mui/material";

/**
 * A horizontal bar that is used as a color indicator, matching position and
 * appearance of the bar in icons like FormatColorText, BorderColor, etc. from
 * @mui/icons-material.
 *
 * This allows for rendering the color indication separately from the other
 * portion of the icon (the text letter, highlighter, etc.) when used with icons
 * like FormatColorTextNoBar, FormatInkHighlighterNoBar, and BorderColorNoBar.
 */
const FormatColorBar = createSvgIcon(
  <path d="M 2 20 h 20 v 4 H 2 v -4 z" />,
  "FormatColorBar",
);

export default FormatColorBar;
