import type { Editor } from "@tiptap/react";
import { RichTextEditorContext } from "./context";

export type RichTextEditorProviderProps = {
  editor: Editor | null;
  children: React.ReactNode;
};

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
