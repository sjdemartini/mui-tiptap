import { EditorContent } from "@tiptap/react";
import useMuiEditor, { type UseMuiEditorOptions } from "./useMuiEditor";

type Props = {
  /** The HTML or JSON editor content to render. */
  content: string;
} & Pick<UseMuiEditorOptions, "disableHeadings" | "disableTaskList">;

function EditorReadOnlyViewerInternal(props: Props) {
  const editor = useMuiEditor({
    ...props,
    editable: false,
  });

  return <EditorContent editor={editor} />;
}

/**
 * While the MuiEditor can be used as read-only via its `editable` prop, this is
 * a more efficient version that only renders content and nothing more (e.g.,
 * does not instantiate link menu handlers, etc. that can't/won't be used in a
 * read-only context, and skips instantiating the editor at all if there's no
 * content to display).
 */
function MuiEditorReadOnlyViewer({ content, ...otherProps }: Props) {
  if (!content) {
    // Don't bother instantiating an editor at all (for performance) if we have no
    // content
    return null;
  }

  return <EditorReadOnlyViewerInternal content={content} {...otherProps} />;
}

export default MuiEditorReadOnlyViewer;
