import { Collapse } from "@mui/material";
import { EditorContent, type Editor } from "@tiptap/react";
import type { Except } from "type-fest";
import EditorMenuBar, {
  type Props as EditorMenuBarProps,
} from "./EditorMenuBar";
import LinkBubbleMenu from "./LinkBubbleMenu";
import TableBubbleMenu from "./TableBubbleMenu";

type Props = Except<EditorMenuBarProps, "editor"> & {
  editor: Editor | null;
  /**
   * Whether to show the formatting menu bar. When changing between true/false,
   * uses collapse animation.
   */
  showFormattingMenuBar: boolean;
  classes?: Partial<EditableToolingClasses>;
};

type EditableToolingClasses = {
  menuBarContainer?: string;
};

export function EditableTooling({
  editor,
  showFormattingMenuBar,
  classes,
  ...otherMenuBarProps
}: Props) {
  return (
    <>
      <Collapse
        in={showFormattingMenuBar}
        // For performance reasons, we set unmountOnExit to avoid rendering the
        // menu bar unless it's needed
        unmountOnExit
        className={classes?.menuBarContainer}
      >
        <EditorMenuBar editor={editor} {...otherMenuBarProps} />
      </Collapse>

      {editor && <LinkBubbleMenu editor={editor} />}
      {editor && <TableBubbleMenu editor={editor} />}
    </>
  );
}

export default function MuiEditorContent({ editor, ...otherProps }: Props) {
  return (
    <>
      {/* Don't bother rendering/utilizing link menu handlers, etc. if we're in a
      read-only context). */}
      {editor?.isEditable && (
        <EditableTooling editor={editor} {...otherProps} />
      )}

      <EditorContent editor={editor} />
    </>
  );
}
