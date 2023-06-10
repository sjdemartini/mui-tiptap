import { useEditor, type Editor, type EditorOptions } from "@tiptap/react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import RichTextEditorProvider from "./RichTextEditorProvider";
import RichTextOutlinedField, {
  type RichTextOutlinedFieldProps,
} from "./RichTextOutlinedField";

export type RichTextEditorProps = Partial<EditorOptions> & {
  slotProps?: {
    field?: RichTextOutlinedFieldProps;
  };
};

export type RichTextEditorRef = {
  editor: Editor | null;
};

/**
 * An all-in-one component to directly render a MUI-styled Tiptap rich text
 * editor field.
 *
 * Example:
 * <RichTextEditor ref={rteRef} content="<p>Hello world</p>" extensions=[...] />
 */
const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  function RichTextEditor(
    {
      slotProps = {},
      // We default to `editable=true` just like `useEditor` does
      editable = true,
      ...editorProps
    }: RichTextEditorProps,
    ref
  ) {
    // TODO(Steven DeMartini): We should perhaps wrap the `onUpdate`, `onBlur`,
    // etc. callbacks in refs that we pass in here, so that changes to those
    // props will take effect. Note though that this is handled in tiptap 2.0.0
    // itself thanks to https://github.com/ueberdosis/tiptap/pull/3811
    const editor = useEditor({
      editable: editable,
      ...editorProps,
    });

    // Allow consumers of this component to access the editor via ref
    useImperativeHandle<RichTextEditorRef, RichTextEditorRef>(ref, () => ({
      editor: editor,
    }));

    // Update editable state if/when it changes
    useEffect(() => {
      if (!editor || editor.isDestroyed || editor.isEditable === editable) {
        return;
      }
      editor.setEditable(editable);
    }, [editable, editor]);

    // Update content if/when it changes
    const previousContent = useRef(editorProps.content);
    useEffect(() => {
      if (
        !editor ||
        editor.isDestroyed ||
        editorProps.content === undefined ||
        editorProps.content === previousContent.current
      ) {
        return;
      }
      editor.commands.setContent(editorProps.content);
    }, [editorProps.content, editor]);

    useEffect(() => {
      previousContent.current = editorProps.content;
    }, [editorProps.content]);

    return (
      <RichTextEditorProvider editor={editor}>
        <RichTextOutlinedField disabled={!editable} {...slotProps.field} />
      </RichTextEditorProvider>
    );
  }
);

export default RichTextEditor;
