import {
  Box,
  styled,
  useThemeProps,
  type BoxProps,
  type SxProps,
} from "@mui/material";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import {
  fieldContainerClasses,
  type FieldContainerClassKey,
  type FieldContainerClasses,
} from "./FieldContainer.classes";
import { Z_INDEXES, getComponentName } from "./styles";

export type FieldContainerProps = Omit<
  BoxProps,
  "children" | "className" | "classes"
> & {
  /**
   * Which style to use for the field. "outlined" shows a border around the children,
   * which updates its appearance depending on hover/focus states, like MUI's
   * OutlinedInput. "standard" does not include any outer border.
   */
  variant?: "outlined" | "standard";
  /** The content to render inside the container. */
  children: ReactNode;
  /** Class applied to the `root` element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<FieldContainerClasses>;
  focused?: boolean;
  disabled?: boolean;
  /** Provide custom styles. */
  sx?: SxProps;
};

interface FieldContainerOwnerState
  extends Pick<FieldContainerProps, "variant" | "focused" | "disabled"> {}

const componentName = getComponentName("FieldContainer");

const FieldContainerRoot = styled(Box, {
  name: componentName,
  slot: "root" satisfies FieldContainerClassKey,
  overridesResolver: (
    props: { ownerState: FieldContainerOwnerState },
    styles,
  ) => [
    styles.root,
    props.ownerState.variant === "outlined" && styles.outlined,
    props.ownerState.variant === "standard" && styles.standard,
    props.ownerState.focused && styles.focused,
    props.ownerState.disabled && styles.disabled,
  ],
})<{ ownerState: FieldContainerOwnerState }>(({ theme, ownerState }) => ({
  // Based on the concept behind and styles of OutlinedInput and NotchedOutline
  // styles here, to imitate outlined input appearance in material-ui
  // https://github.com/mui-org/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/OutlinedInput.js#L9-L37
  // https://github.com/mui/material-ui/blob/a4972c5931e637611f6421ed2a5cc3f78207cbb2/packages/material-ui/src/OutlinedInput/NotchedOutline.js
  ...(ownerState.variant === "outlined" && {
    borderRadius: theme.shape.borderRadius,
    padding: 1,
    position: "relative",

    [`&:hover .${fieldContainerClasses.notchedOutline}`]: {
      borderColor: theme.palette.text.primary,
    },

    [`&.${fieldContainerClasses.focused} .${fieldContainerClasses.notchedOutline}`]:
      {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },

    [`&.${fieldContainerClasses.disabled} .${fieldContainerClasses.notchedOutline}`]:
      {
        borderColor: theme.palette.action.disabled,
      },
  }),
}));

const FieldContainerNotchedOutline = styled("fieldset", {
  name: componentName,
  slot: "notchedOutline" satisfies FieldContainerClassKey,
  overridesResolver: (props, styles) => styles.notchedOutline,
})<{ ownerState: FieldContainerOwnerState }>(({ theme }) => ({
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
}));

/**
 * Renders an element with classes and styles that correspond to the state and
 * style-variant of a user-input field, the content of which should be passed in as
 * `children`.
 */
export default function FieldContainer(inProps: FieldContainerProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    variant = "outlined",
    children,
    focused,
    disabled,
    classes = {},
    className,
    sx,
    ...boxProps
  } = props;

  const ownerState: FieldContainerOwnerState = { variant, focused, disabled };

  return (
    <FieldContainerRoot
      {...boxProps}
      className={clsx([
        fieldContainerClasses.root,
        className,
        classes.root,
        variant === "outlined"
          ? [fieldContainerClasses.outlined, classes.outlined]
          : [fieldContainerClasses.standard, classes.standard],
        // Note that we want focused and disabled styles of equal specificity to
        // trump default root/outlined/standard styles, so they should be defined
        // in this order
        focused && [fieldContainerClasses.focused, classes.focused],
        disabled && [fieldContainerClasses.disabled, classes.disabled],
      ])}
      sx={sx}
      ownerState={ownerState}
    >
      {children}

      {variant === "outlined" && (
        <FieldContainerNotchedOutline
          ownerState={ownerState}
          className={clsx([
            fieldContainerClasses.notchedOutline,
            classes.notchedOutline,
          ])}
          aria-hidden
        />
      )}
    </FieldContainerRoot>
  );
}
