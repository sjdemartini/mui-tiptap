import type { Editor } from "@tiptap/react";
import { MuiTiptapEditorContext } from "./context";

export type RichTextEditorProviderProps = {
  editor: Editor | null;
  children: React.ReactNode;
};

export default function RichTextEditorProvider({
  editor,
  children,
}: RichTextEditorProviderProps) {
  return (
    <MuiTiptapEditorContext.Provider value={editor}>
      {children}
    </MuiTiptapEditorContext.Provider>
  );
}
