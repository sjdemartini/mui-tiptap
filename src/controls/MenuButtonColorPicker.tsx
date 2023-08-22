import {
  Button,
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  Stack,
  Tooltip,
  type PopperProps,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { MenuButton, Z_INDEXES, type MenuButtonProps } from "..";
import {
  ColorPicker,
  type ColorPickerProps,
  type SwatchColorOption,
} from "./ColorPicker";

export interface MenuButtonColorPickerProps
  // Omit the default "color" and "value" button props so that they can't be
  // confused for the `colorValue` prop
  extends Except<MenuButtonProps, "color" | "value"> {
  /** The current CSS color string value. */
  colorValue: string | undefined;
  /** Callback when the color changes. */
  onColorValueChange: (newColor: string) => void;
  /**
   * Provide default list of colors (must be valid CSS color strings) which
   * are used to form buttons for color swatches.
   */
  swatchColors?: SwatchColorOption[];
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

export interface ColorPickerPopperBodyProps
  extends Pick<
    MenuButtonColorPickerProps,
    "swatchColors" | "labels" | "ColorPickerProps"
  > {
  /** The current color value. Must be a valid CSS color string. */
  value: string;
  /** Callback when the user is saving/changing the current color. */
  onSave: (newColor: string) => void;
  /** Callback when the user is canceling updates to the current color. */
  onCancel: () => void;
}

export interface ColorPickerPopperProps
  extends PopperProps,
    ColorPickerPopperBodyProps {}

// NOTE: This component's state logic is able to be kept simple because the
// component is unmounted whenever the outer Popper is not open, so we don't
// have to worry about resetting the state ourselves when the user cancels, for
// instance.
export function ColorPickerPopperBody({
  value,
  onCancel,
  onSave,
  swatchColors,
  labels = {},
  ColorPickerProps,
}: ColorPickerPopperBodyProps) {
  const {
    removeColorButton = "None",
    removeColorButtonTooltipTitle = "",
    cancelButton = "Cancel",
    saveButton = "OK",
  } = labels;

  // Because color can change rapidly as the user drags the color in the
  // ColorPicker gradient, we'll wait until "Save" to call onColorChange, and
  // we'll store an internal localColor until then.
  const [localColor, setLocalColor] = useState<string>(value);
  // Update our internal value whenever the `color` prop changes (since this is
  // a controlled component)
  useEffect(() => {
    setLocalColor(value);
  }, [value]);

  return (
    <>
      <ColorPicker
        swatchColors={swatchColors}
        value={localColor}
        onChange={(newColor) => {
          setLocalColor(newColor);
        }}
        labels={labels}
        {...ColorPickerProps}
      />

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Tooltip title={removeColorButtonTooltipTitle} arrow>
          <Button
            onClick={() => {
              // No color being specified can mean "none" in some scenarios
              // (e.g. highlighting) and "default color"/reset in others (text)
              onSave("");
            }}
            size="small"
          >
            {removeColorButton}
          </Button>
        </Tooltip>

        <Button onClick={onCancel} size="small">
          {cancelButton}
        </Button>

        <Button
          onClick={() => {
            onSave(localColor);
          }}
          size="small"
        >
          {saveButton}
        </Button>
      </Stack>
    </>
  );
}
const useStyles = makeStyles({ name: { ColorPickerPopper } })({
  root: {
    zIndex: Z_INDEXES.BUBBLE_MENU,
    // This width seems to work well to allow exactly 8 swatches, as well as the
    // default button content
    width: 235,
  },
});

export function ColorPickerPopper({
  value,
  onSave,
  onCancel,
  swatchColors,
  ColorPickerProps,
  labels,
  ...popperProps
}: ColorPickerPopperProps) {
  const { classes, cx } = useStyles();
  return (
    <Popper
      transition
      placement="bottom-start"
      {...popperProps}
      className={cx(classes.root, popperProps.className)}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={100}>
          <div>
            <ClickAwayListener
              // Listen for "leading" events (the start of a click or touch)
              // rather than the trailing events (the end of a click) which is
              // the default, since it's easy to accidentally drag the
              // color-picker saturation/hue gradients beyond the edge of the
              // Popper, and we don't want to close in that situation.
              mouseEvent="onMouseDown"
              touchEvent="onTouchStart"
              onClickAway={onCancel}
            >
              <Paper elevation={5} sx={{ p: 2.5, pb: 1 }}>
                <ColorPickerPopperBody
                  value={value || ""}
                  onSave={onSave}
                  onCancel={onCancel}
                  swatchColors={swatchColors}
                  ColorPickerProps={ColorPickerProps}
                  labels={labels}
                />
              </Paper>
            </ClickAwayListener>
          </div>
        </Fade>
      )}
    </Popper>
  );
}

export function MenuButtonColorPicker({
  colorValue,
  onColorValueChange,
  swatchColors,
  labels,
  popperId,
  PopperProps,
  ColorPickerProps,
  ...menuButtonProps
}: MenuButtonColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <MenuButton
        onClick={(e) =>
          anchorEl ? handleClose() : setAnchorEl(e.currentTarget)
        }
        aria-describedby={popperId}
        {...menuButtonProps}
      />

      <ColorPickerPopper
        id={popperId}
        open={!!anchorEl}
        anchorEl={anchorEl}
        value={colorValue ?? ""}
        onSave={(newColor) => {
          onColorValueChange(newColor);
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
