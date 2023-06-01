import type { Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

export const MUITiptapEditorContext = createContext<Editor | null>(null);

export function useMUITiptapEditorContext() {
  return useContext(MUITiptapEditorContext);
}
