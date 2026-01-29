import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Link from "@mui/material/Link";
import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import { getMarkRange, getMarkType, type Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { clsx } from "clsx";
import truncate from "es-toolkit/compat/truncate";
import type { ReactNode } from "react";
import useKeyDown from "../hooks/useKeyDown";
import { getUtilityComponentName } from "../styles";
import truncateMiddle from "../utils/truncateMiddle";
import {
  viewLinkMenuContentClasses,
  type ViewLinkMenuContentClassKey,
  type ViewLinkMenuContentClasses,
} from "./ViewLinkMenuContent.classes";

export type ViewLinkMenuContentProps = {
  editor: Editor;
  onCancel: () => void;
  onEdit: () => void;
  onRemove: () => void;
  /** Override default text content/labels used within the component. */
  labels?: {
    /** Content shown in the button used to start editing the link. */
    viewLinkEditButtonLabel?: ReactNode;
    /** Content shown in the button used to remove the link. */
    viewLinkRemoveButtonLabel?: ReactNode;
  };
  /** Override or extend existing styles. */
  classes?: Partial<ViewLinkMenuContentClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
};

const componentName = getUtilityComponentName("ViewLinkMenuContent");

const ViewLinkMenuContentRoot = styled("div", {
  name: componentName,
  slot: "root" satisfies ViewLinkMenuContentClassKey,
  overridesResolver: (props, styles) => styles.root,
})({});

const ViewLinkMenuContentLinkPreviewText = styled("div", {
  name: componentName,
  slot: "linkPreviewText" satisfies ViewLinkMenuContentClassKey,
  overridesResolver: (props, styles) => styles.linkPreviewText,
})({
  overflowWrap: "anywhere",
});

/** Shown when a user is viewing the details of an existing Link for Tiptap. */
export default function ViewLinkMenuContent(inProps: ViewLinkMenuContentProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    editor,
    onCancel,
    onEdit,
    onRemove,
    labels,
    classes = {},
    sx,
  } = props;

  const { linkText, currentHref } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => {
      const linkRange = getMarkRange(
        editorSnapshot.state.selection.$to,
        getMarkType("link", editorSnapshot.schema),
      );
      return {
        linkText: linkRange
          ? editorSnapshot.state.doc.textBetween(linkRange.from, linkRange.to)
          : "",
        currentHref:
          (editorSnapshot.getAttributes("link").href as string | undefined) ??
          "",
      };
    },
  });

  // If the user presses escape, we should cancel
  useKeyDown("Escape", onCancel);

  return (
    <ViewLinkMenuContentRoot
      className={clsx([viewLinkMenuContentClasses.root, classes.root])}
      sx={sx}
    >
      <ViewLinkMenuContentLinkPreviewText
        className={clsx([
          viewLinkMenuContentClasses.linkPreviewText,
          classes.linkPreviewText,
        ])}
      >
        {truncate(linkText, {
          length: 50,
          omission: "…",
        })}
      </ViewLinkMenuContentLinkPreviewText>

      <ViewLinkMenuContentLinkPreviewText
        className={clsx([
          viewLinkMenuContentClasses.linkPreviewText,
          classes.linkPreviewText,
        ])}
      >
        <Link href={currentHref} target="_blank" rel="noopener">
          {/* We truncate in the middle, since the beginning and end of a URL are often the most
            important parts */}
          {truncateMiddle(currentHref, 50)}
        </Link>
      </ViewLinkMenuContentLinkPreviewText>

      <DialogActions sx={{ px: 0 }}>
        <Button
          onClick={onEdit}
          color="primary"
          variant="outlined"
          size="small"
        >
          {labels?.viewLinkEditButtonLabel ?? "Edit"}
        </Button>
        <Button
          onClick={onRemove}
          color="error"
          variant="outlined"
          size="small"
        >
          {labels?.viewLinkRemoveButtonLabel ?? "Remove"}
        </Button>
      </DialogActions>
    </ViewLinkMenuContentRoot>
  );
}
