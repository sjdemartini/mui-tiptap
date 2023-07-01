import type { Editor } from "@tiptap/react";
import { RichTextEditorContext } from "./context";

export type RichTextEditorProviderProps = {
  editor: Editor | null;
  children: React.ReactNode;
};

/**
 * Makes the Tiptap `editor` available to any nested components, via the
 * `useRichTextEditorContext()` hook so that the `editor` does not need to be
 * manually passed in at every level.
 *
 * Required as a parent for most mui-tiptap components besides the all-in-one
 * `RichTextEditor` and `RichTextReadOnly`.
 */
export default function RichTextEditorProvider({
  editor,
  children,
}: RichTextEditorProviderProps) {
  return (
    <RichTextEditorContext.Provider value={editor}>
      {children}
    </RichTextEditorContext.Provider>
  );
}
