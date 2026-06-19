/// <reference types="@tiptap/extension-text-align" />
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";
import { isEditorActive } from "./isEditorActive";

export type MenuButtonAlignJustifyProps = Partial<MenuButtonProps>;

export default function MenuButtonAlignJustify(
  props: MenuButtonAlignJustifyProps,
) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Justify"
      tooltipShortcutKeys={["mod", "Shift", "J"]}
      IconComponent={FormatAlignJustifyIcon}
      selected={editor?.isActive({ textAlign: "justify" }) ?? false}
      disabled={
        !isEditorActive(editor) || !editor.can().setTextAlign("justify")
      }
      onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
      {...props}
    />
  );
}
