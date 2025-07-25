import { getUtilityClasses } from "./styles";

export interface RichTextFieldClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when variant="standard". */
  standard: string;
  /** Styles applied to the root element when variant="outlined". */
  outlined: string;
  /** Styles applied to the menu bar element. */
  menuBar: string;
  /** Styles applied to the menu bar content element. */
  menuBarContent: string;
  /** Styles applied to the content element. */
  content: string;
}

export type RichTextFieldClassKey = keyof RichTextFieldClasses;

const richTextFieldClassKeys = [
  "root",
  "standard",
  "outlined",
  "menuBar",
  "menuBarContent",
  "content",
] as const satisfies ReadonlyArray<RichTextFieldClassKey>;

export const richTextFieldClasses: RichTextFieldClasses = getUtilityClasses(
  "RichTextField",
  richTextFieldClassKeys,
);
