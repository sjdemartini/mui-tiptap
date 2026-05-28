import FormatIndentIncrease from "@mui/icons-material/FormatIndentIncrease";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";
import { isEditorActive } from "./isEditorActive";

export type MenuButtonIndentProps = Partial<MenuButtonProps>;

export default function MenuButtonIndent(props: MenuButtonIndentProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Indent"
      tooltipShortcutKeys={["Tab"]}
      IconComponent={FormatIndentIncrease}
      disabled={
        !isEditorActive(editor) || !editor.can().sinkListItem("listItem")
      }
      onClick={() => editor?.chain().focus().sinkListItem("listItem").run()}
      {...props}
    />
  );
}
