/// <reference types="@tiptap/extension-blockquote" />
import { FormatQuote } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonBlockquote() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Blockquote"
      tooltipShortcutKeys={["mod", "Shift", "B"]}
      IconComponent={FormatQuote}
      selected={editor?.isActive("blockquote") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleBlockquote()}
      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
    />
  );
}
