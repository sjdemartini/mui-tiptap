import { getUtilityClasses } from "../styles";

export interface MenuButtonClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the menu button icon. */
  icon: string;
}

export type MenuButtonClassKey = keyof MenuButtonClasses;

export const menuButtonClasses: MenuButtonClasses = getUtilityClasses(
  "MenuButton",
  ["root", "icon"] satisfies MenuButtonClassKey[],
);
