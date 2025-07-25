import { getUtilityClasses } from "./styles";

export interface TableBubbleMenuClasses {
  /** Styles applied to the controls element. */
  controls: string;
}

export type TableBubbleMenuClassKey = keyof TableBubbleMenuClasses;

const tableBubbleMenuClassKeys = [
  "controls",
] as const satisfies ReadonlyArray<TableBubbleMenuClassKey>;

export const tableBubbleMenuClasses: TableBubbleMenuClasses = getUtilityClasses(
  "TableBubbleMenu",
  tableBubbleMenuClassKeys,
);
