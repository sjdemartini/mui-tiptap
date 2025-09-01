import { getUtilityClasses } from "./styles";

export interface MenuBarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when sticky=true. */
  sticky: string;
  /** Styles applied to the root element when sticky=false. */
  nonSticky: string;
  /** Styles applied to the content element. */
  content: string;
}

export type MenuBarClassKey = keyof MenuBarClasses;

export const menuBarClasses: MenuBarClasses = getUtilityClasses("MenuBar", [
  "root",
  "sticky",
  "nonSticky",
  "content",
] satisfies MenuBarClassKey[]);
