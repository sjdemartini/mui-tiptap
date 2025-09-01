import { getUtilityClasses } from "../styles";

export interface MenuControlsContainerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type MenuControlsContainerClassKey = keyof MenuControlsContainerClasses;

export const menuControlsContainerClasses: MenuControlsContainerClasses =
  getUtilityClasses("MenuControlsContainer", [
    "root",
  ] satisfies MenuControlsContainerClassKey[]);
