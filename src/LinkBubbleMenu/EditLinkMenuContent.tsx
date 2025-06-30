import { Button, DialogActions, TextField, Typography } from "@mui/material";
import { getMarkRange, getMarkType, type Editor } from "@tiptap/core";
import { useEffect, useRef, useState, type ReactNode } from "react";
import useKeyDown from "../hooks/useKeyDown";
import { formatHref as formatHrefDefault } from "../utils/links";

export type EditLinkMenuContentProps = {
  editor: Editor;
  onCancel: () => void;
  onSave: ({ text, link }: { text: string; link: string }) => void;
  /**
   * Function to format the `href` value the user entered for the link, when a
   * user has finished typing (`onBlur` or when pressing Enter). Takes in the
   * user-entered input value and returns the formatted value.
   *
   * If not provided, the default behavior:
   *  - trims leading/trailing whitespace
   *  - ensures the value has a protocol (http://) if it doesn't already, unless
   *    it's a relative URL (starting with "/") or anchor (starting with "#")
   *  - URL-encodes the result
   */
  formatHref?: (value: string) => string;
  /** Override default text content/labels used within the component. */
  labels?: {
    /** Menu title shown when adding a new link. */
    editLinkAddTitle?: ReactNode;
    /** Menu title shown when editing an existing link. */
    editLinkEditTitle?: ReactNode;
    /** Label for the input text field to edit the text content of a link. */
    editLinkTextInputLabel?: ReactNode;
    /** Label for the input text field to edit the href (URL) of a link. */
    editLinkHrefInputLabel?: ReactNode;
    /** Content shown in the button used to cancel editing/adding a link. */
    editLinkCancelButtonLabel?: ReactNode;
    /** Content shown in the button used to save when editing/adding a link. */
    editLinkSaveButtonLabel?: ReactNode;
  };
};

/** Shown when a user is adding/editing a Link for Tiptap. */
export default function EditLinkMenuContent({
  editor,
  onCancel,
  onSave,
  labels,
  formatHref = formatHrefDefault,
}: EditLinkMenuContentProps) {
  const existingHref = editor.isActive("link")
    ? (editor.getAttributes("link").href as string)
    : "";
  const linkRange = getMarkRange(
    editor.state.selection.$from,
    getMarkType("link", editor.schema),
  );
  const linkText = linkRange
    ? editor.state.doc.textBetween(linkRange.from, linkRange.to)
    : "";

  const selectedText = editor.state.doc.textBetween(
    editor.state.selection.$from.pos,
    editor.state.selection.$to.pos,
  );

  // If we're on a link, we'll use the full link text, otherwise we'll fall back
  // to the selected text
  const initialText = linkText || selectedText;

  const [textValue, setTextValue] = useState(initialText);
  const [hrefValue, setHrefValue] = useState(existingHref);

  const textRef = useRef<HTMLInputElement | null>(null);
  const hrefRef = useRef<HTMLInputElement | null>(null);

  // If there's already a link where the user has clicked, they're "editing",
  // otherwise the menu has been brought up to add a new link
  const isNewLink = !existingHref;
  const addLinkTitle = labels?.editLinkAddTitle ?? "Add link";
  const editLinkTitle = labels?.editLinkEditTitle ?? "Edit link";
  const editMenuTitle = isNewLink ? addLinkTitle : editLinkTitle;

  // When bringing up the Popper of the `ControlledBubbleMenu` and using
  // autoFocus on the TextField elements, it is causing a scroll jump as
  // described here https://github.com/mui-org/material-ui/issues/16740. (It
  // seems the fix that was merged for that has since been undone, as the popper
  // styles now using `absolute` positioning again.) So we'll focus on the
  // appropriate input with `useEffect` below instead.
  useEffect(() => {
    // We'll auto-focus on the text input if (a) it's not a new link, or (b)
    // it's a new link and they do not have some initial text already (e.g.,
    // they brought up the link menu with some text selected already). Otherwise
    // well focus on the href input.
    const autoFocusOnTextInput = !isNewLink || !initialText;
    if (autoFocusOnTextInput) {
      textRef.current?.focus({ preventScroll: true });
    } else {
      hrefRef.current?.focus({ preventScroll: true });
    }
  }, [isNewLink, initialText]);

  // If the user presses escape, we should cancel
  useKeyDown("Escape", onCancel);

  function formatAndSetHref() {
    if (!hrefRef.current) {
      return;
    }
    setHrefValue(formatHref(hrefRef.current.value));
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        // Don't submit the form with a standard full-page request
        event.preventDefault();
        // Don't let this event propagate upwards in the React tree, to prevent
        // submitting any form the rich text editor is wrapped in
        // (https://github.com/sjdemartini/mui-tiptap/issues/105)
        event.stopPropagation();

        setIsSubmitting(true);
        const text = textRef.current?.value ?? "";
        const href = hrefRef.current?.value ?? "";
        onSave({ text: text, link: href });
        setIsSubmitting(false);
      }}
      autoComplete="off"
    >
      <Typography variant="h6">{editMenuTitle}</Typography>

      <TextField
        inputRef={textRef}
        value={textValue}
        disabled={isSubmitting}
        onChange={(event) => {
          setTextValue(event.target.value);
        }}
        label={labels?.editLinkTextInputLabel ?? "Text"}
        margin="normal"
        size="small"
        fullWidth
        required
      />

      <TextField
        inputRef={hrefRef}
        value={hrefValue}
        onChange={(event) => {
          setHrefValue(event.target.value);
        }}
        disabled={isSubmitting}
        label={labels?.editLinkHrefInputLabel ?? "Link"}
        margin="dense"
        size="small"
        type="text" // "text" instead of "url" so that we can allow relative URLs
        onBlur={formatAndSetHref}
        onKeyDown={(event) => {
          // If the user is trying to submit the form directly from the href field, make
          // sure we first format what they entered (which will update it to allow it to
          // pass URL field validation)
          if (event.key === "Enter") {
            formatAndSetHref();
          }
        }}
        fullWidth
        required
      />

      <DialogActions sx={{ px: 0 }}>
        <Button onClick={onCancel} variant="outlined" size="small">
          {labels?.editLinkCancelButtonLabel ?? "Cancel"}
        </Button>

        <Button
          type="submit"
          color="primary"
          variant="outlined"
          size="small"
          disabled={isSubmitting}
        >
          {labels?.editLinkSaveButtonLabel ?? "Save"}
        </Button>
      </DialogActions>
    </form>
  );
}
