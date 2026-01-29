/// <reference types="@tiptap/extension-text-align" />
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAlignLeftProps = Partial<MenuButtonProps>;

export default function MenuButtonAlignLeft(props: MenuButtonAlignLeftProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canSetTextAlignLeft, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canSetTextAlignLeft: editorSnapshot.can().setTextAlign("left"),
      isActive: editorSnapshot.isActive({ textAlign: "left" }),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Left align"
      tooltipShortcutKeys={["mod", "Shift", "L"]}
      IconComponent={FormatAlignLeftIcon}
      selected={isActive}
      disabled={!isEditable || !canSetTextAlignLeft}
      onClick={() => editor.chain().focus().setTextAlign("left").run()}
      {...props}
    />
  );
}
