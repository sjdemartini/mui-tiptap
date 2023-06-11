import type { Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

export const RichTextEditorContext = createContext<Editor | null>(null);

export function useRichTextEditorContext(): Editor | null {
  return useContext(RichTextEditorContext);
}
