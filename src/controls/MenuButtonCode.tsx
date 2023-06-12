import { Code } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonCode() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Code"
      tooltipShortcutKeys={["mod", "E"]}
      IconComponent={Code}
      selected={editor?.isActive("code") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleCode()}
      onClick={() => editor?.chain().focus().toggleCode().run()}
    />
  );
}
