import { getUtilityClasses } from "./styles";

export interface ControlledBubbleMenuClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the Paper element. */
  paper: string;
}

export type ControlledBubbleMenuClassKey = keyof ControlledBubbleMenuClasses;

export const controlledBubbleMenuClasses: ControlledBubbleMenuClasses =
  getUtilityClasses("ControlledBubbleMenu", [
    "root",
    "paper",
  ] satisfies ControlledBubbleMenuClassKey[]);
