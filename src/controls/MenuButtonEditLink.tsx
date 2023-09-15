import Link from "@mui/icons-material/Link";
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
        // When clicking the button to open the bubble menu, we'll place the
        // menu below the button
        editor?.commands.openLinkBubbleMenu({
          anchorEl: buttonRef.current,
          placement: "bottom",
        })
      }
      {...props}
    />
  );
}
