import { Box, type BoxProps } from "@mui/material";
import type React from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { Z_INDEXES, getUtilityClasses } from "./styles";

export type FieldContainerClasses = ReturnType<typeof useStyles>["classes"];

export type FieldContainerProps = Except<BoxProps, "children"> & {
  /**
   * Which style to use for the field. "outlined" shows a border around the children,
   * which updates its appearance depending on hover/focus states, like MUI's
   * OutlinedInput. "standard" does not include any outer border.
   */
  variant?: "outlined" | "standard";
  /** The content to render inside the container. */
  children: React.ReactNode;
  /** Class applied to the `root` element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<FieldContainerClasses>;
  focused?: boolean;
  disabled?: boolean;
};

const fieldContainerClasses: FieldContainerClasses = getUtilityClasses(
  "FieldContainer",
  ["root", "outlined", "standard", "focused", "disabled", "notchedOutline"],
);

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const useStyles = makeStyles<void, "focused" | "disabled" | "notchedOutline">({
  name: { FieldContainer },
  uniqId: "Os7ZPW", // https://docs.tss-react.dev/nested-selectors#ssr
})((theme, _params, classes) => {
  // Based on the concept behind and styles of OutlinedInput and NotchedOutline
  // styles here, to imitate outlined input appearance in material-ui
  // https://github.com/mui-org/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/OutlinedInput.js#L9-L37
  // https://github.com/mui/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/NotchedOutline.js
  return {
    root: {},

    // Class/styles applied to the root element if the component is using the
    // "outlined" variant
    outlined: {
      borderRadius: theme.shape.borderRadius,
      padding: 1, //
      position: "relative",

      [`&:hover .${classes.notchedOutline}`]: {
        borderColor: theme.palette.text.primary,
      },

      [`&.${classes.focused} .${classes.notchedOutline}`]: {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },

      [`&.${classes.disabled} .${classes.notchedOutline}`]: {
        borderColor: theme.palette.action.disabled,
      },
    },

    // Class/styles applied to the root element if the component is using the
    // "standard" variant
    standard: {},

    // Class/styles applied to the root element if the component is focused (if the
    // `focused` prop is true)
    focused: {},

    // Styles applied to the root element if the component is disabled (if the
    // `disabled` prop is true)
    disabled: {},

    notchedOutline: {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      borderColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, 0.23)"
          : "rgba(255, 255, 255, 0.23)",
      borderStyle: "solid",
      borderWidth: 1,
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: Z_INDEXES.NOTCHED_OUTLINE,
    },
  };
});

/**
 * Renders an element with classes and styles that correspond to the state and
 * style-variant of a user-input field, the content of which should be passed in as
 * `children`.
 */
export default function FieldContainer({
  variant = "outlined",
  children,
  focused,
  disabled,
  classes: overrideClasses = {},
  className,
  ...boxProps
}: FieldContainerProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });

  return (
    <Box
      {...boxProps}
      className={cx(
        fieldContainerClasses.root,
        classes.root,
        variant === "outlined"
          ? [fieldContainerClasses.outlined, classes.outlined]
          : [fieldContainerClasses.standard, classes.standard],
        // Note that we want focused and disabled styles of equal specificity to
        // trump default root/outlined/standard styles, so they should be defined
        // in this order
        focused && [fieldContainerClasses.focused, classes.focused],
        disabled && [fieldContainerClasses.disabled, classes.disabled],
        className,
      )}
    >
      {children}

      {variant === "outlined" && (
        <div
          className={cx(
            fieldContainerClasses.notchedOutline,
            classes.notchedOutline,
          )}
          aria-hidden
        />
      )}
    </Box>
  );
}
