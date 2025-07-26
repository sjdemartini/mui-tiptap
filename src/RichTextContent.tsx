import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import { EditorContent, type EditorContentProps } from "@tiptap/react";
import { clsx } from "clsx";
import { useMemo } from "react";
import {
  richTextContentClasses,
  type RichTextContentClassKey,
  type RichTextContentClasses,
} from "./RichTextContent.classes";
import { useRichTextEditorContext } from "./context";
import { getComponentName, getEditorStyles } from "./styles";

export type RichTextContentProps = {
  /** Optional ref to provide to the EditorContent DOM element. */
  innerRef?: EditorContentProps["innerRef"];
  /**
   * Whether to disable all default styles applied to the rich text content.
   *
   * Useful if you want to apply your own styles instead, or simply inherit
   * external page styles.
   *
   * Warning: several utility styles will also be omitted if you disable default
   * styles. (For instance, these handle table editability, displaying content
   * from the Placeholder extension, etc. such as the styles here:
   * https://github.com/sjdemartini/mui-tiptap/blob/7c94b6860a66835c35b9a7a5994fa773202654ac/src/styles.ts#L370-L417.)
   * You may need to add equivalent CSS back yourself depending on the
   * extensions you use.
   */
  disableDefaultStyles?: boolean;
  /** Optional additional className to provide to the root element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<RichTextContentClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
};

interface RichTextContentOwnerState
  extends Pick<RichTextContentProps, "disableDefaultStyles"> {
  editable: boolean;
}

const componentName = getComponentName("RichTextContent");

const RichTextContentRoot = styled(EditorContent, {
  name: componentName,
  slot: "root" satisfies RichTextContentClassKey,
  overridesResolver: (
    props: { ownerState: RichTextContentOwnerState },
    styles,
  ) => [
    styles.root,
    props.ownerState.editable ? styles.editable : styles.readonly,
  ],
})<{ ownerState: RichTextContentOwnerState }>(({ theme, ownerState }) =>
  ownerState.disableDefaultStyles
    ? {}
    : {
        "& .ProseMirror": { ...getEditorStyles(theme) },
      },
);

/**
 * A component for rendering a MUI-styled version of Tiptap rich text editor
 * content.
 *
 * Must be a child of the RichTextEditorProvider so that the `editor` context is
 * available.
 */
export default function RichTextContent(inProps: RichTextContentProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    innerRef,
    className,
    classes = {},
    disableDefaultStyles = false,
    sx,
  } = props;

  const editor = useRichTextEditorContext();
  const editable = !!editor?.isEditable;

  const ownerState: RichTextContentOwnerState = {
    editable,
    disableDefaultStyles,
  };

  const editorClasses = useMemo(
    () =>
      clsx([
        richTextContentClasses.root,
        className,
        classes.root,
        editable
          ? [richTextContentClasses.editable, classes.editable]
          : [richTextContentClasses.readonly, classes.readonly],
      ]),
    [className, classes.root, classes.editable, classes.readonly, editable],
  );

  return (
    <RichTextContentRoot
      editor={editor}
      innerRef={innerRef}
      ownerState={ownerState}
      className={editorClasses}
      sx={sx}
    />
  );
}
