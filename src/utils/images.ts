import type { Editor } from "@tiptap/core";

export type ImageAttributes = {
  /** The URL at which this image can be served. Used as <img> `src`. */
  url: string;
  /** Alt text for the image. */
  alt?: string;
};

/**
 * Insert the given array of images into the Tiptap editor document content.
 *
 * Optionally specify a given position at which to insert the images into the
 * editor content. If not given, the user's current selection (if there is any)
 * will be replaced by the newly inserted images.
 *
 * @param options.images The attributes of each image to insert
 * @param options.editor The Tiptap editor in which to insert
 * @param options.insertPosition The position at which to insert into the editor
 * content. If not given, uses the current editor caret/selection position.
 */
export function insertImages({
  images,
  editor,
  insertPosition,
}: {
  images: ImageAttributes[];
  editor: Editor | null;
  insertPosition?: number;
}): void {
  if (!editor || editor.isDestroyed || images.length === 0) {
    return;
  }

  // We'll replace the user's current selection (if there is any) as long as
  // there wasn't a specific insert position given
  let shouldReplace = insertPosition === undefined;
  // Default to the user's current cursor position if the caller didn't
  // provide an insertPosition
  const currentInsertPosition = insertPosition ?? editor.state.selection.from;

  editor
    .chain()
    // Insert the new images into the document!
    .command(({ tr }) => {
      // Since we add each image at the same cursor position, we'll insert
      // them in reverse order so that the item added first will appear first
      // in the document
      images
        .slice()
        .reverse()
        .forEach((image) => {
          if (!image.url) {
            return;
          }
          // Add a new image node for the new image
          const node = editor.schema.nodes.image.create({
            src: image.url,
            alt: image.alt,
          });

          if (shouldReplace) {
            tr.replaceSelectionWith(node);
            // Once we've replaced the selection, all subsequent images
            // should be inserted (not replaced) to allow multiple nodes to
            // be added.
            shouldReplace = false;
          } else {
            tr.insert(currentInsertPosition, node);
          }
        });

      return true;
    })
    // Select the last image node we inserted and re-focus the editor. (For
    // instance, if the user dropped an image somewhere in the document that
    // differed from their previous cursor position, our
    // `currentInsertPosition` should reflect the desired drop location, and
    // we'll keep them there when refocusing the editor.)
    .setTextSelection(currentInsertPosition)
    .focus()
    .run();
}
