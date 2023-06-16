import { Button, DialogActions, Link } from "@mui/material";
import { getMarkRange, getMarkType, type Editor } from "@tiptap/core";
import truncate from "lodash/truncate";
import { makeStyles } from "tss-react/mui";
import useKeyDown from "../hooks/useKeyDown";
import truncateMiddle from "../utils/truncateMiddle";

type Props = {
  editor: Editor;
  onCancel: () => void;
  onEdit: () => void;
  onRemove: () => void;
};

const useStyles = makeStyles({ name: { ViewLinkMenuContent } })({
  linkPreviewText: {
    overflowWrap: "anywhere",
  },
});

/** Shown when a user is viewing the details of an existing a Link for Tiptap. */
export default function ViewLinkMenuContent({
  editor,
  onCancel,
  onEdit,
  onRemove,
}: Props) {
  const { classes } = useStyles();
  const linkRange = getMarkRange(
    editor.state.selection.$to,
    getMarkType("link", editor.schema)
  );
  const linkText = linkRange
    ? editor.state.doc.textBetween(linkRange.from, linkRange.to)
    : "";

  const currentHref =
    (editor.getAttributes("link").href as string | undefined) ?? "";

  // If the user presses escape, we should cancel
  useKeyDown("Escape", onCancel);

  return (
    <>
      <div className={classes.linkPreviewText}>
        {truncate(linkText, {
          length: 50,
          omission: "…",
        })}
      </div>

      <div className={classes.linkPreviewText}>
        <Link href={currentHref} target="_blank" rel="noopener">
          {/* We truncate in the middle, since the beginning and end of a URL are often the most
            important parts */}
          {truncateMiddle(currentHref, 50)}
        </Link>
      </div>

      <DialogActions sx={{ px: 0 }}>
        <Button
          onClick={onEdit}
          color="primary"
          variant="outlined"
          size="small"
        >
          Edit
        </Button>
        <Button
          onClick={onRemove}
          color="error"
          variant="outlined"
          size="small"
        >
          Remove
        </Button>
      </DialogActions>
    </>
  );
}
