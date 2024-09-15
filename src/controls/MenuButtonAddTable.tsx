import { useRichTextEditorContext } from "../context.js";
import { Table } from "../icons/index.js";
import MenuButton, { type MenuButtonProps } from "./MenuButton.js";

export type MenuButtonAddTableProps = Partial<MenuButtonProps>;

export default function MenuButtonAddTable(props: MenuButtonAddTableProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Insert table"
      IconComponent={Table}
      disabled={!editor?.isEditable || !editor.can().insertTable()}
      onClick={() =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
      }
      {...props}
    />
  );
}
