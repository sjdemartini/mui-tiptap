import type React from "react";
import { makeStyles } from "tss-react/mui";

type Props = {
  /** The content to render inside the outline. */
  children: React.ReactNode;
  className?: string;
  focused?: boolean;
  disabled?: boolean;
};

const useStyles = makeStyles({ name: { OutlinedField } })((theme) => {
  // Based on the OutlinedInput styles here
  // https://github.com/mui-org/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/OutlinedInput.js#L9-L37
  const borderColor =
    theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.23)"
      : "rgba(255, 255, 255, 0.23)";

  return {
    root: {
      borderRadius: theme.shape.borderRadius,
      borderColor,
      borderStyle: "solid",
      borderWidth: 1,
      padding: 1,

      "&:hover": {
        borderColor: theme.palette.text.primary,
      },

      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        "&:hover": {
          borderColor,
        },
      },
    },

    // Styles applied to the root element if the component is focused.
    focused: {
      // Increase specificity to trump &:hover
      "&&": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        padding: 0,
      },
    },

    // Styles applied to the root element if the component is disabled.
    disabled: {
      // Increase specificity to trump &:hover
      "&&": {
        borderColor: theme.palette.action.disabled,
      },
    },
  };
});

/** A component used to show an outline around a given field/input child. */
export default function OutlinedField({
  children,
  focused,
  disabled,
  className,
}: Props) {
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx(
        classes.root,
        focused && classes.focused,
        disabled && classes.disabled,
        className
      )}
    >
      {children}
    </div>
  );
}
