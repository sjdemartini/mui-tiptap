import { getUtilityClasses } from "../styles";

export interface HeadingWithAnchorComponentClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the container element. */
  container: string;
  /** Styles applied to the link element. */
  link: string;
  /** Styles applied to the link icon. */
  linkIcon: string;
}

export type HeadingWithAnchorComponentClassKey =
  keyof HeadingWithAnchorComponentClasses;

export const headingWithAnchorComponentClasses: HeadingWithAnchorComponentClasses =
  getUtilityClasses("HeadingWithAnchorComponent", [
    "root",
    "container",
    "link",
    "linkIcon",
  ] satisfies HeadingWithAnchorComponentClassKey[]);
