/// <reference types="@tiptap/extension-subscript" />
import Subscript from "@mui/icons-material/Subscript";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonSubscriptProps = Partial<MenuButtonProps>;

export default function MenuButtonSubscript(props: MenuButtonSubscriptProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleSubscript, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleSubscript: editorSnapshot.can().toggleSubscript(),
      isActive: editorSnapshot.isActive("subscript"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Subscript"
      tooltipShortcutKeys={["mod", ","]}
      IconComponent={Subscript}
      selected={isActive}
      disabled={!isEditable || !canToggleSubscript}
      onClick={() => editor.chain().focus().toggleSubscript().run()}
      {...props}
    />
  );
}
