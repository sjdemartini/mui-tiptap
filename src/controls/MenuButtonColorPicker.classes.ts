import { getUtilityClasses } from "../styles";

export interface MenuButtonColorPickerClasses {
  /** Styles applied to the button icon. */
  icon: string;
  /** Styles applied to the color indicator icon. */
  colorIndicatorIcon: string;
  /** Styles applied to the color indicator icon when disabled. */
  colorIndicatorIconDisabled: string;
}

export type MenuButtonColorPickerClassKey = keyof MenuButtonColorPickerClasses;

export const menuButtonColorPickerClasses: MenuButtonColorPickerClasses =
  getUtilityClasses("MenuButtonColorPicker", [
    "icon",
    "colorIndicatorIcon",
    "colorIndicatorIconDisabled",
  ] satisfies MenuButtonColorPickerClassKey[]);
