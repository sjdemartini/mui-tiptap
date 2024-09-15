/// <reference types="@tiptap/extension-code-block" />
import { useRichTextEditorContext } from "../context.js";
import { CodeBlock } from "../icons/index.js";
import MenuButton, { type MenuButtonProps } from "./MenuButton.js";

export type MenuButtonCodeBlockProps = Partial<MenuButtonProps>;

export default function MenuButtonCodeBlock(props: MenuButtonCodeBlockProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Code block"
      tooltipShortcutKeys={["mod", "Alt", "C"]}
      IconComponent={CodeBlock}
      selected={editor?.isActive("codeBlock") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleCodeBlock()}
      onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
      {...props}
    />
  );
}
