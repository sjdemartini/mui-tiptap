import { getUtilityClasses } from "../styles";

export interface ResizableImageComponentClasses {
  /** Styles applied to the image container element. */
  imageContainer: string;
  /** Styles applied to the image element. */
  image: string;
  /** Styles applied to the image element when selected. */
  imageSelected: string;
  /** Styles applied to the resizer element. */
  resizer: string;
}

export type ResizableImageComponentClassKey =
  keyof ResizableImageComponentClasses;

const resizableImageComponentClassKeys = [
  "imageContainer",
  "image",
  "imageSelected",
  "resizer",
] as const satisfies ReadonlyArray<ResizableImageComponentClassKey>;

export const resizableImageComponentClasses: ResizableImageComponentClasses =
  getUtilityClasses(
    "ResizableImageComponent",
    resizableImageComponentClassKeys,
  );
