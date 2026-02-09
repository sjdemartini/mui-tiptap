import type { Editor, EditorEvents } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { useEffect, useRef } from "react";

export type UseEditorOnEditableUpdateOptions = {
  editor: Editor;
  /**
   * The function that will be called when editor.isEditable is changed. Set to
   * null or undefined to turn off the listener.
   */
  callback?: ((props: EditorEvents["update"]) => void) | null | undefined;
};

/**
 * A hook for listening to changes in the Tiptap editor isEditable state, via
 * "update" event.
 *
 * This can be useful inside of ReactNodeViews that depend on editor isEditable
 * state. As described here https://github.com/ueberdosis/tiptap/issues/3775,
 * updates to editor isEditable do not trigger re-rendering of node views. Even
 * editor state changes external to a given ReactNodeView component will not
 * trigger re-render (which is probably a good thing most of the time, in terms
 * of performance). As such, this hook can listen for editor.isEditable changes
 * and can be used to force a re-render, update state, etc.
 */
export default function useEditorOnEditableUpdate({
  editor,
  callback,
}: UseEditorOnEditableUpdateOptions): void {
  const callbackRef = useRef(callback);
  const { isEditable, isDestroyed } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      isDestroyed: editorSnapshot.isDestroyed,
    }),
  });
  const isEditableRef = useRef(isEditable);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const hasCallback = !!callback;
  useEffect(() => {
    if (isDestroyed || !hasCallback) {
      return;
    }

    isEditableRef.current = isEditable;

    function handleUpdate({
      editor: updatedEditor,
      ...props
    }: EditorEvents["update"]) {
      // use the actual editor state inside the update handler because we know it is up to date
      if (
        !updatedEditor.isDestroyed ||
        updatedEditor.isEditable === isEditableRef.current
      ) {
        return;
      }

      // The editable state has changed!
      isEditableRef.current = updatedEditor.isEditable;
      callbackRef.current?.({ editor: updatedEditor, ...props });
    }

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, hasCallback, isDestroyed, isEditable]);
}
