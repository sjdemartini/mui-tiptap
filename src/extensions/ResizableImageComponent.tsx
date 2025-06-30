import type { NodeViewProps } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewWrapper } from "@tiptap/react";
import throttle from "lodash/throttle";
import { useMemo, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import type ResizableImage from "./ResizableImage";
import { ResizableImageResizer } from "./ResizableImageResizer";

// Based on
// https://github.com/ueberdosis/tiptap/blob/ab4a0e2507b4b92c46d293a0bb06bb00a04af6e0/packages/extension-image/src/image.ts#L47-L59
// We extend Record<string, unknown>, since we may inherit other global
// attributes as well, aligned with ProseMirrorNode.attrs typing.
interface ImageNodeAttributes extends Record<string, unknown> {
  src: string;
  alt?: string | null;
  title?: string | null;
}

interface ResizableImageNodeAttributes extends ImageNodeAttributes {
  width: string | number | null;
  aspectRatio: string | null;
}

interface ResizableImageNode extends ProseMirrorNode {
  attrs: ResizableImageNodeAttributes;
}

interface Props extends NodeViewProps {
  node: ResizableImageNode;
  extension: typeof ResizableImage;
}

const IMAGE_MINIMUM_WIDTH_PIXELS = 15;

const useStyles = makeStyles({ name: { ResizableImageComponent } })(
  (theme) => ({
    imageContainer: {
      // Use inline-flex so that the container is only as big as the inner img
      display: "inline-flex",
      // Use relative position so that the resizer is positioned relative to
      // the img dimensions (via their common container)
      position: "relative",
    },

    image: {
      // We need display:block in order for the container element to be
      // sized properly (no extra space below the image)
      display: "block",
    },

    imageSelected: {
      // This "selected" state outline style is copied from our standard editor
      // styles (which are kept there as well so they appear even if not using our
      // custom resizable image).
      outline: `3px solid ${theme.palette.primary.main}`,
    },

    resizer: {
      // As described here https://github.com/ueberdosis/tiptap/issues/3775,
      // updates to editor isEditable do not trigger re-rendering of node views.
      // Even editor state changes external to a given ReactNodeView component
      // will not trigger re-render (which is probably a good thing most of the
      // time, in terms of performance). As such, we always render the resizer
      // component with React (and so in the DOM), but hide it with CSS when the
      // editor is not editable. This also means its mouse event listeners will
      // also not fire, as intended.
      '.ProseMirror[contenteditable="false"] &': {
        display: "none",
      },
    },
  }),
);

function ResizableImageComponent(props: Props) {
  const { node, selected, updateAttributes, extension } = props;
  const { classes, cx } = useStyles();
  const { attrs } = node;

  const imageRef = useRef<HTMLImageElement | null>(null);

  // We store the mouse-down state of the ResizableImageResizer here to properly
  // control the resizer visibility when `inline` option is enabled. Tiptap
  // seems to change the selected state of the node to `false` as soon as the
  // user drags on the resize handle if the extension has `inline: true`, so we
  // need to consider the resizing state here in order to ensure it's still
  // shown during a resize. See
  // https://github.com/sjdemartini/mui-tiptap/issues/211
  const [resizerMouseDown, setResizerMouseDown] = useState(false);
  const selectedOrResizing = selected || resizerMouseDown;

  const handleResize = useMemo(
    () =>
      // Throttle our "on resize" handler, since the event fires very rapidly during
      // dragging, so rendering would end up stuttering a bit without a throttle
      throttle(
        (event: MouseEvent) => {
          if (!imageRef.current) {
            return;
          }

          const originalBoundingRect = imageRef.current.getBoundingClientRect();

          // Get the "width" and "height" of the resized image based on the user's
          // cursor position after movement, if we were to imagine a box drawn from
          // the top left corner of the image to their cursor. (clientX/Y and
          // getBoundingClientRect both reference positions relative to the viewport,
          // allowing us to use them to calculate the new "resized" image dimensions.)
          const resizedWidth = event.clientX - originalBoundingRect.x;
          const resizedHeight = event.clientY - originalBoundingRect.y;

          // We always preserve the original image aspect ratio, setting only the
          // `width` to a specific number upon resize (and leaving the `height` of the
          // `img` as "auto"). So to determine the new width, we'll take the larger of
          // (a) the new resized width after the user's latest drag resize movement,
          // (b) the width proportional to the new resized height given the image
          // aspect ratio, or (c) a minimum width to prevent mistakes. This is similar
          // to what Google Docs image resizing appears to be doing, which feels
          // intuitive.
          const resultantWidth = Math.max(
            resizedWidth,
            (originalBoundingRect.width / originalBoundingRect.height) *
              resizedHeight,
            // Set a minimum width, since any smaller is probably a mistake, and we
            // don't want images to get mistakenly shrunken below a size which makes
            // it hard to later select/resize the image
            IMAGE_MINIMUM_WIDTH_PIXELS,
          );

          updateAttributes({
            width: Math.round(resultantWidth),
          });
        },
        50,
        { trailing: true }, // Make sure our last event triggers a callback
      ),
    [updateAttributes],
  );

  const ChildComponent = extension.options.ChildComponent;
  return (
    <NodeViewWrapper
      style={{
        // Handle @tiptap/extension-text-align. Ideally we'd be able to inherit
        // this style from TextAlign's GlobalAttributes directly, but those are
        // only applied via `renderHTML` and not the `NodeView` renderer
        // (https://github.com/ueberdosis/tiptap/blob/6c34dec33ac39c9f037a0a72e4525f3fc6d422bf/packages/extension-text-align/src/text-align.ts#L43-L49),
        // so we have to do this manually/redundantly here.
        textAlign: attrs.textAlign,
        width: "100%",
      }}
      // Change the outer component's component to a "span" if the `inline`
      // extension option is enabled, to ensure it can appear alongside other
      // inline elements like text.
      as={extension.options.inline ? "span" : "div"}
    >
      {/* We need a separate inner image container here in order to (1) have the
      node view wrapper take up the full width of its parent div created by
      ReactNodeViewRender (so we can utilize text-align for these children
      elements), and (2) still allow for this image container to take up exactly
      the size of the `img` being rendered, which allows for positioning the
      resize handle at the edge of the img. */}
      <div className={classes.imageContainer}>
        <img
          ref={imageRef}
          src={attrs.src}
          height="auto"
          width={attrs.width ? attrs.width : undefined}
          {...{
            alt: attrs.alt || undefined,
            title: attrs.title || undefined,
          }}
          className={cx(
            classes.image,
            // For consistency with the standard Image extension selection
            // class/UI:
            selectedOrResizing && "ProseMirror-selectednode",
            // We'll only show the outline when the editor content is selected
            selectedOrResizing && classes.imageSelected,
          )}
          style={{
            // If no width has been specified, we use auto max-width
            maxWidth: attrs.width ? undefined : "auto",
            // Always specify the aspect-ratio if it's been defined, to improve
            // initial render (so auto-height works before the image loads)
            aspectRatio: attrs.aspectRatio ?? undefined,
          }}
          // To make this image act as the drag handle for moving it within the
          // document, add the data-drag-handle used by Tiptap
          // (https://tiptap.dev/guide/node-views/react#dragging)
          data-drag-handle
          // When the image loads, we'll update our width and aspect-ratio based
          // on the image's natural size, if they're not set. That way, all future
          // renders will know the image width/height prior to load/render,
          // preventing flashing
          onLoad={(event) => {
            const newAttributes: Partial<ResizableImageNodeAttributes> = {};
            if (!attrs.width) {
              newAttributes.width = event.currentTarget.naturalWidth;
            }
            if (!attrs.aspectRatio) {
              newAttributes.aspectRatio = String(
                event.currentTarget.naturalWidth /
                  event.currentTarget.naturalHeight,
              );
            }
            if (newAttributes.width || newAttributes.aspectRatio) {
              updateAttributes(newAttributes);
            }
          }}
        />

        {selectedOrResizing && (
          <ResizableImageResizer
            onResize={handleResize}
            className={classes.resizer}
            mouseDown={resizerMouseDown}
            setMouseDown={setResizerMouseDown}
          />
        )}

        {ChildComponent && <ChildComponent {...props} />}
      </div>
    </NodeViewWrapper>
  );
}

export default ResizableImageComponent;
