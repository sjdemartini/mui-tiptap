import { TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";
import { makeStyles } from "tss-react/mui";
import { colorToHex as colorToHexDefault } from "../utils/color";
import ColorSwatchButton from "./ColorSwatchButton";

export type ColorChangeSource = "gradient" | "text" | "swatch";

export type ColorPickerProps = {
  /** Color value string (must be a valid CSS color), or empty string if unset. */
  value: string;
  /**
   * Callback when the user changes the color. The source indicates where the user's
   * change initiated: the draggable rainbow palette saturation/hue/alpha "gradient", the
   * "text" input, or a "swatch".
   */
  onChange: (color: string, source: ColorChangeSource) => void;
  /**
   * Override the default implementation for converting a given CSS color string
   * to a string in hex format (e.g. "#ff0000"). Should return null if the given
   * color cannot be parsed as valid.
   *
   * By default uses a wrapped version of @mui/material's `rgbToHex` function,
   * which supports input strings in these formats: hex like #000 and #00000000,
   * rgb(), rgba(), hsl(), hsla(), and color(). See
   * https://github.com/mui/material-ui/blob/e00a4d857fb2ea1b181afc35d0fd1ffc5631f0fe/packages/mui-system/src/colorManipulator.js#L54
   *
   * Third party libraries could be used here to offer more full-featured
   * parsing (e.g. handling CSS color name keywords, cmyk, etc.), such as colord
   * (https://www.npmjs.com/package/colord) and tinycolor2
   * (https://www.npmjs.com/package/@ctrl/tinycolor), which have a relatively
   * small footprint. They are not used directly by mui-tiptap to keep
   * dependencies as lean as possible.
   *
   * For instance using `colord`, this could be implemented as:
   *
   *   function(color) {
   *     const colordObject = colord(color);
   *     return colordObject.isValid() ? colordObject.toHex() : null;
   *   }
   *
   * Or with tinycolor2:
   *
   *   function(color) {
   *     const tinyColor = new TinyColor(color);
   *     return tinyColor.isValid ? tinyColor.toHexShortString() : null;
   *   }
   */
  colorToHex?: (color: string) => string | null;
  /**
   * A list of colors (must be valid CSS color strings) which are used to form buttons
   * for color swatches, which allow the user to choose from this preset selection of
   * colors, instead of the saturation/hue/alpha gradient color picker or text
   * interfaces.
   */
  swatchColors?: string[];
  /**
   * If true, disables the "alpha" slider option in the color picker, which controls
   * transparency.
   */
  disableAlpha?: boolean;
};

const useStyles = makeStyles({ name: { ColorPicker } })((theme) => ({
  gradientPicker: {
    // Increase specificity to override the styles
    "&&": {
      width: "100%",
    },
  },

  colorTextInput: {
    marginTop: theme.spacing(1),
  },

  swatchContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 5,
    marginTop: theme.spacing(1),
  },
}));

/**
 * Component for the user to choose a color from a gradient-based hue/saturation
 * (and optionall alpha) color-picker or from the given swatch colors.
 */
export default function ColorPicker({
  value,
  onChange,
  swatchColors,
  colorToHex = colorToHexDefault,
  disableAlpha = false,
}: ColorPickerProps) {
  const { classes } = useStyles();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Any time the color changes external to the text input, update the text
    // input to show the latest value, unless the input is currently focused
    // (since the user may be in the middle of editing)
    if (inputRef.current && inputRef.current !== document.activeElement) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <>
      {/* Fall back to black with the HexColorPickers if there isn't a (valid)
      color value provided. This ensures consistent visual behavior and should
      be intuitive. */}
      {disableAlpha ? (
        <HexColorPicker
          color={colorToHex(value) ?? "#000000"}
          onChange={(color) => onChange(color, "gradient")}
          className={classes.gradientPicker}
        />
      ) : (
        <HexAlphaColorPicker
          color={colorToHex(value) ?? "#000000"}
          onChange={(color) => onChange(color, "gradient")}
          className={classes.gradientPicker}
        />
      )}

      <TextField
        // TODO(Steven DeMartini): Allow users to override this placeholder for
        // localization/customization purposes
        placeholder={'Ex: "#7cb5ec"'}
        variant="outlined"
        size="small"
        defaultValue={value || ""}
        inputRef={inputRef}
        spellCheck={false}
        className={classes.colorTextInput}
        onChange={(event) => {
          const newColor = event.target.value;
          const newHexColor = colorToHex(newColor);
          if (newHexColor) {
            onChange(newHexColor, "text");
          }
        }}
        fullWidth
      />

      {swatchColors && swatchColors.length > 0 && (
        <div className={classes.swatchContainer}>
          {swatchColors.map((swatchColor) => (
            <ColorSwatchButton
              key={swatchColor}
              color={swatchColor}
              onClick={() => onChange(swatchColor, "swatch")}
            />
          ))}
        </div>
      )}
    </>
  );
}
