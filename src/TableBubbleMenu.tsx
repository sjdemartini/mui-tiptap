import { findParentNodeClosestToPos, posToDOMRect } from "@tiptap/core";
import { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import ControlledBubbleMenu, {
  type ControlledBubbleMenuProps,
} from "./ControlledBubbleMenu";
import { useRichTextEditorContext } from "./context";
import TableMenuControls, {
  type TableMenuControlsProps,
} from "./controls/TableMenuControls";
import { useDebouncedFocus } from "./hooks";
import DebounceRender, {
  type DebounceRenderProps,
} from "./utils/DebounceRender";

export type TableBubbleMenuProps = {
  /**
   * If true, the rendering of the table controls will not be debounced. If not
   * debounced, then upon every editor interaction (caret movement, character
   * typed, etc.), the entire content will re-render, which tends to be
   * expensive and can bog down the editor performance, so debouncing is
   * generally recommended. By default false.
   */
  disableDebounce?: boolean;
  /**
   * Override the props/options used with debounce rendering such as the wait
   * interval, if `disableDebounce` is not true.
   */
  DebounceProps?: Except<DebounceRenderProps, "children">;
  /**
   * Override the default labels for any of the menu buttons. If any is omitted,
   * it falls back to the default mui-tiptap label for that label.
   */
  labels?: TableMenuControlsProps["labels"];
} & Partial<Except<ControlledBubbleMenuProps, "open" | "editor" | "children">>;

const useStyles = makeStyles({
  name: { TableBubbleMenu },
})((theme) => ({
  controls: {
    maxWidth: "90vw",
    padding: theme.spacing(0.5, 1),
  },
}));

/**
 * Renders a bubble menu to manipulate the contents of a Table (add or delete
 * columns or rows, merge cells, etc.), when the user's caret/selection is
 * inside a Table.
 *
 * For use with mui-tiptap's `TableImproved` extension or Tiptap's
 * `@tiptap/extension-table` extension.
 *
 * If you're using `RichTextEditor`, include this component via
 * `RichTextEditor`’s `children` render-prop. Otherwise, include the
 * `TableBubbleMenu` as a child of the component where you call `useEditor` and
 * render your `RichTextField` or `RichTextContent`. (The bubble menu itself
 * will be positioned appropriately no matter where you put it in your React
 * tree, as long as it is re-rendered whenever the Tiptap `editor` forces an
 * update, which will happen if it's a child of the component using
 * `useEditor`).
 */
export default function TableBubbleMenu({
  disableDebounce = false,
  DebounceProps,
  labels,
  ...controlledBubbleMenuProps
}: TableBubbleMenuProps) {
  const editor = useRichTextEditorContext();
  const { classes } = useStyles();

  // Because the user interactions with the table menu bar buttons unfocus the
  // editor (since it's not part of the editor content), we'll debounce our
  // visual focused state so that we keep the bubble menu open during those
  // interactions. That way we don't close it upon menu bar button click
  // immediately, which can prevent menu button callbacks from working and
  // also undesirably will close the bubble menu rather than keeping it open for
  // future menu interaction.
  const isEditorFocusedDebounced = useDebouncedFocus({ editor });

  // We want to position the table menu outside the entire table, rather than at the
  // current cursor position, so that it's essentially static even as the table changes
  // in size and doesn't "block" things within the table while you're trying to edit.

  // NOTE: Popper accepts an `anchorEl` prop as an HTML element, virtualElement
  // (https://popper.js.org/docs/v2/virtual-elements/), or a function that returns
  // either. However, if you use a function that return an element, Popper will *not*
  // re-evaluate which element that is except when the function itself changes, or when
  // the Popper `open` state changes
  // (https://github.com/mui/material-ui/blob/5b2583a1c8b227661c4bf4113a79346634ea53af/packages/mui-base/src/PopperUnstyled/PopperUnstyled.tsx#L126-L130).
  // As such, we need to return a virtualElement (object with `getBoundingClientRect`)
  // and *not* return an HTML element, since we don't want it to get cached. Otherwise
  // clicking from one table to another will incorrectly get the bubble menu "stuck" on
  // the table that was first used to position the Popper.
  const bubbleMenuAnchorEl = useMemo(
    () =>
      editor
        ? {
            getBoundingClientRect: () => {
              const nearestTableParent = editor.isActive("table")
                ? findParentNodeClosestToPos(
                    editor.state.selection.$anchor,
                    (node) => node.type.name === "table",
                  )
                : null;

              if (nearestTableParent) {
                const wrapperDomNode = editor.view.nodeDOM(
                  nearestTableParent.pos,
                ) as HTMLElement | null | undefined;

                // The DOM node of a Tiptap table node is a div wrapper, which contains a `table` child.
                // The div wrapper is a block element that fills the entire row, but the table may not be
                // full width, so we want to get our bounding rectangle based on the `table` (to align it
                // with the table itself), not the div. See
                // https://github.com/ueberdosis/tiptap/blob/40a9404c94c7fef7900610c195536384781ae101/packages/extension-table/src/TableView.ts#L69-L71
                const tableDomNode = wrapperDomNode?.querySelector("table");
                if (tableDomNode) {
                  return tableDomNode.getBoundingClientRect();
                }
              }

              // Since we weren't able to find a table from the current user position, that means the user
              // hasn't put their cursor in a table. We'll be hiding the table in this case, but we need
              // to return a bounding rect regardless (can't return `null`), so we use the standard logic
              // based on the current cursor position/selection instead.
              const { ranges } = editor.state.selection;
              const from = Math.min(...ranges.map((range) => range.$from.pos));
              const to = Math.max(...ranges.map((range) => range.$to.pos));
              return posToDOMRect(editor.view, from, to);
            },
          }
        : null,
    [editor],
  );

  if (!editor?.isEditable) {
    return null;
  }

  const controls = (
    <TableMenuControls className={classes.controls} labels={labels} />
  );

  return (
    <ControlledBubbleMenu
      editor={editor}
      open={isEditorFocusedDebounced && editor.isActive("table")}
      anchorEl={bubbleMenuAnchorEl}
      // So the menu doesn't move as columns are added, removed, or resized, we
      // prefer "foo-start" rather than the centered "foo" placement. Similarly,
      // we prefer "top" to "bottom" so that the menu doesn't move as the number
      // and size of rows changes.
      placement="top-start"
      fallbackPlacements={[
        "bottom-start",
        "top",
        "bottom",
        "top-end",
        "bottom-end",
      ]}
      // Though we prefer for the menu to stay on top if there's room, we
      // definitely do not want the table bubble menu to cover up the main
      // editor menu bar, which is typically going to be above the editor, since
      // users are likely to want to change styles of elements within a table
      // while using/editing a table. This overlap could happen if the Table is
      // the first element within the editor content, or if the content is long
      // and the menu bar is sticky, with the user having scrolled such that a
      // table is at the top of the page. What would be nice is if PopperJS let
      // you specify a placement to use if the `placement` *and none of the
      // fallbacks* are satisfied, so that we could default to "bottom-start" in
      // that scenario rather than the main `placement` value of "top-start".
      // Since that is not an option, we add an artificial infinite negative
      // bottom padding (so that it's like we actually have infinite extra room
      // below our table bubble menu within the editor) as a way to ensure we
      // only fall back to bottom placements if the top has no room. Similarly
      // we add a top padding equal to what should give us enough room to avoid
      // overlapping the main menu bar.
      flipPadding={{ top: 35, left: 8, right: 8, bottom: -Infinity }}
      {...controlledBubbleMenuProps}
    >
      {/* We debounce rendering of the controls to improve performance, since
      otherwise it will be expensive to re-render (since it relies on several
      editor `can` commands, and would otherwise be updating upon every editor
      interaction like caret movement and typing). See DebounceRender.tsx for
      more notes on this rationale and approach. */}
      {disableDebounce ? (
        controls
      ) : (
        <DebounceRender {...DebounceProps}>{controls}</DebounceRender>
      )}
    </ControlledBubbleMenu>
  );
}
