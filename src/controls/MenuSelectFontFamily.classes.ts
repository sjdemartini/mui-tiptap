import { getUtilityClasses } from "../styles";

export interface MenuSelectFontFamilyClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Select input element. */
  selectInput: string;
}

export type MenuSelectFontFamilyClassKey = keyof MenuSelectFontFamilyClasses;

export const menuSelectFontFamilyClasses: MenuSelectFontFamilyClasses =
  getUtilityClasses("MenuSelectFontFamily", [
    "root",
    "selectInput",
  ] satisfies MenuSelectFontFamilyClassKey[]);
