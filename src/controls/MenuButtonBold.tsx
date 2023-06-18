/// <reference types="@tiptap/extension-bold" />
import { FormatBold } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonBold() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Bold"
      tooltipShortcutKeys={["mod", "B"]}
      IconComponent={FormatBold}
      selected={editor?.isActive("bold") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleBold()}
      onClick={() => editor?.chain().focus().toggleBold().run()}
    />
  );
}
