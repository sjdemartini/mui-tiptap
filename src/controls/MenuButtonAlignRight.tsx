/// <reference types="@tiptap/extension-text-align" />
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAlignRightProps = Partial<MenuButtonProps>;

export default function MenuButtonAlignRight(props: MenuButtonAlignRightProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Right align"
      tooltipShortcutKeys={["mod", "Shift", "R"]}
      IconComponent={FormatAlignRightIcon}
      selected={editor?.isActive({ textAlign: "right" }) ?? false}
      disabled={!editor?.isEditable || !editor.can().setTextAlign("right")}
      onClick={() => editor?.chain().focus().setTextAlign("right").run()}
      {...props}
    />
  );
}
