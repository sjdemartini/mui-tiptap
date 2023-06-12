import { FormatIndentDecrease } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonUnindent() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Unindent"
      tooltipShortcutKeys={["Shift", "Tab"]}
      IconComponent={FormatIndentDecrease}
      disabled={!editor?.isEditable || !editor.can().liftListItem("listItem")}
      onClick={() => editor?.chain().focus().liftListItem("listItem").run()}
    />
  );
}
