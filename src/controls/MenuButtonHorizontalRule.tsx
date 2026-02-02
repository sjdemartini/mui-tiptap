/// <reference types="@tiptap/extension-horizontal-rule" />
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonHorizontalRuleProps = Partial<MenuButtonProps>;

export default function MenuButtonHorizontalRule(
  props: MenuButtonHorizontalRuleProps,
) {
  const editor = useRichTextEditorContext();
  const { isEditable, canSetHorizontalRule } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canSetHorizontalRule: editorSnapshot.can().setHorizontalRule(),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Insert horizontal line"
      IconComponent={HorizontalRuleIcon}
      disabled={!isEditable || !canSetHorizontalRule}
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
      {...props}
    />
  );
}
