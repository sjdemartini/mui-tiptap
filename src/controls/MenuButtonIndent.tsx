import { FormatIndentIncrease } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonIndent() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Indent"
      tooltipShortcutKeys={["Tab"]}
      IconComponent={FormatIndentIncrease}
      disabled={!editor?.isEditable || !editor.can().sinkListItem("listItem")}
      onClick={() => editor?.chain().focus().sinkListItem("listItem").run()}
    />
  );
}
