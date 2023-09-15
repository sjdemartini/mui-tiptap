/// <reference types="@tiptap/extension-blockquote" />
import FormatQuote from "@mui/icons-material/FormatQuote";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonBlockquoteProps = Partial<MenuButtonProps>;

export default function MenuButtonBlockquote(props: MenuButtonBlockquoteProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Blockquote"
      tooltipShortcutKeys={["mod", "Shift", "B"]}
      IconComponent={FormatQuote}
      selected={editor?.isActive("blockquote") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleBlockquote()}
      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      {...props}
    />
  );
}
