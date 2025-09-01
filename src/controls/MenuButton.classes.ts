import { getUtilityClasses } from "../styles";

export interface MenuButtonClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the menu button icon. */
  icon: string;
}

export type MenuButtonClassKey = keyof MenuButtonClasses;

const menuButtonClassKeys = [
  "root",
  "icon",
] as const satisfies ReadonlyArray<MenuButtonClassKey>;

export const menuButtonClasses: MenuButtonClasses = getUtilityClasses(
  "MenuButton",
  menuButtonClassKeys,
);
