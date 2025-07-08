import {
  Fade,
  Paper,
  Popper,
  useTheme,
  type PaperProps,
  type PopperProps,
} from "@mui/material";
import { isNodeSelection, posToDOMRect, type Editor } from "@tiptap/core";
import { useCallback } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { getUtilityClasses } from "./styles";

export type ControlledBubbleMenuClasses = ReturnType<
  typeof useStyles
>["classes"];

export type ControlledBubbleMenuProps = Except<
  PopperProps,
  | "children"
  | "transition"
  | "open"
  | "anchorEl"
  | "container"
  | "disablePortal"
  | "placement"
> & {
  /** The editor instance. */
  editor: Editor;
  /** Whether the bubble menu is open. */
  open: PopperProps["open"];
  /** The content of the bubble menu. */
  children: React.ReactNode;
  /**
   * To override the anchor element to which the bubble menu is positioned.
   * By default, uses the current cursor position and selection.
   */
  anchorEl?: PopperProps["anchorEl"];
  /**
   * To override the HTML element into which the bubble menu Popper portal
   * children (DOM content) are appended. Uses MUI's Popper default if not
   * provided (the body of the top-level document object).
   *
   * Can be useful to override with a reference to a modal/dialog's element
   * (like the `ref` of a MUI <Dialog />), for instance, so that this bubble
   * menu can still appear on top of that, without needing to use messy z-index
   * overrides.
   *
   * Example:
   *
   * <Dialog open={open} ref={dialogRef}>
   *   <RichTextEditor ...>
   *     {() => (
   *       <>
   *         <MyControlledBubbleMenu container={dialogRef.current} />
   *         <LinkBubbleMenu container={dialogRef.current} />
   *         <TableBubbleMenu container={dialogRef.current} />
   *       </>
   *     )}
   *   </RichTextEditor>
   * </Dialog>
   */
  container?: PopperProps["container"];
  /**
   * If true, the `children` will be under the DOM hierarchy of the parent
   * component of the ControlledBubbleMenu.
   */
  disablePortal?: PopperProps["disablePortal"];
  /**
   * The placement to use for this bubble menu. By default "top". See
   * https://popper.js.org/docs/v2/constructors/#options (and
   * https://mui.com/material-ui/api/popper/).
   */
  placement?: PopperProps["placement"];
  /**
   * Alternate consecutive placements to try if the first placement does not
   * fit. By default tries other bottom and top placements (avoiding sides,
   * since the editor caret will tend to move horizontally as a user
   * types/interacts).
   */
  fallbackPlacements?: PopperProps["placement"][];
  /**
   * Applies virtual padding to the element when testing whether to flip the
   * placement. (i.e. if the element had the additional padding, would it exceed
   * its boundary and so need to be flipped?) See
   * https://popper.js.org/docs/v2/modifiers/flip/#padding and
   * https://popper.js.org/docs/v2/utils/detect-overflow/#padding. By default
   * 8px on all sides.
   */
  flipPadding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  /** Class applied to the root Popper element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<ControlledBubbleMenuClasses>;
  /**
   * Override the default props for the Paper containing the bubble menu
   * content.
   */
  PaperProps?: Partial<PaperProps>;
};

const controlledBubbleMenuClasses: ControlledBubbleMenuClasses =
  getUtilityClasses("ControlledBubbleMenu", ["root", "paper"]);

const useStyles = makeStyles({ name: { ControlledBubbleMenu } })((theme) => ({
  root: {
    // Ensure the bubble menu is above modals, in case the editor is rendered in
    // a modal, consistent with recommendations here
    // https://github.com/mui/material-ui/issues/14216. See
    // https://github.com/sjdemartini/mui-tiptap/issues/265.
    zIndex: theme.zIndex.tooltip,
  },

  paper: {
    backgroundColor: theme.palette.background.default,
  },
}));

