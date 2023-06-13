import type React from "react";
import { makeStyles } from "tss-react/mui";
import { Z_INDEXES, getUtilityClasses } from "./styles";

export type OutlinedFieldClasses = ReturnType<typeof useStyles>["classes"];

export type OutlinedFieldProps = {
  /** The content to render inside the outline. */
  children: React.ReactNode;
  /** Class applied to the `root` element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<OutlinedFieldClasses>;
  focused?: boolean;
  disabled?: boolean;
};

const outlinedFieldClasses: OutlinedFieldClasses = getUtilityClasses(
  OutlinedField.name,
  ["root", "focused", "disabled", "notchedOutline"]
);

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const useStyles = makeStyles<void, "notchedOutline">({
  name: { OutlinedField },
  uniqId: "Os7ZPW", // https://docs.tss-react.dev/nested-selectors#ssr
})((theme, _params, classes) => {
  // Based on the concept behind and styles of OutlinedInput and NotchedOutline
  // styles here, to imitate outlined input appearance in material-ui
  // https://github.com/mui-org/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/OutlinedInput.js#L9-L37
  // https://github.com/mui/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/NotchedOutline.js
  return {
    root: {
      borderRadius: theme.shape.borderRadius,
      padding: 1, //
      position: "relative",

      [`&:hover .${classes.notchedOutline}`]: {
        borderColor: theme.palette.text.primary,
      },
    },

    // Styles applied to the root element if the component is focused.
    focused: {
      // Use && to trump &:hover above
      [`&& .${classes.notchedOutline}`]: {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },

    // Styles applied to the root element if the component is disabled.
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
      zIndex: Z_INDEXES.MENU_BAR,
    },
  };
});

/** A component used to show an outline around a given field/input child. */
export default function OutlinedField({
  children,
  focused,
  disabled,
  classes: overrideClasses = {},
  className,
}: OutlinedFieldProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });

  return (
    <div
      className={cx(
        outlinedFieldClasses.root,
        classes.root,
        focused && [outlinedFieldClasses.focused, classes.focused],
        disabled && [outlinedFieldClasses.disabled, classes.disabled],
        className
      )}
    >
      {children}
      <div
        className={cx(
          outlinedFieldClasses.notchedOutline,
          classes.notchedOutline
        )}
        aria-hidden
      />
    </div>
  );
}
