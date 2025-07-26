import { getUtilityClasses } from "../styles";

export interface ResizableImageResizerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ResizableImageResizerClassKey = keyof ResizableImageResizerClasses;

const resizableImageResizerClassKeys = [
  "root",
] as const satisfies ReadonlyArray<ResizableImageResizerClassKey>;

export const resizableImageResizerClasses: ResizableImageResizerClasses =
  getUtilityClasses("ResizableImageResizer", resizableImageResizerClassKeys);
