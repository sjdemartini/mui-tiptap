import { EditorContent, useEditor, type EditorOptions } from "@tiptap/react";
import type { Except } from "type-fest";

export type MUITiptapReadOnlyContentProps = Except<EditorOptions, "editable">;

function EditorReadOnlyViewerInternal(props: MUITiptapReadOnlyContentProps) {
  const editor = useEditor({
    ...props,
    editable: false,
  });

  return <EditorContent editor={editor} />;
}

/**
 * While useEditor, MUITiptapProvider, and MUITiptapContent can be used as
 * read-only via the editor's `editable` prop, this is a simpler and more
 * efficient version that only renders content and nothing more (e.g., does not
 * instantiate a toolbar, bubble menu, etc. that can't/won't be used in a
 * read-only context, and skips instantiating the editor at all if there's no
 * content to display). It can be used directly without needing the provider or
 * a separate useEditor invocation.
 */
function MUITiptapReadOnlyContent({
  content,
  ...otherProps
}: MUITiptapReadOnlyContentProps) {
  if (!content) {
    // Don't bother instantiating an editor at all (for performance) if we have no
    // content
    return null;
  }

  return <EditorReadOnlyViewerInternal content={content} {...otherProps} />;
}

export default MUITiptapReadOnlyContent;
