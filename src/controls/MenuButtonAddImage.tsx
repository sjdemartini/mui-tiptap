import { AddPhotoAlternate } from "@mui/icons-material";
import type { ToggleButtonProps } from "@mui/material";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAddImageProps = Partial<MenuButtonProps> & {
  onClick: NonNullable<ToggleButtonProps["onClick"]>;
};

export default function MenuButtonAddImage({
  ...props
}: MenuButtonAddImageProps) {
  const editor = useRichTextEditorContext();

  return (
    <MenuButton
      tooltipLabel="Add an image"
      IconComponent={AddPhotoAlternate}
      disabled={
        !editor?.isEditable ||
        // We can use any URL here for testing `can` (to see if an image can be
        // added to the editor currently)
        !editor.can().setImage({ src: "http://example.com" })
      }
      {...props}
    />
  );
}
