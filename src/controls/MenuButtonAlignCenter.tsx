/// <reference types="@tiptap/extension-text-align" />
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAlignCenterProps = Partial<MenuButtonProps>;

export default function MenuButtonAlignCenter(
  props: MenuButtonAlignCenterProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canSetTextAlignCenter, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canSetTextAlignCenter: editorSnapshot.can().setTextAlign("center"),
      isActive: editorSnapshot.isActive({ textAlign: "center" }),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Center align"
      tooltipShortcutKeys={["mod", "Shift", "E"]}
      IconComponent={FormatAlignCenterIcon}
      selected={isActive}
      disabled={!isEditable || !canSetTextAlignCenter}
      onClick={() => editor.chain().focus().setTextAlign("center").run()}
      {...props}
    />
  );
}
