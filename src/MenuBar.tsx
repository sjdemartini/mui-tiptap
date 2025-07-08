import { Collapse, type CollapseProps } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { Z_INDEXES, getUtilityClasses } from "./styles";

export type MenuBarClasses = ReturnType<typeof useStyles>["classes"];

export type MenuBarProps = Except<CollapseProps, "children" | "in"> & {
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
  children?: React.ReactNode;
  /** Class applied to the outermost `root` element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<MenuBarClasses>;
};

const menuBarClasses: MenuBarClasses = getUtilityClasses("MenuBar", [
  "root",
  "sticky",
  "nonSticky",
  "content",
]);

const useStyles = makeStyles<{ stickyOffset?: number }>({
  name: { MenuBar },
})((theme, { stickyOffset }) => {
  return {
    root: {
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
    },

    sticky: {
      position: "sticky",
      top: stickyOffset ?? 0,
      zIndex: Z_INDEXES.MENU_BAR,
      background: theme.palette.background.default,
    },

    nonSticky: {},

    content: {},
  };
});

/**
 * A collapsible, optionally-sticky container for showing editor controls atop
 * the editor content.
 */
export default function MenuBar({
  hide,
  disableSticky,
  stickyOffset,
  children,
  className,
  classes: overrideClasses,
  unmountOnExit = true,
  ...collapseProps
}: MenuBarProps) {
  const { classes, cx } = useStyles(
    { stickyOffset },
    {
      props: { classes: overrideClasses },
    },
  );
  return (
    <Collapse
      {...collapseProps}
      in={!hide}
      unmountOnExit={unmountOnExit}
      // Note that we have to apply the sticky CSS classes to the container
      // (rather than the menu bar itself) in order for it to behave
      // properly
      className={cx(
        menuBarClasses.root,
        classes.root,
        disableSticky
          ? [menuBarClasses.nonSticky, classes.nonSticky]
          : [menuBarClasses.sticky, classes.sticky],
        className,
      )}
    >
      <div className={classes.content}>{children}</div>
    </Collapse>
  );
}
