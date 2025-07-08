import { useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import type { Except, SetRequired } from "type-fest";
import RichTextContent, { type RichTextContentProps } from "./RichTextContent";
import type { UseEditorOptions } from "./RichTextEditor";
import RichTextEditorProvider from "./RichTextEditorProvider";

export type RichTextReadOnlyProps = SetRequired<
  Partial<Except<UseEditorOptions, "editable">>,
  "extensions"
> & {
  /**
   * Override the props for the RichTextContent component.
   */
  RichTextContentProps?: RichTextContentProps;
  /**
   * A convenience prop alternative to `RichTextContentProps.sx` for applying
   * styles to the rich text content.
   */
  sx?: RichTextContentProps["sx"];
};

function RichTextReadOnlyInternal({
  RichTextContentProps,
  sx,
  ...editorOptions
}: RichTextReadOnlyProps) {
  const editor = useEditor({
    ...editorOptions,
    editable: false,
  });

  // Update content if/when it changes
  const previousContent = useRef(editorOptions.content);
  useEffect(() => {
    if (
      !editor ||
      editor.isDestroyed ||
      editorOptions.content === undefined ||
      editorOptions.content === previousContent.current
    ) {
      return;
    }
    // We use queueMicrotask to avoid any flushSync console errors as
    // mentioned here
    // https://github.com/ueberdosis/tiptap/issues/3764#issuecomment-1546854730
    queueMicrotask(() => {
      // Validate that editorOptions.content isn't undefined again to appease TS
      if (editorOptions.content !== undefined) {
        editor.commands.setContent(editorOptions.content);
      }
    });
  }, [editorOptions.content, editor]);

  useEffect(() => {
    previousContent.current = editorOptions.content;
  }, [editorOptions.content]);

  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextContent sx={sx} {...RichTextContentProps} />
    </RichTextEditorProvider>
  );
}

/**
 * An all-in-one component to directly render read-only Tiptap editor content.
 *
 * When to use this component:
 * - You just want to render editor HTML/JSON content directly, without any
 *   outlined field styling, menu bar, extra setup, etc.
 * - You want a convenient way to render content that re-renders as the
 *   `content` prop changes.
 *
 * Though RichtextEditor (or useEditor, RichTextEditorProvider, and
 * RichTextContent) can be used as read-only via the editor's `editable` prop,
 * this is a simpler and more efficient version that only renders content and
 * nothing more (e.g., skips instantiating the editor at all if there's no
 * content to display, and does not contain additional rendering logic related
 * to controls, outlined field UI state, etc.).
 *
 * Example:
 * <RichTextReadOnly content="<p>Hello world</p>" extensions={[StarterKit]} />
 */
export default function RichTextReadOnly(props: RichTextReadOnlyProps) {
  if (!props.content) {
    // Don't bother instantiating an editor at all (for performance) if we have
    // no content
    return null;
  }

  return <RichTextReadOnlyInternal {...props} />;
}
