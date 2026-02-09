/// <reference types="@tiptap/extension-text-align" />
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAlignJustifyProps = Partial<MenuButtonProps>;

export default function MenuButtonAlignJustify(
  props: MenuButtonAlignJustifyProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canSetTextAlignJustify, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canSetTextAlignJustify: editorSnapshot.can().setTextAlign("justify"),
      isActive: editorSnapshot.isActive({ textAlign: "justify" }),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Justify"
      tooltipShortcutKeys={["mod", "Shift", "J"]}
      IconComponent={FormatAlignJustifyIcon}
      selected={isActive}
      disabled={!isEditable || !canSetTextAlignJustify}
      onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      {...props}
    />
  );
}
