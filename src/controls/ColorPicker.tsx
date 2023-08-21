import { TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";
import { makeStyles } from "tss-react/mui";
import { colorToHex } from "../utils/color";
import ColorSwatchButton from "./ColorSwatchButton";

type ColorChangeSource = "gradient" | "text" | "swatch";

type Props = {
  /** Color value string (must be a valid CSS color), or empty string if unset. */
  value: string;
  /**
   * Callback when the user changes the color. The source indicates where the user's
   * change initiated: the draggable rainbow palette saturation/hue/alpha "gradient", the
   * "text" input, or a "swatch".
   */
  onChange: (color: string, source: ColorChangeSource) => void;
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
  disableAlpha = false,
}: Props) {
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
