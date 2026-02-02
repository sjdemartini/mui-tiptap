import FormatColorFill from "@mui/icons-material/FormatColorFill";
import GridOff from "@mui/icons-material/GridOff";
import { useEditorState } from "@tiptap/react";
import MenuDivider from "../MenuDivider";
import { useRichTextEditorContext } from "../context";
import {
  DeleteColumn,
  DeleteRow,
  InsertColumnLeft,
  InsertColumnRight,
  InsertRowBottom,
  InsertRowTop,
  LayoutColumnFill,
  LayoutRowFill,
  MergeCellsHorizontal,
  SplitCellsHorizontal,
} from "../icons";
import MenuButton from "./MenuButton";
import MenuControlsContainer from "./MenuControlsContainer";

export type TableMenuControlsProps = {
  /** Class applied to the root controls container element. */
  className?: string;
  /**
   * Override the default labels for any of the menu buttons. For any value that
   * is omitted in this object, it falls back to the default content.
   */
  labels?: {
    insertColumnBefore?: string;
    insertColumnAfter?: string;
    deleteColumn?: string;
    insertRowAbove?: string;
    insertRowBelow?: string;
    deleteRow?: string;
    mergeCells?: string;
    splitCell?: string;
    toggleHeaderRow?: string;
    toggleHeaderColumn?: string;
    toggleHeaderCell?: string;
    deleteTable?: string;
  };
};

/**
 * Renders all of the controls for manipulating a table in a Tiptap editor
 * (add or delete columns or rows, merge cells, etc.).
 */
export default function TableMenuControls({
  className,
  labels,
}: TableMenuControlsProps) {
  const editor = useRichTextEditorContext();
  const {
    isEditable,
    canAddColumnBefore,
    canAddColumnAfter,
    canDeleteColumn,
    canAddRowBefore,
    canAddRowAfter,
    canDeleteRow,
    canMergeCells,
    canSplitCell,
    canToggleHeaderRow,
    canToggleHeaderColumn,
    canToggleHeaderCell,
    canDeleteTable,
    isTableHeaderActive,
  } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canAddColumnBefore: editorSnapshot.can().addColumnBefore(),
      canAddColumnAfter: editorSnapshot.can().addColumnAfter(),
      canDeleteColumn: editorSnapshot.can().deleteColumn(),
      canAddRowBefore: editorSnapshot.can().addRowBefore(),
      canAddRowAfter: editorSnapshot.can().addRowAfter(),
      canDeleteRow: editorSnapshot.can().deleteRow(),
      canMergeCells: editorSnapshot.can().mergeCells(),
      canSplitCell: editorSnapshot.can().splitCell(),
      canToggleHeaderRow: editorSnapshot.can().toggleHeaderRow(),
      canToggleHeaderColumn: editorSnapshot.can().toggleHeaderColumn(),
      canToggleHeaderCell: editorSnapshot.can().toggleHeaderCell(),
      canDeleteTable: editorSnapshot.can().deleteTable(),
      isTableHeaderActive: editorSnapshot.isActive("tableHeader"),
    }),
  });
  return (
    <MenuControlsContainer className={className}>
      <MenuButton
        tooltipLabel={labels?.insertColumnBefore ?? "Insert column before"}
        IconComponent={InsertColumnLeft}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!isEditable || !canAddColumnBefore}
      />

      <MenuButton
        tooltipLabel={labels?.insertColumnAfter ?? "Insert column after"}
        IconComponent={InsertColumnRight}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!isEditable || !canAddColumnAfter}
      />

      <MenuButton
        tooltipLabel={labels?.deleteColumn ?? "Delete column"}
        IconComponent={DeleteColumn}
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!isEditable || !canDeleteColumn}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel={labels?.insertRowAbove ?? "Insert row above"}
        IconComponent={InsertRowTop}
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!isEditable || !canAddRowBefore}
      />

      <MenuButton
        tooltipLabel={labels?.insertRowBelow ?? "Insert row below"}
        IconComponent={InsertRowBottom}
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!isEditable || !canAddRowAfter}
      />

      <MenuButton
        tooltipLabel={labels?.deleteRow ?? "Delete row"}
        IconComponent={DeleteRow}
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!isEditable || !canDeleteRow}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel={labels?.mergeCells ?? "Merge cells"}
        IconComponent={MergeCellsHorizontal}
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!isEditable || !canMergeCells}
      />

      <MenuButton
        tooltipLabel={labels?.splitCell ?? "Split cell"}
        IconComponent={SplitCellsHorizontal}
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!isEditable || !canSplitCell}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel={labels?.toggleHeaderRow ?? "Toggle header row"}
        IconComponent={LayoutRowFill}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        disabled={!isEditable || !canToggleHeaderRow}
      />

      <MenuButton
        tooltipLabel={labels?.toggleHeaderColumn ?? "Toggle header column"}
        IconComponent={LayoutColumnFill}
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        disabled={!isEditable || !canToggleHeaderColumn}
      />

      <MenuButton
        tooltipLabel={labels?.toggleHeaderCell ?? "Toggle header cell"}
        IconComponent={FormatColorFill}
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        disabled={!isEditable || !canToggleHeaderCell}
        selected={isTableHeaderActive}
      />

      <MenuDivider />

      <MenuButton
        tooltipLabel={labels?.deleteTable ?? "Delete table"}
        IconComponent={GridOff}
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!isEditable || !canDeleteTable}
      />
    </MenuControlsContainer>
  );
}
