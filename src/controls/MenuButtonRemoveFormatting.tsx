import FormatClear from "@mui/icons-material/FormatClear";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonRemoveFormattingProps = Partial<MenuButtonProps>;

/**
 * A control button removes all inline formatting of marks by calling Tiptap’s
 * unsetAllMarks command (https://tiptap.dev/api/commands/unset-all-marks).
 */
export default function MenuButtonRemoveFormatting(
  props: MenuButtonRemoveFormattingProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canUnsetAllMarks } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canUnsetAllMarks: editorSnapshot.can().unsetAllMarks(),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Remove inline formatting"
      IconComponent={FormatClear}
      disabled={!isEditable || !canUnsetAllMarks}
      onClick={() => editor.chain().focus().unsetAllMarks().run()}
      {...props}
    />
  );
}
