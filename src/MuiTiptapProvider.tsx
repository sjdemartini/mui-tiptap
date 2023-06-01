import type { Editor } from "@tiptap/react";
import { MuiTiptapEditorContext } from "./context";

export type MuiTiptapProviderProps = {
  editor: Editor | null;
  children: React.ReactNode;
};

export default function MuiTiptapProvider({
  editor,
  children,
}: MuiTiptapProviderProps) {
  return (
    <MuiTiptapEditorContext.Provider value={editor}>
      {children}
    </MuiTiptapEditorContext.Provider>
  );
}
