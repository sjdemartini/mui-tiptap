import { useEditor, type EditorOptions } from "@tiptap/react";
import { useEffect, useRef } from "react";
import type { Except, SetRequired } from "type-fest";
import RichTextContent from "./RichTextContent";
import RichTextEditorProvider from "./RichTextEditorProvider";

export type RichTextReadOnlyProps = SetRequired<
  Partial<Except<EditorOptions, "editable">>,
  "extensions"
>;

function RichTextReadOnlyInternal(props: RichTextReadOnlyProps) {
  const editor = useEditor({
    ...props,
    editable: false,
  });

  // Update content if/when it changes
  const previousContent = useRef(props.content);
  useEffect(() => {
    if (
      !editor ||
      editor.isDestroyed ||
      props.content === undefined ||
      props.content === previousContent.current
    ) {
      return;
    }
    // We use queueMicrotask to avoid any flushSync console errors as
    // mentioned here
    // https://github.com/ueberdosis/tiptap/issues/3764#issuecomment-1546854730
    queueMicrotask(() => {
      // Validate that props.content isn't undefined again to appease TS
      if (props.content !== undefined) {
        editor.commands.setContent(props.content);
      }
    });
  }, [props.content, editor]);

  useEffect(() => {
    previousContent.current = props.content;
  }, [props.content]);

  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextContent />
    </RichTextEditorProvider>
  );
}

/**
 * An all-in-one component to directly render read-only Tiptap editor content.
 *
 * While useEditor, RichTextEditorProvider, and RichTextContent can be used as
 * read-only via the editor's `editable` prop, this is a simpler and more
 * efficient version that only renders content and nothing more (e.g., does not
 * instantiate a toolbar, bubble menu, etc. that can't/won't be used in a
 * read-only context, and skips instantiating the editor at all if there's no
 * content to display). It can be used directly without needing the provider or
 * a separate useEditor invocation.
 *
 * Example:
 * <RichTextReadOnly content="<p>Hello world</p>" extensions={[StarterKit]} />
 */
export default function RichTextReadOnly(editorProps: RichTextReadOnlyProps) {
  if (!editorProps.content) {
    // Don't bother instantiating an editor at all (for performance) if we have no
    // content
    return null;
  }

  return <RichTextReadOnlyInternal {...editorProps} />;
}
