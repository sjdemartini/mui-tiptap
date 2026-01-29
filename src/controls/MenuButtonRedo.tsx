/// <reference types="@tiptap/extension-history" />
import RedoIcon from "@mui/icons-material/Redo";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonRedoProps = Partial<MenuButtonProps>;

export default function MenuButtonRedo(props: MenuButtonRedoProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canRedo } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canRedo: editorSnapshot.can().redo(),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Redo"
      tooltipShortcutKeys={["mod", "Shift", "Z"]}
      IconComponent={RedoIcon}
      disabled={!isEditable || !canRedo}
      onClick={() => editor.chain().focus().redo().run()}
      {...props}
    />
  );
}
