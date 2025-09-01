import { getUtilityClasses } from "./styles";

export interface TableBubbleMenuClasses {
  /** Styles applied to the root element (ControlledBubbleMenu root). */
  root: string;
  /** Styles applied to the Paper element (ControlledBubbleMenu paper). */
  paper: string;
  /** Styles applied to the content within the bubble menu. */
  content: string;
}

export type TableBubbleMenuClassKey = keyof TableBubbleMenuClasses;

export const tableBubbleMenuClasses: TableBubbleMenuClasses = getUtilityClasses(
  "TableBubbleMenu",
  ["root", "paper", "content"] satisfies TableBubbleMenuClassKey[],
);
