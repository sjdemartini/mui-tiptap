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
import { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { Z_INDEXES } from "../styles";
import { ColorPicker } from "./ColorPicker";
import type { MenuButtonColorPickerProps } from "./MenuButtonColorPicker";

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
  // ColorPicker gradient, we'll wait until "Save" to call the onSave prop, and
  // we'll store an internal localColor until then. (This could alternatively be
  // implemented such that we "save" directly whenever a swatch preset is
  // clicked, by looking at the `source` from `ColorPicker.onChange`, but it may
  // be useful to tweak a color from a swatch before saving.)
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

/**
 * Renders the ColorPicker inside of a Popper interface, for use with the
 * MenuButtonColorPicker.
 */
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
