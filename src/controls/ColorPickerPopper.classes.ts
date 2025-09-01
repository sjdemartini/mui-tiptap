import { getUtilityClasses } from "../styles";

export interface ColorPickerPopperClasses {
  /** Styles applied to the root popper element. */
  root: string;
}

export type ColorPickerPopperClassKey = keyof ColorPickerPopperClasses;

export const colorPickerPopperClasses: ColorPickerPopperClasses =
  getUtilityClasses("ColorPickerPopper", [
    "root",
  ] satisfies ColorPickerPopperClassKey[]);
