import { TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";
import { makeStyles } from "tss-react/mui";
import { getUtilityClasses } from "../styles";
import { colorToHex as colorToHexDefault } from "../utils/color";
import { ColorSwatchButton } from "./ColorSwatchButton";

export type ColorPickerClasses = ReturnType<typeof useStyles>["classes"];

export type ColorChangeSource = "gradient" | "text" | "swatch";

export type SwatchColorOptionObject = {
  /**
   * The underlying CSS color value string, which can be any valid CSS
   * color, though ideally should be parseable with your `colorToHex` function;
   * ex: "#9fc5e8", "rgb(159, 197, 232)".
   */
  value?: string;
  /**
   * A customized label to include as an aria-label for this color when used as
   * a swatch button. If not provided, uses the `value` as the option's label.
   */
  label?: string;
};

/**
 * A color to use as a swatch button for the color picker.
 *
 * Must be either a CSS color string (ex: "#9fc5e8" or "rgb(159, 197, 232)") or
 * a SwatchColorOptionObject which provides an optional additional label.
 */
export type SwatchColorOption = string | SwatchColorOptionObject;

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
   * Needed to ensure that the hue/saturation/alpha color picker can interpret
   * the given color `value` (regardless of its format), and also used to
   * parse/handle the user's text input.
   *
   * Examples:
   *   "rgb(169, 79, 211)" -> "#a94fd3"
   *   "#a94fd3" -> "#a94fd3"
   *   "not a color" -> null
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
   * A list of colors which are used to form buttons for color swatches, which
   * allow the user to choose from this preset selection of colors, instead of
   * the saturation/hue/alpha gradient color picker or text interfaces.
   */
  swatchColors?: SwatchColorOption[];
  /**
   * If true, disables the "alpha" slider option in the color picker, which
   * controls transparency.
   */
  disableAlpha?: boolean;
  /** Override the default labels for any of the content. */
  labels?: {
    /**
     * The placeholder shown in the text field entry for color. By default:
     * 'Ex: "#7cb5ec"'
     */
    textFieldPlaceholder?: string;
  };
  /**
   * Override or extend existing styles. These classes are merged with the
   * default utility classes. For instance, if you need to conditionally hide
   * the swatch container, you could do:
   *
   *   ColorPickerProps={{
   *     classes: {
   *       swatchContainer: shouldHide ? "hide" : undefined
   *     }
   *   }}
   *
   * And in your CSS:
   *
   *   .MuiTiptap-ColorPicker-swatchContainer.hide {
   *     display: none;
   *   }
   */
  classes?: Partial<ColorPickerClasses>;
};

const colorPickerUtilityClasses: ColorPickerClasses = getUtilityClasses(
  "ColorPicker",
  ["gradientPicker", "colorTextInput", "swatchContainer"],
);

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
 * (and optionally alpha) color-picker or from the given swatch colors.
 */
export function ColorPicker({
  value,
  onChange,
  swatchColors,
  colorToHex = colorToHexDefault,
  disableAlpha = false,
  labels = {},
  classes: overrideClasses = {},
}: ColorPickerProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });
  const { textFieldPlaceholder = 'Ex: "#7cb5ec"' } = labels;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Any time the color changes external to the text input, update the text
    // input to show the latest value, unless the input is currently focused
    // (since the user may be in the middle of editing)
    if (inputRef.current && inputRef.current !== document.activeElement) {
      inputRef.current.value = value;
    }
  }, [value]);

  const swatchColorObjects: SwatchColorOptionObject[] = (
    swatchColors ?? []
  ).map((swatchColor) =>
    typeof swatchColor === "string" ? { value: swatchColor } : swatchColor,
  );

  const colorValueAsHex = colorToHex(value);
  return (
    <>
      {/* Fall back to black with the HexColorPickers if there isn't a (valid)
      color value provided. This ensures consistent visual behavior and should
      be intuitive. */}
      {disableAlpha ? (
        <HexColorPicker
          color={colorValueAsHex ?? "#000000"}
          className={cx(
            colorPickerUtilityClasses.gradientPicker,
            classes.gradientPicker,
          )}
          onChange={(color) => {
            onChange(color, "gradient");
          }}
        />
      ) : (
        <HexAlphaColorPicker
          color={colorValueAsHex ?? "#000000"}
          className={cx(
            colorPickerUtilityClasses.gradientPicker,
            classes.gradientPicker,
          )}
          onChange={(color) => {
            onChange(color, "gradient");
          }}
        />
      )}

      <TextField
        placeholder={textFieldPlaceholder}
        variant="outlined"
        size="small"
        defaultValue={value || ""}
        inputRef={inputRef}
        spellCheck={false}
        className={cx(
          colorPickerUtilityClasses.colorTextInput,
          classes.colorTextInput,
        )}
        onChange={(event) => {
          const newColor = event.target.value;
          const newHexColor = colorToHex(newColor);
          if (newHexColor) {
            onChange(newHexColor, "text");
          }
        }}
        fullWidth
      />

      {swatchColorObjects.length > 0 && (
        <div
          className={cx(
            colorPickerUtilityClasses.swatchContainer,
            classes.swatchContainer,
          )}
        >
          {swatchColorObjects.map((swatchColor) => (
            <ColorSwatchButton
              key={swatchColor.value}
              value={swatchColor.value}
              label={swatchColor.label}
              onClick={() => {
                onChange(swatchColor.value ?? "", "swatch");
              }}
              // We'll show the swatch as active if this swatch color is naively
              // equal to the current color, if this swatch is for "transparent"
              // and no color is set, or if the color matches when parsing and
              // converting both colors to hex.
              active={
                swatchColor.value == value ||
                (!swatchColor.value && !value) ||
                (!!swatchColor.value &&
                  !!colorValueAsHex &&
                  colorToHex(swatchColor.value) === colorValueAsHex)
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
