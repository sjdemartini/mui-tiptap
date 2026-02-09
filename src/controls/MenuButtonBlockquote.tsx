/// <reference types="@tiptap/extension-blockquote" />
import FormatQuote from "@mui/icons-material/FormatQuote";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonBlockquoteProps = Partial<MenuButtonProps>;

export default function MenuButtonBlockquote(props: MenuButtonBlockquoteProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleBlockquote, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleBlockquote: editorSnapshot.can().toggleBlockquote(),
      isActive: editorSnapshot.isActive("blockquote"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Blockquote"
      tooltipShortcutKeys={["mod", "Shift", "B"]}
      IconComponent={FormatQuote}
      selected={isActive}
      disabled={!isEditable || !canToggleBlockquote}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      {...props}
    />
  );
}
