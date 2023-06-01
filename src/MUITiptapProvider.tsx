import type { Editor } from "@tiptap/react";
import { MUITiptapEditorContext } from "./MUITiptapEditorContext";

export type MUITiptapProviderProps = {
  editor: Editor | null;
  children: React.ReactNode;
};

export default function MUITiptapProvider({
  editor,
  children,
}: MUITiptapProviderProps) {
  return (
    <MUITiptapEditorContext.Provider value={editor}>
      {children}
    </MUITiptapEditorContext.Provider>
  );
}
