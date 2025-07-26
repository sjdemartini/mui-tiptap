import Check from "@mui/icons-material/Check";
import { styled, useTheme, useThemeProps, type SxProps } from "@mui/material";
import { clsx } from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { getComponentName } from "../styles";
import {
  ColorSwatchButtonClassKey,
  colorSwatchButtonClasses,
  type ColorSwatchButtonClasses,
} from "./ColorSwatchButton.classes";

export interface ColorSwatchButtonProps
  // Omit the default "color" prop so that it can't be confused for the `value`
  // prop
  extends Omit<
    ComponentPropsWithoutRef<"button">,
    "color" | "className" | "classes"
  > {
  /**
   * What color is shown with this swatch. If not provided, shows a checkerboard
   * pattern, typically used as "not set" or "transparent".
   */
  value?: string;
  /**
   * An optional human-friendly name for this color, used as an aria-label for
   * the button.
   */
  label?: string;
  /**
   * Whether this swatch color is the currently active color. If true, shows an
   * overlaid checkmark as a visual indicator.
   */
  active?: boolean;
  /** If given, sets the padding between the color and the border of the swatch. */
  padding?: string | number;
  /** Optional additional className to provide to the root element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<ColorSwatchButtonClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
}

interface ColorSwatchButtonOwnerState
  extends Pick<ColorSwatchButtonProps, "active"> {
  colorNotSet: boolean;
}

const componentName = getComponentName("ColorSwatchButton");

const ColorSwatchButtonRoot = styled("button", {
  name: componentName,
  slot: "root" satisfies ColorSwatchButtonClassKey,
  overridesResolver: (
    props: { ownerState: ColorSwatchButtonOwnerState },
    styles,
  ) => [styles.root, props.ownerState.colorNotSet && styles.colorNotSet],
})<{ ownerState: ColorSwatchButtonOwnerState }>(({ theme, ownerState }) => ({
  height: theme.spacing(2.5),
  width: theme.spacing(2.5),
  minWidth: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius,
  borderColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[400],
  borderStyle: "solid",
  borderWidth: 1,
  cursor: "pointer",
  // Use background-clip with content-box so that if a `padding` is specified by the
  // user, it adds a gap between the color and the border.
  padding: 0,
  backgroundClip: "content-box",

  ...(ownerState.colorNotSet && {
    // To indicate that a color hasn't been chosen, we'll use a checkerboard pattern
    // (https://stackoverflow.com/a/65129916/4543977)
    background: `repeating-conic-gradient(
      ${theme.palette.grey[400]} 0% 25%, ${theme.palette.common.white} 0% 50%)
      50% / 12px 12px`,
    backgroundClip: "content-box",
  }),
}));

const ColorSwatchButtonActiveIcon = styled(Check, {
  name: componentName,
  slot: "activeIcon" satisfies ColorSwatchButtonClassKey,
  overridesResolver: (props, styles) => styles.activeIcon,
})(() => ({
  height: "100%",
  width: "80%",
  verticalAlign: "middle",
}));

/**
 * Renders a button in the given color `value`, useful for showing and allowing
 * selecting a color preset.
 */
export const ColorSwatchButton = forwardRef<
  ElementRef<"button">,
  ColorSwatchButtonProps
>((inProps, ref) => {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    value: colorValue,
    label,
    padding,
    active,
    className,
    classes = {},
    sx,
    ...buttonProps
  } = props;

  const theme = useTheme();
  const colorNotSet = !colorValue;

  const ownerState: ColorSwatchButtonOwnerState = {
    active,
    colorNotSet,
  };

  return (
    <ColorSwatchButtonRoot
      ref={ref}
      type="button"
      style={{ backgroundColor: colorValue, padding }}
      aria-label={label ?? colorValue}
      value={colorValue}
      {...buttonProps}
      className={clsx([
        colorSwatchButtonClasses.root,
        colorNotSet && [
          colorSwatchButtonClasses.colorNotSet,
          classes.colorNotSet,
        ],
        classes.root,
        className,
      ])}
      sx={sx}
      ownerState={ownerState}
    >
      {active && (
        <ColorSwatchButtonActiveIcon
          fontSize="small"
          className={clsx([
            colorSwatchButtonClasses.activeIcon,
            classes.activeIcon,
          ])}
          style={{
            color: colorValue
              ? theme.palette.getContrastText(colorValue)
              : undefined,
          }}
        />
      )}
    </ColorSwatchButtonRoot>
  );
});

ColorSwatchButton.displayName = "ColorSwatchButton";
