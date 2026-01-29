/// <reference types="@tiptap/extension-strike" />
import StrikethroughS from "@mui/icons-material/StrikethroughS";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonStrikethroughProps = Partial<MenuButtonProps>;

export default function MenuButtonStrikethrough(
  props: MenuButtonStrikethroughProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleStrike, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleStrike: editorSnapshot.can().toggleStrike(),
      isActive: editorSnapshot.isActive("strike"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Strikethrough"
      tooltipShortcutKeys={["mod", "Shift", "S"]}
      IconComponent={StrikethroughS}
      selected={isActive}
      disabled={!isEditable || !canToggleStrike}
      onClick={() => editor.chain().focus().toggleStrike().run()}
      {...props}
    />
  );
}
