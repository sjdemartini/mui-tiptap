/// <reference types="@tiptap/extension-code" />
import Code from "@mui/icons-material/Code";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";
import { isEditorActive } from "./isEditorActive";

export type MenuButtonCodeProps = Partial<MenuButtonProps>;

export default function MenuButtonCode(props: MenuButtonCodeProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Code"
      tooltipShortcutKeys={["mod", "E"]}
      IconComponent={Code}
      selected={editor?.isActive("code") ?? false}
      disabled={!isEditorActive(editor) || !editor.can().toggleCode()}
      onClick={() => editor?.chain().focus().toggleCode().run()}
      {...props}
    />
  );
}
