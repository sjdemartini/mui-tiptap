import type { Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

export const RichTextEditorContext = createContext<Editor | null | undefined>(
  undefined,
);

export function useRichTextEditorContext(): Editor {
  const editor = useContext(RichTextEditorContext);
  if (!editor) {
    throw new Error(
      "Tiptap editor not found in component context. Be sure to use <RichTextEditorProvider editor={editor} />!",
    );
  }

  return editor;
}
