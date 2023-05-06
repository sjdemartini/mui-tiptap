import { useMuiEditor, MuiEditorContent } from "mui-tiptap";

export default function App() {
  const editor = useMuiEditor({
    content: "",
  });

  return (
    <div>
      Using the editor!
      <div style={{ marginTop: 10 }}>
        <MuiEditorContent editor={editor} showFormattingMenuBar />
      </div>
      <pre style={{ marginTop: 10 }}>
        <code>{editor?.getHTML()}</code>
      </pre>
    </div>
  );
}
