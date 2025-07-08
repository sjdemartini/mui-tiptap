/// <reference types="@tiptap/extension-ordered-list" />
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonOrderedListProps = Partial<MenuButtonProps>;

export default function MenuButtonOrderedList(
  props: MenuButtonOrderedListProps,
) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Ordered list"
      tooltipShortcutKeys={["mod", "Shift", "7"]}
      IconComponent={FormatListNumbered}
      selected={editor?.isActive("orderedList") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleOrderedList()}
      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      {...props}
    />
  );
}
