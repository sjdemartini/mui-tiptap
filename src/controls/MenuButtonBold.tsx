/// <reference types="@tiptap/extension-bold" />
import FormatBold from "@mui/icons-material/FormatBold";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonBoldProps = Partial<MenuButtonProps>;

export default function MenuButtonBold(props: MenuButtonBoldProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Bold"
      tooltipShortcutKeys={["mod", "B"]}
      IconComponent={FormatBold}
      selected={editor?.isActive("bold") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleBold()}
      onClick={() => editor?.chain().focus().toggleBold().run()}
      {...props}
    />
  );
}
