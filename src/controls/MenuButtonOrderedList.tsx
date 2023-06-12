import { FormatListNumbered } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonOrderedList() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Ordered list"
      tooltipShortcutKeys={["mod", "Shift", "7"]}
      IconComponent={FormatListNumbered}
      selected={editor?.isActive("orderedList") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleOrderedList()}
      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
    />
  );
}
