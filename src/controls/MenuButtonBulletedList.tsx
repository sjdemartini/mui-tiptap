import { FormatListBulleted } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonBulletedList() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Bulleted list"
      tooltipShortcutKeys={["mod", "Shift", "8"]}
      IconComponent={FormatListBulleted}
      selected={editor?.isActive("bulletList") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleBulletList()}
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
    />
  );
}
