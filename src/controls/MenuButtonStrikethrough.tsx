/// <reference types="@tiptap/extension-strike" />
import { StrikethroughS } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonStrikethrough() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Strikethrough"
      tooltipShortcutKeys={["mod", "Shift", "X"]}
      IconComponent={StrikethroughS}
      selected={editor?.isActive("strike") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleStrike()}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
    />
  );
}
