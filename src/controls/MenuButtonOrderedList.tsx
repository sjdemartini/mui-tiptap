/// <reference types="@tiptap/extension-ordered-list" />
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonOrderedListProps = Partial<MenuButtonProps>;

export default function MenuButtonOrderedList(
  props: MenuButtonOrderedListProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleOrderedList, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleOrderedList: editorSnapshot.can().toggleOrderedList(),
      isActive: editorSnapshot.isActive("orderedList"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Ordered list"
      tooltipShortcutKeys={["mod", "Shift", "7"]}
      IconComponent={FormatListNumbered}
      selected={isActive}
      disabled={!isEditable || !canToggleOrderedList}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      {...props}
    />
  );
}
