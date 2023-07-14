import { ToggleButton, type ToggleButtonProps } from "@mui/material";
import type { RefObject } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except, SetOptional } from "type-fest";
import MenuButtonTooltip, {
  type MenuButtonTooltipProps,
} from "./MenuButtonTooltip";

export type MenuButtonProps = {
  /**
   * The label that will be displayed in a tooltip when hovering. Also used as
   * the underlying ToggleButton `value` if a separate `value` prop is not
   * included.
   */
  tooltipLabel: MenuButtonTooltipProps["label"];
  /**
   * (Optional) An array of the keyboard shortcut keys that trigger this action
   * will be displayed in a tooltip when hovering. If empty, no keyboard
   * shortcut is displayed.
   *
   * Use the literal string "mod" to represent Cmd on Mac and Ctrl on Windows
   * and Linux.
   *
   * Example: ["mod", "Shift", "7"] is the array that should be provided as the
   * combination for toggling an ordered list.
   *
   * For the list of pre-configured Tiptap shortcuts, see
   * https://tiptap.dev/api/keyboard-shortcuts.
   */
  tooltipShortcutKeys?: MenuButtonTooltipProps["shortcutKeys"];
  /** The icon component to use for the button. Must accept a className. */
  IconComponent: React.ElementType<{ className: string }>;
  /** Attaches a `ref` to the ToggleButton's root button element. */
  buttonRef?: RefObject<HTMLButtonElement>;
} & SetOptional<Except<ToggleButtonProps, "ref">, "value">;

export const MENU_BUTTON_FONT_SIZE_DEFAULT = "1.25rem";

const useStyles = makeStyles({ name: "MenuButton" })({
  root: {
    // Use && for additional specificity, since MUI's conditional "disabled"
    // styles also set the border
    "&& .MuiToggleButton-root": {
      border: "none",
      padding: 5,
    },
  },

  menuButtonIcon: {
    fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,
  },
});

/**
 * A general-purpose base component for showing an editor control for use in a
 * menu.
 */
export default function MenuButton({
  tooltipLabel,
  tooltipShortcutKeys,
  IconComponent,
  buttonRef,
  ...toggleButtonProps
}: MenuButtonProps) {
  const { classes } = useStyles();
  return (
    <span className={classes.root}>
      <MenuButtonTooltip
        label={tooltipLabel}
        shortcutKeys={tooltipShortcutKeys}
      >
        <ToggleButton
          ref={buttonRef}
          size="small"
          value={tooltipLabel}
          {...toggleButtonProps}
        >
          <IconComponent className={classes.menuButtonIcon} />
        </ToggleButton>
      </MenuButtonTooltip>
    </span>
  );
}