// The `BubbleMenu` React component provided by Tiptap in @tiptap/react and the
// underlying BubbleMenuPlugin don't work very well in practice. There are two
// primary problems:
// 1) BubbleMenu places its tippy DOM element *within* the editor DOM structure,
//    so it can get clipped by the edges of the editor, especially noticeable
//    when there is no content in the editor yet (so it'll get sliced off at the
//    top of the editor). It's not possible to use a React Portal there as a
//    workaround due to the way in which the element is dynamically
//    created/destroyed via tippy inside Tiptap, preventing interactivity (see
//    https://github.com/ueberdosis/tiptap/issues/2292).
// 2) The BubbleMenu visibility cannot be controlled programmatically. Its
//    `shouldShow` callback only runs when editor internal state changes, so we
//    can't control it beyond that without wacky hacks. See the issue here
//    https://github.com/ueberdosis/tiptap/issues/2305.
//
// This alternative component has a simpler API, with just an `open` flag, which
// properly responds to all changes in React props, and it uses MUI's Popper
// rather than relying on tippy, so we inherently get "Portal" behavior and
// don't have to worry about visual clipping.
export default function ControlledBubbleMenu({
  editor,
  open,
  className,
  classes: overrideClasses = {},
  sx,
  children,
  anchorEl,
  container,
  disablePortal,
  placement = "top",
  fallbackPlacements = [
    "top",
    "bottom",
    "top-start",
    "bottom-start",
    "top-end",
    "bottom-end",
  ],
  flipPadding = 8,
  PaperProps,
  ...popperProps
}: ControlledBubbleMenuProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });
  const theme = useTheme();

  const defaultAnchorEl = useCallback(() => {
    // The logic here is taken from the positioning implementation in Tiptap's BubbleMenuPlugin
    // https://github.com/ueberdosis/tiptap/blob/16bec4e9d0c99feded855b261edb6e0d3f0bad21/packages/extension-bubble-menu/src/bubble-menu-plugin.ts#L183-L193
    const { ranges } = editor.state.selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    return {
      getBoundingClientRect: () => {
        if (isNodeSelection(editor.state.selection)) {
          const node = editor.view.nodeDOM(from);

          if (node instanceof HTMLElement) {
            return node.getBoundingClientRect();
          }
        }

        return posToDOMRect(editor.view, from, to);
      },
    };
  }, [editor]);

  return (
    <Popper
      open={open}
      placement={placement}
      modifiers={[
        {
          name: "offset",
          options: {
            // Add a slight vertical offset for the popper from the current selection
            offset: [0, 6],
          },
        },
        {
          name: "flip",
          enabled: true,
          options: {
            // We'll reposition (to one of the below fallback placements) whenever our Popper goes
            // outside of the editor. (This is necessary since our children aren't actually rendered
            // here, but instead with a portal, so the editor DOM node isn't a parent.)
            boundary: editor.options.element,
            fallbackPlacements: fallbackPlacements,
            padding: flipPadding,
          },
        },
        {
          // Don't allow the bubble menu to overflow outside of the its clipping parents
          // or viewport
          name: "preventOverflow",
          enabled: true,
          options: {
            // Check for overflow in the y-axis direction instead of x-axis direction
            // (the default for top and bottom placements), since that's likely to be
            // the more problematic direction when scrolling. (Theoretically it would be
            // nice to have it check all axes which seemingly could be done with
            // `mainAxis: false`, but for an element that is wide and tall, this ends up
            // not placing the Popper in a visible location, so the behavior of
            // `altAxis: true` seems preferable.)
            altAxis: true,
            boundary: "clippingParents",
            padding: 8,
          },
        },

        // If we want to add an arrow to the Popper, we'll seemingly need to implement a lot
        // of custom styling and whatnot, like in
        // https://github.com/mui-org/material-ui/blob/84671ab1d6db4f6901d60206f2375bd51862c66e/docs/src/pages/components/popper/ScrollPlayground.js#L19-L103,
        // which is probably not worth it
      ]}
      anchorEl={anchorEl ?? defaultAnchorEl}
      className={cx(controlledBubbleMenuClasses.root, classes.root, className)}
      sx={sx}
      container={container}
      disablePortal={disablePortal}
      transition
      {...popperProps}
    >
      {({ TransitionProps }) => (
        <Fade
          {...TransitionProps}
          timeout={{
            enter: theme.transitions.duration.enteringScreen,
            // Exit immediately rather than using a transition, since the
            // content of the bubble menu will usually be updating as the editor
            // content and thus `open` state changes, and we don't want it to
            // "flash" with incorrect content during the transition
            exit: 0,
          }}
        >
          <Paper
            elevation={7}
            {...PaperProps}
            className={cx(
              controlledBubbleMenuClasses.paper,
              classes.paper,
              PaperProps?.className,
            )}
          >
            {children}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
