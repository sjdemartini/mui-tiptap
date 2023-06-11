import { FormatColorFill, GridOff } from "@mui/icons-material";
import { styled } from "@mui/material";
import {
  findParentNodeClosestToPos,
  posToDOMRect,
  type Editor,
} from "@tiptap/core";
import { useMemo } from "react";
import {
  RiDeleteColumn,
  RiDeleteRow,
  RiInsertColumnLeft,
  RiInsertColumnRight,
  RiInsertRowBottom,
  RiInsertRowTop,
  RiLayoutColumnFill,
  RiLayoutRowFill,
  RiMergeCellsHorizontal,
  RiSplitCellsHorizontal,
} from "react-icons/ri";
import ControlledBubbleMenu from "./ControlledBubbleMenu";
import MenuButton from "./MenuButton";
import MenuDivider from "./MenuDivider";
import { useRichTextEditorContext } from "./context";
import { useDebouncedFocus } from "./hooks";
import debounceRender from "./utils/debounceRender";

type TableMenuBarProps = {
  editor: Editor;
};

const MenuBarContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  maxWidth: "90vw",
  padding: theme.spacing(0.5, 1),
}));

function TableMenuBar({ editor }: TableMenuBarProps) {
  return (
    <MenuBarContainer>
      <MenuButton
        tooltipLabel="Insert column before"
        IconComponent={RiInsertColumnLeft}
        value="addColumnBefore"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
      />

      <MenuButton
        tooltipLabel="Insert column after"
        IconComponent={RiInsertColumnRight}
        value="addColumnAfter"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
      />

      <MenuButton
        tooltipLabel="Delete column"
        IconComponent={RiDeleteColumn}
        value="deleteColumn"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Insert row above"
        IconComponent={RiInsertRowTop}
        value="addRowBefore"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}
      />

      <MenuButton
        tooltipLabel="Insert row below"
        IconComponent={RiInsertRowBottom}
        value="addRowAfter"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
      />

      <MenuButton
        tooltipLabel="Delete row"
        IconComponent={RiDeleteRow}
        value="deleteRow"
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Merge cells"
        IconComponent={RiMergeCellsHorizontal}
        value="mergeCells"
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
      />

      <MenuButton
        tooltipLabel="Split cell"
        IconComponent={RiSplitCellsHorizontal}
        value="splitCell"
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!editor.can().splitCell()}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Toggle header row"
        IconComponent={RiLayoutRowFill}
        value="toggleHeaderRow"
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        disabled={!editor.can().toggleHeaderRow()}
      />

      <MenuButton
        tooltipLabel="Toggle header column"
        IconComponent={RiLayoutColumnFill}
        value="toggleHeaderColumn"
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        disabled={!editor.can().toggleHeaderColumn()}
      />

      <MenuButton
        tooltipLabel="Toggle header cell"
        IconComponent={FormatColorFill}
        value="toggleHeaderCell"
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        disabled={!editor.can().toggleHeaderCell()}
        selected={editor.isActive("tableHeader")}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Delete table"
        IconComponent={GridOff}
        value="deleteTable"
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
      />
    </MenuBarContainer>
  );
}

// We use a debounced render since the menu is expensive to render (relies on
// several editor `can` commands) but needs to update per editor state change.
// Note that generally, going between editing inside or outside of a table is
// what will require the most important re-render (or potentially having the
// table resize), and that's not debounced.
const TableMenuBarDebounced = debounceRender(TableMenuBar, 170, {
  leading: true,
  trailing: true,
  maxWait: 300,
});

function TableBubbleMenuInner({ editor }: TableMenuBarProps) {
  // We want to position the table menu outside the entire table, rather than at the
  // current cursor position, so that it's essentially static even as the table changes
  // in size and doesn't "block" things within the table while you're trying to edit.

  // Because the user interactions with the table menu bar buttons unfocus the
  // editor (since it's not part of the editor content), we'll debounce our
  // visual focused state so that we keep the bubble menu open during those
  // interactions. That way we don't close it upon menu bar button click
  // immediately, which can prevent menu button callbacks from working and
  // also undesirably will close the bubble menu rather than keeping it open for
  // future menu interaction.
  const isEditorFocusedDebounced = useDebouncedFocus({ editor });

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
    () => ({
      getBoundingClientRect: () => {
        const nearestTableParent = editor.isActive("table")
          ? findParentNodeClosestToPos(
              editor.state.selection.$anchor,
              (node) => node.type.name === "table"
            )
          : null;

        if (nearestTableParent) {
          const wrapperDomNode = editor.view.nodeDOM(nearestTableParent.pos) as
            | HTMLElement
            | null
            | undefined;

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
    }),
    [editor]
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
    >
      <TableMenuBarDebounced editor={editor} />
    </ControlledBubbleMenu>
  );
}

// Wrap the inner component so that we can require the `editor` to be present,
// which simplifies that inner component's logic
export default function TableBubbleMenu() {
  const editor = useRichTextEditorContext();
  if (!editor) {
    return null;
  }
  return <TableBubbleMenuInner editor={editor} />;
}
