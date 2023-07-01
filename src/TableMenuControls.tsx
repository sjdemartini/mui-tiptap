import { FormatColorFill, GridOff } from "@mui/icons-material";
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
import MenuControlsContainer from "./controls/MenuControlsContainer";

type TableMenuControlsProps = {
  /** Class applied to the root controls container element. */
  className?: string;
};

/**
 * Renders all of the controls for manipulating a table in a Tiptap editor
 * (add or delete columns or rows, merge cells, etc.).
 */
export default function TableMenuControls({
  className,
}: TableMenuControlsProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuControlsContainer className={className}>
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
    </MenuControlsContainer>
  );
}
