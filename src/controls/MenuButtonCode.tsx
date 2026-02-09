/// <reference types="@tiptap/extension-code" />
import Code from "@mui/icons-material/Code";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonCodeProps = Partial<MenuButtonProps>;

export default function MenuButtonCode(props: MenuButtonCodeProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleCode, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleCode: editorSnapshot.can().toggleCode(),
      isActive: editorSnapshot.isActive("code"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Code"
      tooltipShortcutKeys={["mod", "E"]}
      IconComponent={Code}
      selected={isActive}
      disabled={!isEditable || !canToggleCode}
      onClick={() => editor.chain().focus().toggleCode().run()}
      {...props}
    />
  );
}
