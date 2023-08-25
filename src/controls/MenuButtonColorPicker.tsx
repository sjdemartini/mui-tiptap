import type { PopperProps } from "@mui/material";
import { useState, type ReactNode } from "react";
import type { Except } from "type-fest";
import type { ColorPickerProps, SwatchColorOption } from "./ColorPicker";
import { ColorPickerPopper } from "./ColorPickerPopper";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

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

export function MenuButtonColorPicker({
  value: colorValue,
  onChange,
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
