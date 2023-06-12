import { AddPhotoAlternate } from "@mui/icons-material";
import type { ToggleButtonProps } from "@mui/material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export type MenuButtonAddImageProps = {
  tooltipLabel?: string;
  onClick: NonNullable<ToggleButtonProps["onClick"]>;
};

export default function MenuButtonAddImage({
  tooltipLabel = "Add an image",
  onClick,
}: MenuButtonAddImageProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel={tooltipLabel}
      IconComponent={AddPhotoAlternate}
      disabled={
        !editor?.isEditable ||
        // We can use any URL here for testing `can` (to see if an image can be
        // added to the editor currently)
        !editor.can().setImage({ src: "http://example.com" })
      }
      onClick={onClick}
    />
  );
}
