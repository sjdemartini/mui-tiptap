import { Link as LinkIcon } from "@mui/icons-material";
import {
  NodeViewProps,
  getText,
  getTextSerializersFromSchema,
} from "@tiptap/core";
import { Heading, Level } from "@tiptap/extension-heading";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import slugify from "../utils/slugify";

// Based on
// https://github.com/ueberdosis/tiptap/blob/c9eb6a6299796450c7c1cfdc3552d76070c78c65/packages/extension-heading/src/heading.ts#L41-L48
type HeadingNodeAttributes = {
  level: Level;
};

interface HeadingNode extends ProseMirrorNode {
  attrs: HeadingNodeAttributes;
}

interface Props extends NodeViewProps {
  node: HeadingNode;
  extension: typeof Heading;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
    // Reference the "link" rule name defined below so that when the header
    // is hovered over, we make the anchor link visible.
    "&:hover $link": {
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

function HeadingWithAnchorComponent({ editor, node, extension }: Props) {
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

export default HeadingWithAnchorComponent;
