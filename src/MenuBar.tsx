import Collapse, { type CollapseProps } from "@mui/material/Collapse";
import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import {
  menuBarClasses,
  type MenuBarClassKey,
  type MenuBarClasses,
} from "./MenuBar.classes";
import { Z_INDEXES, getUtilityComponentName } from "./styles";

export type MenuBarProps = Omit<
  CollapseProps,
  "children" | "in" | "className" | "classes"
> & {
  /**
   * Whether to hide the menu bar. When changing between false/true, uses the
   * collapse animation. By default false
   */
  hide?: boolean;
  /**
   * If true, the menu bar will not "stick" above the editor content on the
   * page as you scroll down past where it normally sits.
   */
  disableSticky?: boolean;
  /**
   * The menu bar's sticky `top` offset, when `disableSticky=false`.
   *
   * Useful if there's other fixed/sticky content above the editor (like an app
   * navigation toolbar). By default 0.
   */
  stickyOffset?: number;
  /**
   * Whether to unmount the menu bar when it's hidden. Unlike ordinary MUI
   * `Collapse` behavior, this is by default true for performance reasons, to
   * avoid rendering the menu bar unless it's needed/shown
   */
  unmountOnExit?: boolean;
  /** The set of controls (buttons, etc) to include in the menu bar. */
  children?: ReactNode;
  /** Class applied to the outermost `root` element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<MenuBarClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
};

interface MenuBarOwnerState
  extends Pick<
    MenuBarProps,
    "hide" | "disableSticky" | "stickyOffset" | "unmountOnExit"
  > {
  stickyOffset: NonNullable<MenuBarProps["stickyOffset"]>;
}

const componentName = getUtilityComponentName("MenuBar");

const MenuBarRoot = styled(Collapse, {
  name: componentName,
  slot: "root" satisfies MenuBarClassKey,
  overridesResolver: (props: { ownerState: MenuBarOwnerState }, styles) => [
    styles.root,
    props.ownerState.disableSticky ? styles.nonSticky : styles.sticky,
  ],
})<{ ownerState: MenuBarOwnerState }>(({ theme, ownerState }) => ({
  borderBottomColor: theme.palette.divider,
  borderBottomStyle: "solid",
  borderBottomWidth: 1,

  ...(ownerState.disableSticky
    ? {}
    : {
        position: "sticky",
        top: ownerState.stickyOffset,
        zIndex: Z_INDEXES.MENU_BAR,
        background: theme.palette.background.default,
      }),
}));

const MenuBarContent = styled("div", {
  name: componentName,
  slot: "content" satisfies MenuBarClassKey,
  overridesResolver: (props, styles) => styles.content,
})<{ ownerState: MenuBarOwnerState }>({});

/**
 * A collapsible, optionally-sticky container for showing editor controls atop
 * the editor content.
 */
export default function MenuBar(inProps: MenuBarProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    hide,
    disableSticky,
    stickyOffset = 0,
    children,
    className,
    classes = {},
    unmountOnExit = true,
    sx,
    ...collapseProps
  } = props;

  const ownerState: MenuBarOwnerState = {
    hide,
    disableSticky,
    stickyOffset,
    unmountOnExit,
  };

  return (
    <MenuBarRoot
      {...collapseProps}
      in={!hide}
      unmountOnExit={unmountOnExit}
      // Note that we have to apply the sticky CSS classes to the container
      // (rather than the menu bar itself) in order for it to behave
      // properly
      className={clsx([
        menuBarClasses.root,
        classes.root,
        disableSticky
          ? [menuBarClasses.nonSticky, classes.nonSticky]
          : [menuBarClasses.sticky, classes.sticky],
        className,
      ])}
      ownerState={ownerState}
      sx={sx}
    >
      <MenuBarContent
        className={clsx([menuBarClasses.content, classes.content])}
        ownerState={ownerState}
      >
        {children}
      </MenuBarContent>
    </MenuBarRoot>
  );
}
