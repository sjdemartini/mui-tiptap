import { rgbToHex } from "@mui/material";

/**
 * Convert a color string to a color in hex string format (e.g. "#ff0000"), or
 * return null if the given string cannot be parsed as a valid color.
 *
 * Examples:
 *   "rgb(169, 79, 211)" -> "#a94fd3"
 *   "#a94fd3" -> "#a94fd3"
 *   "not a color" -> null
 *
 * Uses @mui/material's `rgbToHex` function, which supports input strings in
 * these formats: hex like #000 and #00000000, rgb(), rgba(), hsl(), hsla(), and
 * color(). See
 * https://github.com/mui/material-ui/blob/e00a4d857fb2ea1b181afc35d0fd1ffc5631f0fe/packages/mui-system/src/colorManipulator.js#L54
 *
 * Separate third party libraries could be used instead of this function to
 * offer more full-featured parsing (e.g. handling CSS color name keywords,
 * cmyk, etc.), such as colord (https://www.npmjs.com/package/colord) and
 * tinycolor2 (https://www.npmjs.com/package/@ctrl/tinycolor), which have a
 * relatively small footprint. They are not used directly by mui-tiptap to keep
 * dependencies as lean as possible.
 */
export function colorToHex(color: string): string | null {
  try {
    // Though this function is named `rgbToHex`, it supports colors in various
    // formats (rgba, hex, hsl, etc.) as well
    return rgbToHex(color);
  } catch (err) {
    return null;
  }
}
