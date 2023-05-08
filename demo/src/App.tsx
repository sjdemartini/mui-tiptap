import { Typography } from "@mui/material";
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
      <div style={{ marginBottom: 20 }}>
        <hr />
      </div>
      <Typography variant="h5">HTML result:</Typography>
      <pre style={{ marginTop: 10 }}>
        <code>{editor?.getHTML()}</code>
      </pre>
    </div>
  );
}
