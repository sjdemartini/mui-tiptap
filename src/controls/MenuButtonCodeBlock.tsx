/// <reference types="@tiptap/extension-code-block" />
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import { CodeBlock } from "../icons";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonCodeBlockProps = Partial<MenuButtonProps>;

export default function MenuButtonCodeBlock(props: MenuButtonCodeBlockProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleCodeBlock, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleCodeBlock: editorSnapshot.can().toggleCodeBlock(),
      isActive: editorSnapshot.isActive("codeBlock"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Code block"
      tooltipShortcutKeys={["mod", "Alt", "C"]}
      IconComponent={CodeBlock}
      selected={isActive}
      disabled={!isEditable || !canToggleCodeBlock}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      {...props}
    />
  );
}
