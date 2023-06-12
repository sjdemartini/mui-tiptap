import { FormatClear } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonRemoveFormatting() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Remove inline formatting"
      IconComponent={FormatClear}
      disabled={!editor?.isEditable || !editor.can().unsetAllMarks()}
      onClick={() => editor?.chain().focus().unsetAllMarks().run()}
    />
  );
}
