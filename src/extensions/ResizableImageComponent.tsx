import { useTheme } from "@mui/material";
import type { NodeViewProps } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewWrapper } from "@tiptap/react";
import throttle from "lodash/throttle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";

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
}

type ResizerProps = {
  onResize: (event: MouseEvent) => void;
};

const IMAGE_MINIMUM_WIDTH_PIXELS = 15;

function Resizer({ onResize }: ResizerProps) {
  const [mouseDown, setMouseDown] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      onResize(event);
    };

    if (mouseDown) {
      // If the user is currently holding down the resize handle, we'll have mouse
      // movements fire the onResize callback (since the user would be "dragging" the
      // handle)
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseDown, onResize]);

  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false);

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = useCallback((_event: React.MouseEvent) => {
    setMouseDown(true);
  }, []);

  return (
    // There isn't a great role to use here (perhaps role="separator" is the
    // closest, as described here https://stackoverflow.com/a/43022983/4543977,
    // but we don't do keyboard-based resizing so it doesn't make sense to have
    // it keyboard focusable)
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      aria-label="resize image"
      style={{
        position: "absolute",
        // The `outline` styles of the selected image add 3px to the edges, so we'll
        // position this offset by 3px outside to the bottom right
        bottom: -3,
        right: -3,
        width: 12,
        height: 12,
        background: theme.palette.primary.main,
        cursor: "nwse-resize",
      }}
      onMouseDown={handleMouseDown}
    />
  );
}

const useStyles = makeStyles({ name: { ResizableImageComponent } })({
  imageContainer: {
    // Use inline-block so that the container is only as big as the inner
    // img
    display: "inline-block",
    // Use relative position so that the resizer is positioned relative to
    // the img dimensions (via their common container)
    position: "relative",
  },
});

function ResizableImageComponent({
  editor,
  node,
  selected,
  updateAttributes,
}: Props) {
  const { classes } = useStyles();
  const { attrs } = node;

  const theme = useTheme();

  const imageRef = useRef<HTMLImageElement | null>(null);

  const isSelectedAndEditable = selected && editor.isEditable;

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
            IMAGE_MINIMUM_WIDTH_PIXELS
          );

          updateAttributes({
            width: Math.round(resultantWidth),
          });
        },
        50,
        { trailing: true } // Make sure our last event triggers a callback
      ),
    [updateAttributes]
  );

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
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            alt: attrs.alt || undefined,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            title: attrs.title || undefined,
          }}
          style={{
            // We need display:block in order for the container element to be
            // sized properly (no extra space below the image)
            display: "block",
            // If no width has been specified, we use auto max-width
            maxWidth: attrs.width ? undefined : "auto",
            // Always specify the aspect-ratio if it's been defined, to improve
            // initial render (so auto-height works before the image loads)
            aspectRatio: attrs.aspectRatio ?? undefined,
            // This "selected" state outline style is copied from our standard
            // editor styles (which are kept there as well so they appear even if
            // not using our custom resizable image). We'll only show this when
            // the editor content is editable, though.
            outline: isSelectedAndEditable
              ? `3px solid ${theme.palette.primary.main}`
              : undefined,
          }}
          // For consistency with the standard Image extension selection class/UI (but
          // only when editable)
          className={
            isSelectedAndEditable ? "ProseMirror-selectednode" : undefined
          }
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
                  event.currentTarget.naturalHeight
              );
            }
            if (newAttributes.width || newAttributes.aspectRatio) {
              updateAttributes(newAttributes);
            }
          }}
        />

        {isSelectedAndEditable && <Resizer onResize={handleResize} />}
      </div>
    </NodeViewWrapper>
  );
}

export default ResizableImageComponent;
