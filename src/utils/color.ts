import { rgbToHex } from "@mui/material";

/**
 * Convert a color string to a color in hex string format (e.g. "#ff0000"), or
 * return null if the given string cannot be parsed as a valid color.
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
