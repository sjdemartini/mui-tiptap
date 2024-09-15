/// <reference types="@tiptap/extension-history" />
import RedoIcon from "@mui/icons-material/Redo";
import { useRichTextEditorContext } from "../context.js";
import MenuButton, { type MenuButtonProps } from "./MenuButton.js";

export type MenuButtonRedoProps = Partial<MenuButtonProps>;

export default function MenuButtonRedo(props: MenuButtonRedoProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Redo"
      tooltipShortcutKeys={["mod", "Shift", "Z"]}
      IconComponent={RedoIcon}
      disabled={!editor?.isEditable || !editor.can().redo()}
      onClick={() => editor?.chain().focus().redo().run()}
      {...props}
    />
  );
}
