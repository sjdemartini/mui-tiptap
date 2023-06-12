import { BiTable } from "react-icons/bi";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonAddTable() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Insert table"
      IconComponent={BiTable}
      disabled={!editor?.isEditable || !editor.can().insertTable()}
      onClick={() =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
      }
    />
  );
}
