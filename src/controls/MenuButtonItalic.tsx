/// <reference types="@tiptap/extension-italic" />
import FormatItalic from "@mui/icons-material/FormatItalic";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonItalicProps = Partial<MenuButtonProps>;

export default function MenuButtonItalic(props: MenuButtonItalicProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleItalic, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleItalic: editorSnapshot.can().toggleItalic(),
      isActive: editorSnapshot.isActive("italic"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Italic"
      tooltipShortcutKeys={["mod", "I"]}
      IconComponent={FormatItalic}
      selected={isActive}
      disabled={!isEditable || !canToggleItalic}
      onClick={() => editor.chain().focus().toggleItalic().run()}
      {...props}
    />
  );
}
