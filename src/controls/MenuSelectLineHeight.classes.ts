import { getUtilityClasses } from "../styles";

export interface MenuSelectLineHeightClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Select input element. */
  selectInput: string;
  /** Styles applied to the icon shown when no line height is set. */
  icon: string;
  /** Styles applied to the custom spacing dialog. */
  customSpacingDialog: string;
}

export type MenuSelectLineHeightClassKey = keyof MenuSelectLineHeightClasses;

export const menuSelectLineHeightClasses: MenuSelectLineHeightClasses =
  getUtilityClasses("MenuSelectLineHeight", [
    "root",
    "selectInput",
    "icon",
    "customSpacingDialog",
  ] satisfies MenuSelectLineHeightClassKey[]);
