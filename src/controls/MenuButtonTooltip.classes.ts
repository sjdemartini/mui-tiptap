import { getUtilityClasses } from "../styles";

export interface MenuButtonTooltipClasses {
  /**
   * Styles applied to the container element of the Tooltip's `title`, wrapping
   * the label and shortcut keys.
   */
  titleContainer: string;
  /** Styles applied to the label element. */
  label: string;
  /** Styles applied to each shortcut key element from `shortcutKeys`. */
  shortcutKey: string;
  /**
   * Styles applied to the element that contains the children content.
   *
   * We add an intermediary element since Tooltip requires a non-disabled child
   * element in order to render, and we want to allow tooltips to show up even
   * when buttons are disabled.
   *
   * This is effectively the "root" element that is rendered in the DOM at the
   * location of the MenuButtonTooltip, so will also receive the `className`
   * prop's class name. The tooltip itself will render in a portal.
   */
  contentWrapper: string;
}

export type MenuButtonTooltipClassKey = keyof MenuButtonTooltipClasses;

export const menuButtonTooltipClasses: MenuButtonTooltipClasses =
  getUtilityClasses("MenuButtonTooltip", [
    "titleContainer",
    "label",
    "shortcutKey",
    "contentWrapper",
  ] satisfies MenuButtonTooltipClassKey[]);
