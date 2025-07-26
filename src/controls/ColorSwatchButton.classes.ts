import { getUtilityClasses } from "../styles";

export interface ColorSwatchButtonClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the active check icon. */
  activeIcon: string;
  /** Styles applied to the root element when no color is set. */
  colorNotSet: string;
}

export type ColorSwatchButtonClassKey = keyof ColorSwatchButtonClasses;

const colorSwatchButtonClassKeys = [
  "root",
  "activeIcon",
  "colorNotSet",
] as const satisfies ReadonlyArray<ColorSwatchButtonClassKey>;

export const colorSwatchButtonClasses: ColorSwatchButtonClasses =
  getUtilityClasses("ColorSwatchButton", colorSwatchButtonClassKeys);
