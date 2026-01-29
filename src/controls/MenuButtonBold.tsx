/// <reference types="@tiptap/extension-bold" />
import FormatBold from "@mui/icons-material/FormatBold";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonBoldProps = Partial<MenuButtonProps>;

export default function MenuButtonBold(props: MenuButtonBoldProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleBold, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleBold: editorSnapshot.can().toggleBold(),
      isActive: editorSnapshot.isActive("bold"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Bold"
      tooltipShortcutKeys={["mod", "B"]}
      IconComponent={FormatBold}
      selected={isActive}
      disabled={!isEditable || !canToggleBold}
      onClick={() => editor.chain().focus().toggleBold().run()}
      {...props}
    />
  );
}
