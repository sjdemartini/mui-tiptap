import FormatIndentDecrease from "@mui/icons-material/FormatIndentDecrease";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";
import { isEditorActive } from "./isEditorActive";

export type MenuButtonUnindentProps = Partial<MenuButtonProps>;

export default function MenuButtonUnindent(props: MenuButtonUnindentProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Unindent"
      tooltipShortcutKeys={["Shift", "Tab"]}
      IconComponent={FormatIndentDecrease}
      disabled={
        !isEditorActive(editor) || !editor.can().liftListItem("listItem")
      }
      onClick={() => editor?.chain().focus().liftListItem("listItem").run()}
      {...props}
    />
  );
}
