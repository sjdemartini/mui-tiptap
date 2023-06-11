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

function TableBubbleMenuInner({ editor }: TableMenuBarProps) {
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
      open={editor.isFocused && editor.isActive("table")}
      anchorEl={bubbleMenuAnchorEl}
      preferBottom
    >
      <TableMenuBar editor={editor} />
    </ControlledBubbleMenu>
  );
}

// Wrap the inner component so that we can require the `editor` to be present
function TableBubbleMenuWrapped() {
  const editor = useRichTextEditorContext();
  if (!editor) {
    return null;
  }
  return <TableBubbleMenuInner editor={editor} />;
}

// We use a debounced render since the menu is expensive to render but needs to update
// per editor state change. We use a longer debounce duration than for MenuBar,
// since this component is more expensive, and it has less internal state that needs
// frequent updating (vs the MenuBar which shows lots of different active/inactive
// options). Generally, going between editing inside or outside of a table is what will
// require the most important re-render (or potentially having the table resize), and
// that's relatively rarer than typing within or outside a table.
const TableBubbleMenu = debounceRender(TableBubbleMenuWrapped, 400, {
  leading: true,
  trailing: true,
  maxWait: 750,
});

export default TableBubbleMenu;
