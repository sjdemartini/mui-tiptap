import { useEditor, type Editor, type EditorOptions } from "@tiptap/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type DependencyList,
} from "react";
import type { Except, SetRequired } from "type-fest";
import RichTextEditorProvider from "./RichTextEditorProvider";
import RichTextField, { type RichTextFieldProps } from "./RichTextField";

export interface RichTextEditorProps
  extends SetRequired<Partial<EditorOptions>, "extensions"> {
  /**
   * Render the controls content to show inside the menu bar atop the editor
   * content. Typically you will want to render a <MenuControlsContainer>
   * containing several MenuButton* components, depending on what controls you
   * want to include in the menu bar (and what extensions you've enabled).
   * If not provided, no menu bar will be shown.
   *
   * This is a render prop and we can't simply accept a ReactNode directly
   * because we need to ensure that the controls content is re-rendered whenever
   * the editor selection, content, etc. is updated (which is triggered via
   * useEditor within this component). If a ReactNode were directly passed in,
   * it would only re-render whenever the *parent* of RichTextEditor re-renders,
   * which wouldn't be sufficient.
   */
  renderControls?: (editor: Editor | null) => React.ReactNode;
  /**
   * Props applied to the RichTextField element inside (except `controls`, which
   * is controlled via `renderControls`, as this ensures proper re-rendering as
   * the editor changes).
   */
  RichTextFieldProps?: Except<RichTextFieldProps, "controls">;
  /**
   * Optional content to render alongside/after the inner RichTextField, where
   * you can access the editor via the parameter to this render prop, or in a
   * child component via `useRichTextEditorContext()`. Useful for including
   * plugins like mui-tiptap's LinkBubbleMenu and TableBubbleMenu, or other
   * custom components (e.g. a menu that utilizes Tiptap's FloatingMenu).
   */
  children?: (editor: Editor | null) => React.ReactNode;
  /**
   * A dependency array for the useEditor hook, which will re-create the editor
   * when any value in the array changes.
   */
  editorDependencies?: DependencyList;
  /** Class applied to the root element. */
  className?: string;
}

export type RichTextEditorRef = {
  editor: Editor | null;
};

/**
 * An all-in-one component to directly render a MUI-styled Tiptap rich text
 * editor field.
 *
 * Example:
 * <RichTextEditor ref={rteRef} content="<p>Hello world</p>" extensions={[...]} />
 */
const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  function RichTextEditor(
    {
      className,
      renderControls,
      RichTextFieldProps = {},
      children,
      editorDependencies = [],
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
    const editor = useEditor(
      {
        editable: editable,
        ...editorProps,
      },
      editorDependencies
    );

    // Allow consumers of this component to access the editor via ref
    useImperativeHandle<RichTextEditorRef, RichTextEditorRef>(ref, () => ({
      editor: editor,
    }));

    // Update editable state if/when it changes
    useEffect(() => {
      if (!editor || editor.isDestroyed || editor.isEditable === editable) {
        return;
      }
      // We use queueMicrotask to avoid any flushSync console errors as
      // mentioned here (though setEditable shouldn't trigger them in practice)
      // https://github.com/ueberdosis/tiptap/issues/3764#issuecomment-1546854730
      queueMicrotask(() => editor.setEditable(editable));
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
      // We use queueMicrotask to avoid any flushSync console errors as
      // mentioned here
      // https://github.com/ueberdosis/tiptap/issues/3764#issuecomment-1546854730
      queueMicrotask(() => {
        // Validate that editorProps.content isn't undefined again to appease TS
        if (editorProps.content !== undefined) {
          editor.commands.setContent(editorProps.content);
        }
      });
    }, [editorProps.content, editor]);

    useEffect(() => {
      previousContent.current = editorProps.content;
    }, [editorProps.content]);

    return (
      <RichTextEditorProvider editor={editor}>
        <RichTextField
          disabled={!editable}
          controls={renderControls?.(editor)}
          className={className}
          {...RichTextFieldProps}
        />
        {children?.(editor)}
      </RichTextEditorProvider>
    );
  }
);

export default RichTextEditor;
