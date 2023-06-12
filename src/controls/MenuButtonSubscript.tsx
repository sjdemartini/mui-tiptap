import { Subscript } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonSubscript() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Subscript"
      tooltipShortcutKeys={["mod", ","]}
      IconComponent={Subscript}
      selected={editor?.isActive("subscript") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleSubscript()}
      onClick={() => editor?.chain().focus().toggleSubscript().run()}
    />
  );
}
