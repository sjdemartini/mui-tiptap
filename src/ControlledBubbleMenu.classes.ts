import { getUtilityClasses } from "./styles";

export interface ControlledBubbleMenuClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Paper element. */
  paper: string;
}

export type ControlledBubbleMenuClassKey = keyof ControlledBubbleMenuClasses;

const controlledBubbleMenuClassKeys = [
  "root",
  "paper",
] as const satisfies ReadonlyArray<ControlledBubbleMenuClassKey>;

export const controlledBubbleMenuClasses: ControlledBubbleMenuClasses =
  getUtilityClasses("ControlledBubbleMenu", controlledBubbleMenuClassKeys);
