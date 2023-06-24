/// <reference types="@tiptap/extension-history" />
import UndoIcon from "@mui/icons-material/Undo";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonUndoProps = Partial<MenuButtonProps>;

export default function MenuButtonUndo(props: MenuButtonUndoProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Undo"
      tooltipShortcutKeys={["mod", "Z"]}
      IconComponent={UndoIcon}
      disabled={!editor?.isEditable || !editor.can().undo()}
      onClick={() => editor?.chain().focus().undo().run()}
      {...props}
    />
  );
}
