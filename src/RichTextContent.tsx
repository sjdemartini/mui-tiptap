import { Box } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { useMemo } from "react";
import type { CSSObject } from "tss-react";
import { makeStyles } from "tss-react/mui";
import { useRichTextEditorContext } from "./context";
import { getEditorStyles, getUtilityClasses } from "./styles";

export type RichTextContentClasses = ReturnType<typeof useStyles>["classes"];

export type RichTextContentProps = {
  /** Optional additional className to provide to the root element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<RichTextContentClasses>;
};

const richTextContentClasses: RichTextContentClasses = getUtilityClasses(
  "RichTextContent",
  ["root", "readonly", "editable"]
);

const useStyles = makeStyles({ name: { RichTextContent } })((theme) => {
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
    readonly: {},

    // Styles applied when the editor is editable (editable=true)
    editable: {},
  };
});

/**
 * A component for rendering a MUI-styled version of Tiptap rich text editor
 * content.
 *
 * Must be a child of the RichTextEditorProvider so that the `editor` context is
 * available.
 */
export default function RichTextContent({
  className,
  classes: overrideClasses = {},
}: RichTextContentProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });
  const editor = useRichTextEditorContext();
  const editorClasses = useMemo(
    () =>
      cx(
        richTextContentClasses.root,
        className,
        classes.root,
        editor?.isEditable
          ? [richTextContentClasses.editable, classes.editable]
          : [richTextContentClasses.readonly, classes.readonly]
      ),
    [className, classes, cx, editor?.isEditable]
  );

  return (
    <Box className={editorClasses} component={EditorContent} editor={editor} />
  );
}
