/// <reference types="@tiptap/extension-code-block" />
import { BiCodeBlock } from "react-icons/bi";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonCodeBlockProps = Partial<MenuButtonProps>;

export default function MenuButtonCodeBlock(props: MenuButtonCodeBlockProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Code block"
      tooltipShortcutKeys={["mod", "Alt", "C"]}
      IconComponent={BiCodeBlock}
      selected={editor?.isActive("codeBlock") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleCodeBlock()}
      onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
      {...props}
    />
  );
}
