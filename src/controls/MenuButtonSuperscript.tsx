/// <reference types="@tiptap/extension-superscript" />
import { Superscript } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonSuperscript() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Superscript"
      tooltipShortcutKeys={["mod", "."]}
      IconComponent={Superscript}
      selected={editor?.isActive("superscript") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleSuperscript()}
      onClick={() => editor?.chain().focus().toggleSuperscript().run()}
    />
  );
}
