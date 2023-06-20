import { Link } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonEditLinkProps = Partial<MenuButtonProps>;

export default function MenuButtonEditLink(props: MenuButtonEditLinkProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Link"
      tooltipShortcutKeys={["mod", "Shift", "U"]}
      IconComponent={Link}
      selected={editor?.isActive("link")}
      disabled={!editor?.isEditable}
      onClick={editor?.commands.openLinkBubbleMenu}
      {...props}
    />
  );
}
