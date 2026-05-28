/// <reference types="@tiptap/extension-strike" />
import StrikethroughS from "@mui/icons-material/StrikethroughS";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";
import { isEditorActive } from "./isEditorActive";

export type MenuButtonStrikethroughProps = Partial<MenuButtonProps>;

export default function MenuButtonStrikethrough(
  props: MenuButtonStrikethroughProps,
) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Strikethrough"
      tooltipShortcutKeys={["mod", "Shift", "S"]}
      IconComponent={StrikethroughS}
      selected={editor?.isActive("strike") ?? false}
      disabled={!isEditorActive(editor) || !editor.can().toggleStrike()}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
      {...props}
    />
  );
}
