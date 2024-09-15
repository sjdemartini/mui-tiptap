/// <reference types="@tiptap/extension-strike" />
import StrikethroughS from "@mui/icons-material/StrikethroughS";
import { useRichTextEditorContext } from "../context.js";
import MenuButton, { type MenuButtonProps } from "./MenuButton.js";

export type MenuButtonStrikethroughProps = Partial<MenuButtonProps>;

export default function MenuButtonStrikethrough(
  props: MenuButtonStrikethroughProps
) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Strikethrough"
      tooltipShortcutKeys={["mod", "Shift", "X"]}
      IconComponent={StrikethroughS}
      selected={editor?.isActive("strike") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleStrike()}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
      {...props}
    />
  );
}
