import TextFieldsIcon from "@mui/icons-material/TextFields";
import { Box, Button, Typography } from "@mui/material";
import { useEditor } from "@tiptap/react";
import { useState } from "react";
import MenuButton from "../MenuButton";
import MuiTiptapOutlinedField from "../MuiTiptapOutlinedField";
import MuiTiptapProvider from "../MuiTiptapProvider";
import useRecommendedExtensions from "../useRecommendedExtensions";

const exampleContent =
  '<h2>Hey there 👋</h2><p>This is a <em>basic</em> example of using <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap</a> with <a target="_blank" rel="noopener noreferrer nofollow" href="https://mui.com/">MUI (Material-UI)</a>. Sure, there are all kind of <strong>basic text styles</strong> you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try <code>inline code</code> and a code block:</p><pre><code class="language-css">body {\n  display: none;\n}</code></pre><p></p><p>It’s only the tip of the iceberg though. Give it a try and click a little bit around. And feel free to add and resize cat photos:</p><img height="auto" src="http://placekitten.com/g/500" alt="wat" width="257" style="aspect-ratio: 1 / 1"><p></p><p>Organize information in tables:</p><table><tbody><tr><th colspan="1" rowspan="1"><p>Name</p></th><th colspan="1" rowspan="1"><p>Role</p></th><th colspan="1" rowspan="1"><p>Team</p></th></tr><tr><td colspan="1" rowspan="1"><p>Alice</p></td><td colspan="1" rowspan="1"><p>PM</p></td><td colspan="1" rowspan="1"><p>Internal tools</p></td></tr><tr><td colspan="1" rowspan="1"><p>Bob</p></td><td colspan="1" rowspan="1"><p>Software</p></td><td colspan="1" rowspan="1"><p>Infrastructure</p></td></tr></tbody></table><p></p><p>Or write down your groceries:</p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Milk</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Eggs</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Sriracha</p></div></li></ul><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Mom</p></blockquote><p>Give it a try!</p>';

export default function Editor() {
  const extensions = useRecommendedExtensions({
    placeholder: "Add your own content here...",
  });

  const editor = useEditor({
    content: exampleContent,
    extensions: extensions,
  });

  const [showMenuBar, setShowMenuBar] = useState(true);

  const [submittedContent, setSubmittedContent] = useState("");

  return (
    // This demonstrates how styles can be overridden for the components below
    <Box sx={{ "& .MuiTiptapContent": { p: 1 } }}>
      <MuiTiptapProvider editor={editor}>
        <MuiTiptapOutlinedField hideMenuBar={!showMenuBar}>
          {/* Below is an example of adding a toggle within the outlined field
          for showing/hiding the editor menu bar, and a "submit" button for
          saving/viewing the HTML content */}
          <Box
            sx={{
              borderTopStyle: "solid",
              borderTopWidth: 1,
              borderTopColor: (theme) => theme.palette.divider,
              p: 1,
            }}
          >
            <MenuButton
              value="formatting"
              tooltipLabel={showMenuBar ? "Hide formatting" : "Show formatting"}
              size="small"
              onClick={() => setShowMenuBar((currentState) => !currentState)}
              selected={showMenuBar}
              IconComponent={TextFieldsIcon}
              sx={{ mr: 2 }}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setSubmittedContent(editor?.getHTML() ?? "");
              }}
            >
              Save
            </Button>
          </Box>
        </MuiTiptapOutlinedField>
      </MuiTiptapProvider>

      <Typography variant="h5" sx={{ mt: 5 }}>
        Saved result:
      </Typography>
      {submittedContent ? (
        <pre style={{ marginTop: 10, overflow: "auto", maxWidth: "100%" }}>
          <code>{submittedContent}</code>
        </pre>
      ) : (
        <>
          Press “Save” above to show the HTML markup for the editor content.
          Typically you’d use a similar <code>editor.getHTML()</code> approach
          to save your data in a form.
        </>
      )}
    </Box>
  );
}
