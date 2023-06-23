import { Link } from "@mui/icons-material";
import { useRef } from "react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonEditLinkProps = Partial<MenuButtonProps>;

export default function MenuButtonEditLink(props: MenuButtonEditLinkProps) {
  const editor = useRichTextEditorContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  return (
    <MenuButton
      buttonRef={buttonRef}
      tooltipLabel="Link"
      tooltipShortcutKeys={["mod", "Shift", "U"]}
      IconComponent={Link}
      selected={editor?.isActive("link")}
      disabled={!editor?.isEditable}
      onClick={() =>
        // Anchor the link bubble menu to the button, when clicking the button
        // to open it
        editor?.commands.openLinkBubbleMenu({ anchorEl: buttonRef.current })
      }
      {...props}
    />
  );
}
