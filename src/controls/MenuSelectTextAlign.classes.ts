import { getUtilityClasses } from "../styles";

export interface MenuSelectTextAlignClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Select input element. */
  selectInput: string;
  /** Styles applied to each MenuItem element. */
  menuItem: string;
  /** Styles applied to the content wrapper inside each menu item. */
  menuOption: string;
  /** Styles applied to the menu option icon. */
  icon: string;
}

export type MenuSelectTextAlignClassKey = keyof MenuSelectTextAlignClasses;

export const menuSelectTextAlignClasses: MenuSelectTextAlignClasses =
  getUtilityClasses("MenuSelectTextAlign", [
    "root",
    "selectInput",
    "menuItem",
    "menuOption",
    "icon",
  ] satisfies MenuSelectTextAlignClassKey[]);
