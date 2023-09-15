/// <reference types="@tiptap/extension-italic" />
import FormatItalic from "@mui/icons-material/FormatItalic";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonItalicProps = Partial<MenuButtonProps>;

export default function MenuButtonItalic(props: MenuButtonItalicProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Italic"
      tooltipShortcutKeys={["mod", "I"]}
      IconComponent={FormatItalic}
      selected={editor?.isActive("italic") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleItalic()}
      onClick={() => editor?.chain().focus().toggleItalic().run()}
      {...props}
    />
  );
}
