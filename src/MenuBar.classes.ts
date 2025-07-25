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

const menuBarClassKeys = [
  "root",
  "sticky",
  "nonSticky",
  "content",
] as const satisfies ReadonlyArray<MenuBarClassKey>;

export const menuBarClasses: MenuBarClasses = getUtilityClasses(
  "MenuBar",
  menuBarClassKeys,
);
