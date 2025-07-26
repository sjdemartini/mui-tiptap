import { getUtilityClasses } from "../styles";

export interface MenuSelectFontSizeClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Select input element. */
  selectInput: string;
  /** Styles applied to the menu button icon. */
  menuButtonIcon: string;
}

export type MenuSelectFontSizeClassKey = keyof MenuSelectFontSizeClasses;

const menuSelectFontSizeClassKeys = [
  "root",
  "selectInput",
  "menuButtonIcon",
] as const satisfies ReadonlyArray<MenuSelectFontSizeClassKey>;

export const menuSelectFontSizeClasses: MenuSelectFontSizeClasses =
  getUtilityClasses("MenuSelectFontSize", menuSelectFontSizeClassKeys);
