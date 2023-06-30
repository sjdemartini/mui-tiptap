import type React from "react";
import { makeStyles } from "tss-react/mui";
import { Z_INDEXES, getUtilityClasses } from "./styles";

export type FieldContainerClasses = ReturnType<typeof useStyles>["classes"];

export type FieldContainerProps = {
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
  FieldContainer.name,
  ["root", "outlined", "standard", "focused", "disabled", "notchedOutline"]
);

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const useStyles = makeStyles<void, "notchedOutline">({
  name: { FieldContainer },
  uniqId: "Os7ZPW", // https://docs.tss-react.dev/nested-selectors#ssr
})((theme, _params, classes) => {
  // Based on the concept behind and styles of OutlinedInput and NotchedOutline
  // styles here, to imitate outlined input appearance in material-ui
  // https://github.com/mui-org/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/OutlinedInput.js#L9-L37
  // https://github.com/mui/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/NotchedOutline.js
  return {
    root: {},

    outlined: {
      borderRadius: theme.shape.borderRadius,
      padding: 1, //
      position: "relative",

      [`&:hover .${classes.notchedOutline}`]: {
        borderColor: theme.palette.text.primary,
      },
    },

    standard: {},

    // Styles applied to the root element if the component is focused (if the
    // `focused` prop is true).
    focused: {
      // Use && to trump &:hover above
      [`&& .${classes.notchedOutline}`]: {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },

    // Styles applied to the root element if the component is disabled (if the
    // `disabled` prop is true)
    disabled: {
      // Use && to trump &:hover above
      [`&& .${classes.notchedOutline}`]: {
        borderColor: theme.palette.action.disabled,
      },
    },

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
  variant,
  children,
  focused,
  disabled,
  classes: overrideClasses = {},
  className,
}: FieldContainerProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });

  return (
    <div
      className={cx(
        fieldContainerClasses.root,
        classes.root,
        focused && [fieldContainerClasses.focused, classes.focused],
        disabled && [fieldContainerClasses.disabled, classes.disabled],
        variant === "outlined"
          ? [fieldContainerClasses.outlined, classes.outlined]
          : [fieldContainerClasses.standard, classes.standard],
        className
      )}
    >
      {children}

      {variant === "outlined" && (
        <div
          className={cx(
            fieldContainerClasses.notchedOutline,
            classes.notchedOutline
          )}
          aria-hidden
        />
      )}
    </div>
  );
}
