import { getUtilityClasses } from "../styles";

export interface MenuSelectClasses {
  /** Styles applied to the root (Select) element. */
  root: string;
  /** Styles applied to the root tooltip wrapper element. */
  tooltip: string;
}

export type MenuSelectClassKey = keyof MenuSelectClasses;

export const menuSelectClasses: MenuSelectClasses = getUtilityClasses(
  "MenuSelect",
  ["root", "tooltip"] satisfies MenuSelectClassKey[],
);
