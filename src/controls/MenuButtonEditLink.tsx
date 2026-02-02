import Link from "@mui/icons-material/Link";
import { useEditorState } from "@tiptap/react";
import { useRef } from "react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonEditLinkProps = Partial<MenuButtonProps>;

export default function MenuButtonEditLink(props: MenuButtonEditLinkProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, isActive, openLinkBubbleMenu } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      isActive: editorSnapshot.isActive("link"),
      openLinkBubbleMenu: editorSnapshot.commands.openLinkBubbleMenu,
    }),
  });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  return (
    <MenuButton
      buttonRef={buttonRef}
      tooltipLabel="Link"
      tooltipShortcutKeys={["mod", "Shift", "U"]}
      IconComponent={Link}
      selected={isActive}
      disabled={!isEditable}
      onClick={() =>
        // When clicking the button to open the bubble menu, we'll place the
        // menu below the button
        openLinkBubbleMenu({
          anchorEl: buttonRef.current,
          placement: "bottom",
        })
      }
      {...props}
    />
  );
}
