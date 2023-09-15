/// <reference types="@tiptap/extension-subscript" />
import Subscript from "@mui/icons-material/Subscript";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonSubscriptProps = Partial<MenuButtonProps>;

export default function MenuButtonSubscript(props: MenuButtonSubscriptProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Subscript"
      tooltipShortcutKeys={["mod", ","]}
      IconComponent={Subscript}
      selected={editor?.isActive("subscript") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleSubscript()}
      onClick={() => editor?.chain().focus().toggleSubscript().run()}
      {...props}
    />
  );
}
