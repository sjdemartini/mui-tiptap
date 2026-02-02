/// <reference types="@tiptap/extension-underline" />
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonUnderlineProps = Partial<MenuButtonProps>;

export default function MenuButtonUnderline(props: MenuButtonUnderlineProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleUnderline, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleUnderline: editorSnapshot.can().toggleUnderline(),
      isActive: editorSnapshot.isActive("underline"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Underline"
      tooltipShortcutKeys={["mod", "U"]}
      IconComponent={FormatUnderlinedIcon}
      selected={isActive}
      disabled={!isEditable || !canToggleUnderline}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      {...props}
    />
  );
}
