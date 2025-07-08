import { useEditor, type Editor } from "@tiptap/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type DependencyList,
} from "react";
import type { Except, SetRequired } from "type-fest";
import RichTextEditorProvider from "./RichTextEditorProvider";
import RichTextField, { type RichTextFieldProps } from "./RichTextField";

// We define our own `UseEditorOptions` type here based on the signature of
// `useEditor` so that we can support both Tiptap 2.5+ which uses a new
// `UseEditorOptions` type
// (https://github.com/ueberdosis/tiptap/commit/df5609cdff27f97e11860579a7af852cf3e50ce5#diff-13acb5e551812e195c1140c10ba5ac298a0005996d07756cfd77c2d4194cb350R16),
// as well as Tiptap <2.5 where `useEditor` used the `EditorOptions` type and
// `UseEditorOptions` didn't yet exist.
export type UseEditorOptions = NonNullable<Parameters<typeof useEditor>[0]>;

export interface RichTextEditorProps
  extends SetRequired<Partial<UseEditorOptions>, "extensions"> {
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
   * A convenience prop alternative to `RichTextFieldProps.sx` for applying
   * styles to the rich text field.
   */
  sx?: RichTextFieldProps["sx"];
  /**
   * Optional content to render alongside/after the inner RichTextField, where
   * you can access the editor via the parameter to this render prop, or in a
   * child component via `useRichTextEditorContext()`. Useful for including
   * plugins like mui-tiptap's LinkBubbleMenu and TableBubbleMenu, or other
   * custom components (e.g. a menu that utilizes Tiptap's FloatingMenu). (This
   * is a render prop rather than just a ReactNode for the same reason as
   * `renderControls`; see above.)
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
 * NOTE: changes to `content` will not trigger re-rendering of the component.
 * i.e., by default the `content` prop is essentially "initial content". To
 * change content after rendering, you can use a hook and call
 * `rteRef.current?.editor?.setContent(newContent)`. See README "Re-rendering
 * `RichTextEditor` when `content` changes" for more details.
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
      sx,
      children,
      editorDependencies = [],
      // We default to `editable=true` just like `useEditor` does
      editable = true,
      ...editorOptions
    }: RichTextEditorProps,
    ref,
  ) {
    const editor = useEditor(
      {
        editable: editable,
        ...editorOptions,
      },
      editorDependencies,
    );

    // Allow consumers of this component to access the editor via ref
    useImperativeHandle<RichTextEditorRef, RichTextEditorRef>(
      ref,
      () => ({
        editor: editor,
      }),
      [editor],
    );

    // Update editable state if/when it changes
    useEffect(() => {
      if (!editor || editor.isDestroyed || editor.isEditable === editable) {
        return;
      }
      // We use queueMicrotask to avoid any flushSync console errors as
      // mentioned here (though setEditable shouldn't trigger them in practice)
      // https://github.com/ueberdosis/tiptap/issues/3764#issuecomment-1546854730
      queueMicrotask(() => {
        editor.setEditable(editable);
      });
    }, [editable, editor]);

    return (
      <RichTextEditorProvider editor={editor}>
        <RichTextField
          disabled={!editable}
          controls={renderControls?.(editor)}
          className={className}
          sx={sx}
          {...RichTextFieldProps}
        />
        {children?.(editor)}
      </RichTextEditorProvider>
    );
  },
);

export default RichTextEditor;
