import { FormatItalic } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonItalic() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Italic"
      tooltipShortcutKeys={["mod", "I"]}
      IconComponent={FormatItalic}
      selected={editor?.isActive("italic") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleItalic()}
      onClick={() => editor?.chain().focus().toggleItalic().run()}
    />
  );
}
