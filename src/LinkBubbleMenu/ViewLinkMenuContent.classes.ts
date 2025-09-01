import { getUtilityClasses } from "../styles";

export interface ViewLinkMenuContentClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the link preview text elements. */
  linkPreviewText: string;
}

export type ViewLinkMenuContentClassKey = keyof ViewLinkMenuContentClasses;

export const viewLinkMenuContentClasses: ViewLinkMenuContentClasses =
  getUtilityClasses("ViewLinkMenuContent", [
    "root",
    "linkPreviewText",
  ] satisfies ViewLinkMenuContentClassKey[]);
