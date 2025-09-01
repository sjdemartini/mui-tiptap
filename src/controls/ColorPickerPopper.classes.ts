import { getUtilityClasses } from "../styles";

export interface ColorPickerPopperClasses {
  /** Styles applied to the root popper element. */
  root: string;
}

export type ColorPickerPopperClassKey = keyof ColorPickerPopperClasses;

const colorPickerPopperClassKeys = [
  "root",
] as const satisfies ReadonlyArray<ColorPickerPopperClassKey>;

export const colorPickerPopperClasses: ColorPickerPopperClasses =
  getUtilityClasses("ColorPickerPopper", colorPickerPopperClassKeys);
