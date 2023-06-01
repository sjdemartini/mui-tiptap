import { Fade, Paper, Popper, useTheme, type PopperProps } from "@mui/material";
import { isNodeSelection, posToDOMRect, type Editor } from "@tiptap/core";
import { useCallback } from "react";
import { makeStyles } from "tss-react/mui";
import { EDITOR_TABLE_ELEMENT_Z_INDEX } from "./styles";

interface Props {
  editor: Editor;
  open: boolean;
  children: React.ReactNode;
  /**
   * To override the anchor element to which the bubble menu is positioned, if desired.
   * By default, uses the current cursor position and selection.
   */
  anchorEl?: PopperProps["anchorEl"];
  /**
   * Whether to prefer placing the bubble element on the bottom rather than top of the
   * anchor reference area. By default false. Useful for long-standing menus like the
   * Table menu, where we want to avoid covering up the main editor menu bar above.
   *
   * This is particularly useful if the anchor reference element for which we're showing
   * a popper (e.g. a Table) is currently at the *top* of our editor and there's no
   * alternative flip that fully satisfies all constraints (like preventing overflow).
   * In that situation, it's better to place the bubble menu below the element rather
   * than above to avoid covering up the main editor menu bar.
   */
  preferBottom?: boolean;
}

const useStyles = makeStyles({ name: { ControlledBubbleMenu } })((theme) => ({
  popper: {
    // This allows the bubble menu to sit higher than the table components (like
    // the column-resize-handle and selectedCells) of the editor.
    zIndex: EDITOR_TABLE_ELEMENT_Z_INDEX + 1,
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
  children,
  anchorEl,
  preferBottom = false,
}: Props) {
  const { classes } = useStyles();
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
      placement={preferBottom ? "bottom" : "top"}
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
            fallbackPlacements: [
              preferBottom ? "top" : "bottom",
              "top-start",
              "bottom-start",
              "top-end",
              "bottom-end",
            ],
            padding: 8,
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
      className={classes.popper}
      // Put the portal children within the same DOM context as the editor. We
      // do this somewhat hackily using the parent of the editor's parent, which
      // gets us outside of any clipping containers used around the editor, like
      // when we wrap it with an <OutlinedField />. This helps ensure that if,
      // for instance, the editor appears within a modal, this bubble menu
      // appears on top of *that*. (We can't merely set a z-index, since we
      // don't want all bubble menus to appear on top of all modals; we just
      // want bubble menus from editors within modals to appear on top of their
      // modals.)
      // TODO(Steven DeMartini): Make this logic cleaner and more predictable
      container={
        editor.options.element.parentElement?.parentElement ?? undefined
      }
      transition
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
          <Paper elevation={10} className={classes.paper}>
            {children}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
