import { getUtilityClasses } from "./styles";

export interface RichTextContentClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied when the editor is in read-only mode (editable=false). */
  readonly: string;
  /** Styles applied when the editor is editable (editable=true). */
  editable: string;
}

export type RichTextContentClassKey = keyof RichTextContentClasses;

export const richTextContentClasses: RichTextContentClasses = getUtilityClasses(
  "RichTextContent",
  ["root", "readonly", "editable"] satisfies RichTextContentClassKey[],
);
