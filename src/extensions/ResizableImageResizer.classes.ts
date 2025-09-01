import { getUtilityClasses } from "../styles";

export interface ResizableImageResizerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ResizableImageResizerClassKey = keyof ResizableImageResizerClasses;

export const resizableImageResizerClasses: ResizableImageResizerClasses =
  getUtilityClasses("ResizableImageResizer", [
    "root",
  ] satisfies ResizableImageResizerClassKey[]);
