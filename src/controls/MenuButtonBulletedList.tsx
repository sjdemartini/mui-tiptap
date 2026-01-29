/// <reference types="@tiptap/extension-bullet-list" />
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonBulletedListProps = Partial<MenuButtonProps>;

export default function MenuButtonBulletedList(
  props: MenuButtonBulletedListProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleBulletList, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleBulletList: editorSnapshot.can().toggleBulletList(),
      isActive: editorSnapshot.isActive("bulletList"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Bulleted list"
      tooltipShortcutKeys={["mod", "Shift", "8"]}
      IconComponent={FormatListBulleted}
      selected={isActive}
      disabled={!isEditable || !canToggleBulletList}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      {...props}
    />
  );
}
