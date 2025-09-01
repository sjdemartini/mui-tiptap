import { getUtilityClasses } from "./styles";

export interface MenuDividerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type MenuDividerClassKey = keyof MenuDividerClasses;

export const menuDividerClasses: MenuDividerClasses = getUtilityClasses(
  "MenuDivider",
  ["root"] satisfies MenuDividerClassKey[],
);
