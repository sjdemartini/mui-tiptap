/// <reference types="@tiptap/extension-history" />
import RedoIcon from "@mui/icons-material/Redo";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";
import { isEditorActive } from "./isEditorActive";

export type MenuButtonRedoProps = Partial<MenuButtonProps>;

export default function MenuButtonRedo(props: MenuButtonRedoProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Redo"
      tooltipShortcutKeys={["mod", "Shift", "Z"]}
      IconComponent={RedoIcon}
      disabled={!isEditorActive(editor) || !editor.can().redo()}
      onClick={() => editor?.chain().focus().redo().run()}
      {...props}
    />
  );
}
