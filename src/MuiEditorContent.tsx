import { Collapse } from "@mui/material";
import { Editor, EditorContent } from "@tiptap/react";
import { Except } from "type-fest";
import EditorMenuBar, { Props as EditorMenuBarProps } from "./EditorMenuBar";
import TableBubbleMenu from "./TableBubbleMenu";
import useLinkMenu from "./useLinkMenu";

type Props = Except<EditorMenuBarProps, "editor" | "onShowLinkMenu"> & {
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
  const { linkBubbleMenu, onShowLinkMenu } = useLinkMenu({
    editor,
  });

  return (
    <>
      <Collapse
        in={showFormattingMenuBar}
        // For performance reasons, we set unmountOnExit to avoid rendering the
        // menu bar unless it's needed
        unmountOnExit
        className={classes?.menuBarContainer}
      >
        <EditorMenuBar
          editor={editor}
          onShowLinkMenu={onShowLinkMenu}
          {...otherMenuBarProps}
        />
      </Collapse>

      {linkBubbleMenu}
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
