import { Link as LinkIcon } from "@mui/icons-material";
import type { NodeViewProps } from "@tiptap/core";
import { getText, getTextSerializersFromSchema } from "@tiptap/core";
import type { Heading, Level } from "@tiptap/extension-heading";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import slugify from "../utils/slugify";

// Based on
// https://github.com/ueberdosis/tiptap/blob/c9eb6a6299796450c7c1cfdc3552d76070c78c65/packages/extension-heading/src/heading.ts#L41-L48
// We extend Record<string, unknown>, since we may inherit other global
// attributes as well, aligned with ProseMirrorNode.attrs typing.
interface HeadingNodeAttributes extends Record<string, unknown> {
  level: Level;
}

interface HeadingNode extends ProseMirrorNode {
  attrs: HeadingNodeAttributes;
}

interface Props extends NodeViewProps {
  node: HeadingNode;
  extension: typeof Heading;
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const useStyles = makeStyles<void, "link">({
  name: { HeadingWithAnchorComponent },
  uniqId: "kNc4LD", // https://docs.tss-react.dev/nested-selectors#ssr
})((theme, _params, classes) => ({
  root: {
    position: "relative",
    // Reference the "link" class defined below so that when the header is
    // hovered over, we make the anchor link visible.
    [`&:hover .${classes.link}`]: {
      opacity: 100,
    },
  },

  link: {
    position: "absolute",
    left: -21,
    color: `${theme.palette.text.secondary} !important`,
    opacity: 0, // This is changed by the root hover above
    transition: theme.transitions.create("opacity"),
    textDecoration: "none",
    outline: "none",

    [theme.breakpoints.down("sm")]: {
      left: -18,
    },
  },

  icon: {
    // Looks better to have at an angle, similar to the GitHub icon
    transform: "rotate(-45deg)",

    fontSize: "1.25rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.15rem",
    },
  },
}));

export default function HeadingWithAnchorComponent({
  editor,
  node,
  extension,
}: Props) {
  const { classes } = useStyles();
  // Some of the logic here is based on the renderHTML definition from the
  // original Heading Node
  // (https://github.com/ueberdosis/tiptap/blob/c9eb6a6299796450c7c1cfdc3552d76070c78c65/packages/extension-heading/src/heading.ts#L58-L65)
  const hasLevel = extension.options.levels.includes(node.attrs.level);
  const level = hasLevel ? node.attrs.level : extension.options.levels[0];
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  // Create an anchor ID based on the text content of the header (like
  // GitHub/GitLab do). Note that we use Tiptap's `getText` rather than
  // `node.textContent` so that nodes like Mentions can produce text for this
  // purpose (see https://github.com/ueberdosis/tiptap/pull/1875 and
  // https://github.com/ueberdosis/tiptap/issues/1336 for instance)
  const textSerializers = useMemo(
    () => getTextSerializersFromSchema(editor.schema),
    [editor.schema]
  );
  const headingId = slugify(
    getText(node, {
      textSerializers: textSerializers,
    })
  );

  return (
    <NodeViewWrapper
      as={HeadingTag}
      id={headingId}
      {...extension.options.HTMLAttributes}
      className={classes.root}
      // Handle @tiptap/extension-text-align. Ideally we'd be able to inherit
      // this style from TextAlign's GlobalAttributes directly, but those are
      // only applied via `renderHTML` and not the `NodeView` renderer
      // (https://github.com/ueberdosis/tiptap/blob/6c34dec33ac39c9f037a0a72e4525f3fc6d422bf/packages/extension-text-align/src/text-align.ts#L43-L49),
      // so we have to do this manually/redundantly here.
      style={{ textAlign: node.attrs.textAlign }}
    >
      {/* Only render the clickable anchor element when in read-only mode (not editing) */}
      {!editor.isEditable && (
        <a
          href={`#${headingId}`}
          contentEditable={false}
          className={classes.link}
        >
          <LinkIcon className={classes.icon} />
        </a>
      )}
      {/* This is the editable content of the header */}
      <NodeViewContent as="span" />
    </NodeViewWrapper>
  );
}
