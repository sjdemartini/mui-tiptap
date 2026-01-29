import AddPhotoAlternate from "@mui/icons-material/AddPhotoAlternate";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonAddImageProps = Partial<MenuButtonProps> & {
  /**
   * Click handler for adding images. You must provide your own implementation
   * in order to specify *how* the image is added. For instance, you might open
   * a popup for the user to provide an image URL, or you might trigger a file
   * upload via file input dialog (e.g. see MenuButtonImageUpload).
   */
  onClick: NonNullable<MenuButtonProps["onClick"]>;
};

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
  const { isEditable, canSetImage } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      // We can use any URL here for testing `can` (to see if an image can be
      // added to the editor currently)
      canSetImage: editorSnapshot.can().setImage({ src: "http://example.com" }),
    }),
  });

  return (
    <MenuButton
      tooltipLabel="Insert image"
      IconComponent={AddPhotoAlternate}
      disabled={!isEditable || !canSetImage}
      {...props}
    />
  );
}
