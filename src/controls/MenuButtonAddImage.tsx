import AddPhotoAlternate from "@mui/icons-material/AddPhotoAlternate";
import type { SetRequired } from "type-fest";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

/**
 * You must provide your own `onClick` handler.
 */
export type MenuButtonAddImageProps = SetRequired<
  Partial<MenuButtonProps>,
  "onClick"
>;

/**
 * Render a button for adding an image to the editor content. You must provide
 * your own `onClick` prop in order to specify *how* the image is added. For
 * instance, you might open a popup for the user to provide an image URL, or you
 * might trigger a file upload via file input dialog.
 *
 * Once the image URL is ready (after the user has filled it out or after an
 * upload has completed), you can typically use something like:
 *
 *   editor.chain().focus().setImage({ src: url }).run()
 *
 * See Tiptap's example here https://tiptap.dev/api/nodes/image.
 */
export default function MenuButtonAddImage({
  ...props
}: MenuButtonAddImageProps) {
  const editor = useRichTextEditorContext();

  return (
    <MenuButton
      tooltipLabel="Insert image"
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
