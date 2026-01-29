/// <reference types="@tiptap/extension-history" />
import UndoIcon from "@mui/icons-material/Undo";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonUndoProps = Partial<MenuButtonProps>;

export default function MenuButtonUndo(props: MenuButtonUndoProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canUndo } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canUndo: editorSnapshot.can().undo(),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Undo"
      tooltipShortcutKeys={["mod", "Z"]}
      IconComponent={UndoIcon}
      disabled={!isEditable || !canUndo}
      onClick={() => editor.chain().focus().undo().run()}
      {...props}
    />
  );
}
