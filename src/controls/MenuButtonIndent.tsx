import FormatIndentIncrease from "@mui/icons-material/FormatIndentIncrease";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonIndentProps = Partial<MenuButtonProps>;

export default function MenuButtonIndent(props: MenuButtonIndentProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canSinkListItem } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canSinkListItem: editorSnapshot.can().sinkListItem("listItem"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Indent"
      tooltipShortcutKeys={["Tab"]}
      IconComponent={FormatIndentIncrease}
      disabled={!isEditable || !canSinkListItem}
      onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
      {...props}
    />
  );
}
