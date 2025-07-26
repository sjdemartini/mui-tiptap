import { getUtilityClasses } from "../styles";

export interface MenuSelectClasses {
  /** Styles applied to the root (Select) element. */
  root: string;
  /** Styles applied to the root tooltip wrapper element. */
  tooltip: string;
}

export type MenuSelectClassKey = keyof MenuSelectClasses;

const menuSelectClassKeys = [
  "root",
  "tooltip",
] as const satisfies ReadonlyArray<MenuSelectClassKey>;

export const menuSelectClasses: MenuSelectClasses = getUtilityClasses(
  "MenuSelect",
  menuSelectClassKeys,
);
