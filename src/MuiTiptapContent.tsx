import { Box } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { useMemo } from "react";
import type { CSSObject } from "tss-react";
import { makeStyles } from "tss-react/mui";
import LinkBubbleMenu from "./LinkBubbleMenu";
import TableBubbleMenu from "./TableBubbleMenu";
import classNames from "./classNames";
import { useMuiTiptapEditorContext } from "./context";
import { getEditorStyles } from "./styles";

export type MuiTiptapContentProps = {
  /** Optional additional className to provide to the root element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

const useStyles = makeStyles({ name: { MuiTiptapContent } })((theme) => {
  return {
    root: {
      // We add `as CSSObject` to get around typing issues with our editor
      // styles function. For future reference, this old issue and its solution
      // are related, though not quite right
      // https://github.com/garronej/tss-react/issues/2
      // https://github.com/garronej/tss-react/commit/9dc3f6f9f70b6df0bd83cd5689c3313467fb4f06
      "& .ProseMirror": {
        ...getEditorStyles(theme),
      } as CSSObject,
    },

    // Styles applied when the editor is in read-only mode (editable=false)
    readonly: {
      "& .ProseMirror": {
        // When in read-only mode, don't allow users to resize tables, by hiding
        // the resize handle and cursor
        "& .column-resize-handle": {
          display: "none",
        },
        "&.resize-cursor": {
          display: "none",
        },
      },
    },

    // Styles applied when the editor is editable (editable=true)
    editable: {},
  };
});

/**
 * A component for rendering a MUI-styled version of Tiptap rich text editor
 * content.
 *
 * Must be used as a child of the MuiTiptapProvider.
 */
export default function MuiTiptapContent({
  className,
  classes: overrideClasses = {},
}: MuiTiptapContentProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });
  const editor = useMuiTiptapEditorContext();
  const editorClasses = useMemo(
    () =>
      cx(
        classNames.MuiTiptapContent,
        className,
        classes.root,
        editor?.isEditable ? classes.editable : classes.readonly
      ),
    [className, classes, cx, editor?.isEditable]
  );

  return (
    <Box className={editorClasses} component={EditorContent} editor={editor}>
      {editor?.isEditable && (
        <>
          {"link" in editor.storage &&
            "linkBubbleMenuHandler" in editor.storage && (
              <LinkBubbleMenu editor={editor} />
            )}

          {"table" in editor.storage && <TableBubbleMenu editor={editor} />}
        </>
      )}
    </Box>
  );
}
