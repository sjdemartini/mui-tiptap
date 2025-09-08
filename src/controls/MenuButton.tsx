import ToggleButton, {
  toggleButtonClasses,
  type ToggleButtonProps,
} from "@mui/material/ToggleButton";
import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import { clsx } from "clsx";
import type { ReactNode, RefObject } from "react";
import type { Except, SetOptional } from "type-fest";
import { getUtilityComponentName } from "../styles";
import {
  menuButtonClasses,
  type MenuButtonClassKey,
  type MenuButtonClasses,
} from "./MenuButton.classes";
import MenuButtonTooltip, {
  type MenuButtonTooltipProps,
} from "./MenuButtonTooltip";

export interface MenuButtonProps
  extends SetOptional<
    Except<ToggleButtonProps, "ref" | "children" | "className" | "classes">,
    "value"
  > {
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
  /** Optional additional className to provide to the root element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<MenuButtonClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
}

export const MENU_BUTTON_FONT_SIZE_DEFAULT = "1.25rem";

const componentName = getUtilityComponentName("MenuButton");

const MenuButtonRoot = styled("span", {
  name: componentName,
  slot: "root" satisfies MenuButtonClassKey,
  overridesResolver: (props, styles) => styles.root,
})(() => ({
  // Use && for additional specificity, since MUI's conditional "disabled"
  // styles also set the border
  [`&& .${toggleButtonClasses.root}`]: {
    border: "none",
    padding: 5,
  },
}));

// We can use an arbitrary component here ("span"), since we use `as` below with
// the `IconComponent` prop.
const MenuButtonIcon = styled("span", {
  name: componentName,
  slot: "icon" satisfies MenuButtonClassKey,
  overridesResolver: (props, styles) => styles.icon,
})(() => ({
  fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,
}));

/**
 * A general-purpose base component for showing an editor control for use in a
 * menu.
 */
export default function MenuButton(inProps: MenuButtonProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    tooltipLabel,
    tooltipShortcutKeys,
    IconComponent,
    buttonRef,
    children,
    className,
    classes = {},
    sx,
    ...toggleButtonProps
  } = props;

  return (
    <MenuButtonRoot
      className={clsx([menuButtonClasses.root, className, classes.root])}
      sx={sx}
    >
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
          {children ??
            (IconComponent && (
              <MenuButtonIcon
                as={IconComponent}
                className={clsx([menuButtonClasses.icon, classes.icon])}
              />
            ))}
        </ToggleButton>
      </MenuButtonTooltip>
    </MenuButtonRoot>
  );
}
