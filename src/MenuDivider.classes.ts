import { getUtilityClasses } from "./styles";

export interface MenuDividerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type MenuDividerClassKey = keyof MenuDividerClasses;

const menuDividerClassKeys = [
  "root",
] as const satisfies ReadonlyArray<MenuDividerClassKey>;

export const menuDividerClasses: MenuDividerClasses = getUtilityClasses(
  "MenuDivider",
  menuDividerClassKeys,
);
