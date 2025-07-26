import { getUtilityClasses } from "../styles";

export interface MenuSelectHeadingClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Select input element. */
  selectInput: string;
  /** Styles applied to the content wrapper inside each menu item. */
  menuOption: string;
  /** Styles applied to the paragraph option (in addition to `menuOption`). */
  paragraphOption: string;
  /**
   * Styles applied to each heading option (in addition to `menuOption`), not
   * applied to the paragraph option.
   */
  headingOption: string;
  /** Styles applied to heading 1 options. */
  headingOption1: string;
  /** Styles applied to heading 2 options. */
  headingOption2: string;
  /** Styles applied to heading 3 options. */
  headingOption3: string;
  /** Styles applied to heading 4 options. */
  headingOption4: string;
  /** Styles applied to heading 5 options. */
  headingOption5: string;
  /** Styles applied to heading 6 options. */
  headingOption6: string;
}

export type MenuSelectHeadingClassKey = keyof MenuSelectHeadingClasses;

const menuSelectHeadingClassKeys = [
  "root",
  "selectInput",
  "menuOption",
  "paragraphOption",
  "headingOption",
  "headingOption1",
  "headingOption2",
  "headingOption3",
  "headingOption4",
  "headingOption5",
  "headingOption6",
] as const satisfies ReadonlyArray<MenuSelectHeadingClassKey>;

export const menuSelectHeadingClasses: MenuSelectHeadingClasses =
  getUtilityClasses("MenuSelectHeading", menuSelectHeadingClassKeys);
