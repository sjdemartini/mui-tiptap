import { Link } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonEditLink() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Link"
      tooltipShortcutKeys={["mod", "Shift", "U"]}
      IconComponent={Link}
      selected={editor?.isActive("link")}
      disabled={!editor?.isEditable}
      onClick={editor?.commands.openLinkBubbleMenu}
    />
  );
}
