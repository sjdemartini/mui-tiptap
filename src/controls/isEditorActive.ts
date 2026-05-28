import type { Editor } from "@tiptap/core";

export function isEditorActive(editor: Editor | null): editor is Editor {
  return editor != null && editor.isEditable && !editor.isDestroyed;
}
