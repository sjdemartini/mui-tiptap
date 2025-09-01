import { getUtilityClasses } from "../styles";

export interface LinkBubbleMenuClasses {
  /** Styles applied to the root element (ControlledBubbleMenu root). */
  root: string;
  /** Styles applied to the Paper element (ControlledBubbleMenu paper). */
  paper: string;
  /** Styles applied to the content within the bubble menu. */
  content: string;
}

export type LinkBubbleMenuClassKey = keyof LinkBubbleMenuClasses;

export const linkBubbleMenuClasses: LinkBubbleMenuClasses = getUtilityClasses(
  "LinkBubbleMenu",
  ["root", "paper", "content"] satisfies LinkBubbleMenuClassKey[],
);
