import { rgbToHex } from "@mui/material";

/**
 * Convert a color string to a color in hex string format (e.g. "#ff0000"), or
 * return null if the given string cannot be parsed as a valid color.
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
