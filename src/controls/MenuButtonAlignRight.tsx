/// <reference types="@tiptap/extension-text-align" />
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAlignRightProps = Partial<MenuButtonProps>;

export default function MenuButtonAlignRight(props: MenuButtonAlignRightProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canSetTextAlignRight, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canSetTextAlignRight: editorSnapshot.can().setTextAlign("right"),
      isActive: editorSnapshot.isActive({ textAlign: "right" }),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Right align"
      tooltipShortcutKeys={["mod", "Shift", "R"]}
      IconComponent={FormatAlignRightIcon}
      selected={isActive}
      disabled={!isEditable || !canSetTextAlignRight}
      onClick={() => editor.chain().focus().setTextAlign("right").run()}
      {...props}
    />
  );
}
