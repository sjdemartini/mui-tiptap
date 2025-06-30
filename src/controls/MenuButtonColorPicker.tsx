import type { PopperProps } from "@mui/material";
import { useState, type ReactNode } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { FormatColorBar } from "../icons";
import type { ColorPickerProps, SwatchColorOption } from "./ColorPicker";
import { ColorPickerPopper } from "./ColorPickerPopper";
import MenuButton, {
  MENU_BUTTON_FONT_SIZE_DEFAULT,
  type MenuButtonProps,
} from "./MenuButton";

export interface MenuButtonColorPickerProps
  // Omit the default `color`, `value`, and `onChange` toggle button props so
  // that "color" can't be confused for the `value` prop, and so that we can use
  // our own types for `value` and `onChange`.
  extends Except<MenuButtonProps, "color" | "value" | "onChange"> {
  /** The current CSS color string value. */
  value: string | undefined;
  /** Callback when the color changes. */
  onChange: (newColor: string) => void;
  /**
   * Provide default list of colors (must be valid CSS color strings) which
   * are used to form buttons for color swatches.
   */
  swatchColors?: SwatchColorOption[];
  /**
   * If true, hides the horizontal bar at the base of the icon/button area that
   * shows the currently active color `value`. The indicator pairs well with
   * `*NoBar` icons like `FormatColorTextNoBar`, so you may want to hide it if
   * your `IconComponent` clashes. By default false.
   */
  hideColorIndicator?: boolean;
  /**
   * Override the props for the popper that houses the color picker interface.
   */
  PopperProps?: Partial<PopperProps>;
  /** Override the props for the color picker. */
  ColorPickerProps?: Partial<ColorPickerProps>;
  /**
   * Unique HTML ID for the color picker popper that will be shown when clicking
   * this button (used for aria-describedby for accessibility).
   */
  popperId?: string;
  /** Override the default labels for any of the content. */
  labels?: {
    /**
     * Button label for removing the currently set color (setting the color to
     * ""). By default "None".
     */
    removeColorButton?: ReactNode;
    /**
     * Tooltip title for the button that removes the currently set color. By
     * default "" (no tooltip shown).
     */
    removeColorButtonTooltipTitle?: ReactNode;
    /**
     * Button label for canceling updating the color in the picker. By default
     * "Cancel".
     */
    cancelButton?: ReactNode;
    /**
     * Button label for saving the color chosen in the interface. By default
     * "OK".
     */
    saveButton?: ReactNode;
    /**
     * The placeholder shown in the text field entry for color. By default:
     * 'Ex: "#7cb5ec"'
     */
    textFieldPlaceholder?: string;
  };
}

const useStyles = makeStyles({ name: { MenuButtonColorPicker } })((theme) => ({
  menuButtonIcon: {
    fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,
  },

  colorIndicatorIcon: {
    position: "absolute",
  },

  colorIndicatorIconDisabled: {
    color: theme.palette.action.disabled,
  },
}));

export function MenuButtonColorPicker({
  value: colorValue,
  onChange,
  swatchColors,
  labels,
  hideColorIndicator = false,
  popperId,
  PopperProps,
  ColorPickerProps,
  ...menuButtonProps
}: MenuButtonColorPickerProps) {
  const { classes, cx } = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { IconComponent, children, ...otherMenuButtonProps } = menuButtonProps;

  return (
    <>
      <MenuButton
        onClick={(e) => {
          if (anchorEl) {
            handleClose();
          } else {
            setAnchorEl(e.currentTarget);
          }
        }}
        aria-describedby={popperId}
        {...otherMenuButtonProps}
      >
        {children ?? (
          <>
            {IconComponent && (
              <IconComponent className={classes.menuButtonIcon} />
            )}

            {/* We only show the color indicator if a color has been set. (It's
            effectively "transparent" otherwise, indicating no color has been
            chosen.) This bar indicator icon pairs well with the *NoBar icons
            like FormatColorTextNoBar. */}
            {!hideColorIndicator && colorValue && (
              <FormatColorBar
                className={cx(
                  classes.menuButtonIcon,
                  classes.colorIndicatorIcon,
                  menuButtonProps.disabled &&
                    classes.colorIndicatorIconDisabled,
                )}
                style={
                  menuButtonProps.disabled ? undefined : { color: colorValue }
                }
              />
            )}
          </>
        )}
      </MenuButton>

      <ColorPickerPopper
        id={popperId}
        open={!!anchorEl}
        anchorEl={anchorEl}
        value={colorValue ?? ""}
        onSave={(newColor) => {
          onChange(newColor);
          handleClose();
        }}
        onCancel={handleClose}
        swatchColors={swatchColors}
        ColorPickerProps={ColorPickerProps}
        labels={labels}
        {...PopperProps}
      />
    </>
  );
}
