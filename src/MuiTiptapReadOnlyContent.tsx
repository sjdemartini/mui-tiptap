import { useEditor, type EditorOptions } from "@tiptap/react";
import type { Except } from "type-fest";
import MuiTiptapProvider from "./MuiTiptapProvider";
import RichTextContent from "./RichTextContent";

export type MuiTiptapReadOnlyContentProps = Partial<
  Except<EditorOptions, "editable">
>;

function EditorReadOnlyViewerInternal(props: MuiTiptapReadOnlyContentProps) {
  const editor = useEditor({
    ...props,
    editable: false,
  });

  return (
    <MuiTiptapProvider editor={editor}>
      <RichTextContent />
    </MuiTiptapProvider>
  );
}

/**
 * An all-in-one component to directly render read-only Tiptap editor content.
 *
 * While useEditor, MuiTiptapProvider, and RichTextContent can be used as
 * read-only via the editor's `editable` prop, this is a simpler and more
 * efficient version that only renders content and nothing more (e.g., does not
 * instantiate a toolbar, bubble menu, etc. that can't/won't be used in a
 * read-only context, and skips instantiating the editor at all if there's no
 * content to display). It can be used directly without needing the provider or
 * a separate useEditor invocation.
 *
 * Example:
 * <MuiTiptapReadOnlyContent content="<p>Hello world</p>" extensions=[...] />
 */
function MuiTiptapReadOnlyContent(editorProps: MuiTiptapReadOnlyContentProps) {
  if (!editorProps.content) {
    // Don't bother instantiating an editor at all (for performance) if we have no
    // content
    return null;
  }

  return <EditorReadOnlyViewerInternal {...editorProps} />;
}

export default MuiTiptapReadOnlyContent;
