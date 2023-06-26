/// <reference types="@tiptap/extension-underline" />
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonUnderlineProps = Partial<MenuButtonProps>;

export default function MenuButtonUnderline(props: MenuButtonUnderlineProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Underline"
      tooltipShortcutKeys={["mod", "U"]}
      IconComponent={FormatUnderlinedIcon}
      selected={editor?.isActive("underline") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleUnderline()}
      onClick={() => editor?.chain().focus().toggleUnderline().run()}
      {...props}
    />
  );
}
