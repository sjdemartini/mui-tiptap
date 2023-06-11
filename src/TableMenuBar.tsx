import { FormatColorFill, GridOff } from "@mui/icons-material";
import { styled } from "@mui/material";
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
import MenuDivider from "./MenuDivider";
import { useRichTextEditorContext } from "./context";
import MenuButton from "./controls/MenuButton";
import debounceRender from "./utils/debounceRender";

const MenuBarContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  maxWidth: "90vw",
  padding: theme.spacing(0.5, 1),
}));

function TableMenuBarInner() {
  const editor = useRichTextEditorContext();
  return (
    <MenuBarContainer>
      <MenuButton
        tooltipLabel="Insert column before"
        IconComponent={RiInsertColumnLeft}
        onClick={() => editor?.chain().focus().addColumnBefore().run()}
        disabled={!editor?.can().addColumnBefore()}
      />

      <MenuButton
        tooltipLabel="Insert column after"
        IconComponent={RiInsertColumnRight}
        onClick={() => editor?.chain().focus().addColumnAfter().run()}
        disabled={!editor?.can().addColumnAfter()}
      />

      <MenuButton
        tooltipLabel="Delete column"
        IconComponent={RiDeleteColumn}
        onClick={() => editor?.chain().focus().deleteColumn().run()}
        disabled={!editor?.can().deleteColumn()}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Insert row above"
        IconComponent={RiInsertRowTop}
        onClick={() => editor?.chain().focus().addRowBefore().run()}
        disabled={!editor?.can().addRowBefore()}
      />

      <MenuButton
        tooltipLabel="Insert row below"
        IconComponent={RiInsertRowBottom}
        onClick={() => editor?.chain().focus().addRowAfter().run()}
        disabled={!editor?.can().addRowAfter()}
      />

      <MenuButton
        tooltipLabel="Delete row"
        IconComponent={RiDeleteRow}
        onClick={() => editor?.chain().focus().deleteRow().run()}
        disabled={!editor?.can().deleteRow()}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Merge cells"
        IconComponent={RiMergeCellsHorizontal}
        onClick={() => editor?.chain().focus().mergeCells().run()}
        disabled={!editor?.can().mergeCells()}
      />

      <MenuButton
        tooltipLabel="Split cell"
        IconComponent={RiSplitCellsHorizontal}
        onClick={() => editor?.chain().focus().splitCell().run()}
        disabled={!editor?.can().splitCell()}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Toggle header row"
        IconComponent={RiLayoutRowFill}
        onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
        disabled={!editor?.can().toggleHeaderRow()}
      />

      <MenuButton
        tooltipLabel="Toggle header column"
        IconComponent={RiLayoutColumnFill}
        onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}
        disabled={!editor?.can().toggleHeaderColumn()}
      />

      <MenuButton
        tooltipLabel="Toggle header cell"
        IconComponent={FormatColorFill}
        onClick={() => editor?.chain().focus().toggleHeaderCell().run()}
        disabled={!editor?.can().toggleHeaderCell()}
        selected={editor?.isActive("tableHeader") ?? false}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel="Delete table"
        IconComponent={GridOff}
        onClick={() => editor?.chain().focus().deleteTable().run()}
        disabled={!editor?.can().deleteTable()}
      />
    </MenuBarContainer>
  );
}

// We use a debounced render since the menu is expensive to render (relies on
// several editor `can` commands) but needs to update per editor state change.
// Note that generally, going between editing inside or outside of a table is
// what will require the most important re-render (or potentially having the
// table resize), and that's not debounced.
const TableMenuBar = debounceRender(TableMenuBarInner, 170, {
  leading: true,
  trailing: true,
  maxWait: 300,
});

export default TableMenuBar;
