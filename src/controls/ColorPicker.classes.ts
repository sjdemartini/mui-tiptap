import { getUtilityClasses } from "../styles";

export interface ColorPickerClasses {
  /** Styles applied to the gradient picker element. */
  gradientPicker: string;
  /** Styles applied to the color text input element. */
  colorTextInput: string;
  /** Styles applied to the swatch container element. */
  swatchContainer: string;
}

export type ColorPickerClassKey = keyof ColorPickerClasses;

export const colorPickerClasses: ColorPickerClasses = getUtilityClasses(
  "ColorPicker",
  [
    "gradientPicker",
    "colorTextInput",
    "swatchContainer",
  ] satisfies ColorPickerClassKey[],
);
