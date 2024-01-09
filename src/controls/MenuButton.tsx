import {
  ToggleButton,
  type ToggleButtonClasses,
  type ToggleButtonProps,
} from "@mui/material";
import type { ReactNode, RefObject } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except, SetOptional } from "type-fest";
import MenuButtonTooltip, {
  type MenuButtonTooltipProps,
} from "./MenuButtonTooltip";

export interface MenuButtonProps
  extends SetOptional<
    Except<ToggleButtonProps, "ref" | "children" | "classes">,
    "value"
  > {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ToggleButtonClasses> & {
    toggleButton?: string;
  };
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
  /**
   * The icon component to use for the button, rendered as button `children` if
   * provided. Must accept a className.
   */
  IconComponent?: React.ElementType<{ className: string }>;
  /**
   * Override the default button content instead of displaying the
   * <IconComponent />.
   */
  children?: ReactNode;
  /** Attaches a `ref` to the ToggleButton's root button element. */
  buttonRef?: RefObject<HTMLButtonElement>;
}

export const MENU_BUTTON_FONT_SIZE_DEFAULT = "1.25rem";

const useStyles = makeStyles({ name: { MenuButton } })({
  root: {},

  toggleButton: {
    border: "none",
    padding: 5,

    "&.Mui-disabled": {
      border: "none",
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
  className,
  classes: overrideClasses,
  tooltipLabel,
  tooltipShortcutKeys,
  IconComponent,
  buttonRef,
  children,
  ...toggleButtonProps
}: MenuButtonProps) {
  const { classes, cx } = useStyles();
  return (
    <span className={cx(classes.root, className)}>
      <MenuButtonTooltip
        label={tooltipLabel}
        shortcutKeys={tooltipShortcutKeys}
      >
        <ToggleButton
          className={cx(classes.toggleButton, overrideClasses?.toggleButton)}
          classes={overrideClasses}
          ref={buttonRef}
          size="small"
          value={tooltipLabel}
          {...toggleButtonProps}
        >
          {children ??
            (IconComponent && (
              <IconComponent className={classes.menuButtonIcon} />
            ))}
        </ToggleButton>
      </MenuButtonTooltip>
    </span>
  );
}
