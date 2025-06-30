/// <reference types="@tiptap/extension-horizontal-rule" />
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonHorizontalRuleProps = Partial<MenuButtonProps>;

export default function MenuButtonHorizontalRule(
  props: MenuButtonHorizontalRuleProps,
) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Insert horizontal line"
      IconComponent={HorizontalRuleIcon}
      disabled={!editor?.isEditable || !editor.can().setHorizontalRule()}
      onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      {...props}
    />
  );
}
