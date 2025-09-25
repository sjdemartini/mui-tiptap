import { getUtilityClasses } from "../styles";

export interface MenuSelectLineHeightClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Select input element. */
  selectInput: string;
  /** Styles applied to the icon shown when no line height is set. */
  icon: string;
}

export type MenuSelectLineHeightClassKey = keyof MenuSelectLineHeightClasses;

export const menuSelectLineHeightClasses: MenuSelectLineHeightClasses =
  getUtilityClasses("MenuSelectLineHeight", [
    "root",
    "selectInput",
    "icon",
  ] satisfies MenuSelectLineHeightClassKey[]);
