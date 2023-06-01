import type { Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

export const MuiTiptapEditorContext = createContext<Editor | null>(null);

export function useMuiTiptapEditorContext(): Editor | null {
  return useContext(MuiTiptapEditorContext);
}
