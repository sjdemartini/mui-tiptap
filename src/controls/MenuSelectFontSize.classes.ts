import { getUtilityClasses } from "../styles";

export interface MenuSelectFontSizeClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Select input element. */
  selectInput: string;
  /** Styles applied to the icon shown when no font size is set. */
  icon: string;
}

export type MenuSelectFontSizeClassKey = keyof MenuSelectFontSizeClasses;

export const menuSelectFontSizeClasses: MenuSelectFontSizeClasses =
  getUtilityClasses("MenuSelectFontSize", [
    "root",
    "selectInput",
    "icon",
  ] satisfies MenuSelectFontSizeClassKey[]);
