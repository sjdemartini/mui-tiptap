import { getUtilityClasses } from "./styles";

export interface FieldContainerClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if variant="outlined". */
  outlined: string;
  /** Styles applied to the root element if variant="standard". */
  standard: string;
  /** Styles applied to the root element if focused=true. */
  focused: string;
  /** Styles applied to the root element if disabled=true. */
  disabled: string;
  /** Styles applied to the notched outline element. */
  notchedOutline: string;
}

export type FieldContainerClassKey = keyof FieldContainerClasses;

const fieldContainerClassKeys = [
  "root",
  "outlined",
  "standard",
  "focused",
  "disabled",
  "notchedOutline",
] as const satisfies ReadonlyArray<FieldContainerClassKey>;

export const fieldContainerClasses: FieldContainerClasses = getUtilityClasses(
  "FieldContainer",
  fieldContainerClassKeys,
);
