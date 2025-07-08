/// <reference types="@tiptap/extension-superscript" />
import Superscript from "@mui/icons-material/Superscript";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonSuperscriptProps = Partial<MenuButtonProps>;

export default function MenuButtonSuperscript(
  props: MenuButtonSuperscriptProps,
) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Superscript"
      tooltipShortcutKeys={["mod", "."]}
      IconComponent={Superscript}
      selected={editor?.isActive("superscript") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleSuperscript()}
      onClick={() => editor?.chain().focus().toggleSuperscript().run()}
      {...props}
    />
  );
}
