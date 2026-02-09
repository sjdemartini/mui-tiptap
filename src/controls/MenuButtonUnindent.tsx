import FormatIndentDecrease from "@mui/icons-material/FormatIndentDecrease";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonUnindentProps = Partial<MenuButtonProps>;

export default function MenuButtonUnindent(props: MenuButtonUnindentProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canLiftListItem } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canLiftListItem: editorSnapshot.can().liftListItem("listItem"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Unindent"
      tooltipShortcutKeys={["Shift", "Tab"]}
      IconComponent={FormatIndentDecrease}
      disabled={!isEditable || !canLiftListItem}
      onClick={() => editor.chain().focus().liftListItem("listItem").run()}
      {...props}
    />
  );
}
