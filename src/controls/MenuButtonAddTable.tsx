import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import { Table } from "../icons";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAddTableProps = Partial<MenuButtonProps>;

export default function MenuButtonAddTable(props: MenuButtonAddTableProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canInsertTable } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canInsertTable: editorSnapshot.can().insertTable(),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Insert table"
      IconComponent={Table}
      disabled={!isEditable || !canInsertTable}
      onClick={() =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
      }
      {...props}
    />
  );
}
