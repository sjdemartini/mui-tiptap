import { Button, DialogActions, TextField, Typography } from "@mui/material";
import { getMarkRange, getMarkType, type Editor } from "@tiptap/core";
import encodeurl from "encodeurl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import useKeyDown from "../hooks/useKeyDown";

export type EditLinkMenuContentProps = {
  editor: Editor;
  onCancel: () => void;
  onSave: ({ text, link }: { text: string; link: string }) => void;
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
}: EditLinkMenuContentProps) {
  const existingHref = editor.isActive("link")
    ? (editor.getAttributes("link").href as string)
    : "";
  const linkRange = getMarkRange(
    editor.state.selection.$from,
    getMarkType("link", editor.schema)
  );
  const linkText = linkRange
    ? editor.state.doc.textBetween(linkRange.from, linkRange.to)
    : "";

  const selectedText = editor.state.doc.textBetween(
    editor.state.selection.$from.pos,
    editor.state.selection.$to.pos
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
      textRef.current?.focus();
    } else {
      hrefRef.current?.focus();
    }
  }, [isNewLink, initialText]);

  // If the user presses escape, we should cancel
  useKeyDown("Escape", onCancel);

  const formatHref = useCallback(() => {
    if (!hrefRef.current) {
      return;
    }

    // Parse what the user typed in, and add a protocol if they typed in a value
    // but didn't include a protocol. (This also includes mailto and tel, since
    // they are also valid for `href`
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href and
    // Tiptap has builtin autolink support for email address conversion to
    // mailto.) This is what Slack does, and seems like a reasonable behavior to
    // ensure it's a valid URL (e.g. if someone types "example.com", we should
    // accept it and treat it as "http://example.com", not a relative path on the
    // current site). It also allows the value to pass browser-builtin
    // `type="url"` validation.
    let currentHrefValue = hrefRef.current.value.trim();
    if (
      currentHrefValue &&
      !currentHrefValue.startsWith("http://") &&
      !currentHrefValue.startsWith("https://") &&
      !currentHrefValue.startsWith("mailto:") &&
      !currentHrefValue.startsWith("tel:")
    ) {
      currentHrefValue = `http://${currentHrefValue}`;
    }
    // URL-encode any characters that wouldn't be valid. We use `encodeurl`
    // instead of the builtin `encodeURI` so that if there are any
    // already-encoded sequences, they're not double-encoded and thus broken.
    // (Useful for instance when a user pastes a URL into the form with complex
    // and already-encoded parameters.)
    setHrefValue(encodeurl(currentHrefValue));
  }, []);

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
        onChange={(event) => setTextValue(event.target.value)}
        label={labels?.editLinkTextInputLabel ?? "Text"}
        margin="normal"
        size="small"
        fullWidth
        required
      />

      <TextField
        inputRef={hrefRef}
        value={hrefValue}
        onChange={(event) => setHrefValue(event.target.value)}
        disabled={isSubmitting}
        label={labels?.editLinkHrefInputLabel ?? "Link"}
        margin="dense"
        size="small"
        type="url"
        onBlur={formatHref}
        onKeyDown={(event) => {
          // If the user is trying to submit the form directly from the href field, make
          // sure we first format what they entered (which will update it to allow it to
          // pass URL field validation)
          if (event.key === "Enter") {
            formatHref();
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
