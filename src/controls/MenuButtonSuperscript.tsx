/// <reference types="@tiptap/extension-superscript" />
import Superscript from "@mui/icons-material/Superscript";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonSuperscriptProps = Partial<MenuButtonProps>;

export default function MenuButtonSuperscript(
  props: MenuButtonSuperscriptProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleSuperscript, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleSuperscript: editorSnapshot.can().toggleSuperscript(),
      isActive: editorSnapshot.isActive("superscript"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Superscript"
      tooltipShortcutKeys={["mod", "."]}
      IconComponent={Superscript}
      selected={isActive}
      disabled={!isEditable || !canToggleSuperscript}
      onClick={() => editor.chain().focus().toggleSuperscript().run()}
      {...props}
    />
  );
}
