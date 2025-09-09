import LinkIcon from "@mui/icons-material/Link";
import { styled, useThemeProps, type SxProps } from "@mui/material";
import {
  getText,
  getTextSerializersFromSchema,
  type NodeViewProps,
} from "@tiptap/core";
import type { Heading, Level } from "@tiptap/extension-heading";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { clsx } from "clsx";
import { useMemo } from "react";
import { getUtilityComponentName } from "../styles";
import slugify from "../utils/slugify";
import {
  headingWithAnchorComponentClasses,
  type HeadingWithAnchorComponentClassKey,
  type HeadingWithAnchorComponentClasses,
} from "./HeadingWithAnchorComponent.classes";

// Based on
// https://github.com/ueberdosis/tiptap/blob/c9eb6a6299796450c7c1cfdc3552d76070c78c65/packages/extension-heading/src/heading.ts#L41-L48
// We extend Record<string, unknown>, since we may inherit other global
// attributes as well, aligned with ProseMirrorNode.attrs typing.
export interface HeadingNodeAttributes extends Record<string, unknown> {
  level: Level;
}

interface HeadingNode extends ProseMirrorNode {
  attrs: HeadingNodeAttributes;
}

export interface HeadingWithAnchorComponentProps extends NodeViewProps {
  node: HeadingNode;
  extension: typeof Heading;
  /** Override or extend existing styles. */
  classes?: Partial<HeadingWithAnchorComponentClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
}

const componentName = getUtilityComponentName("HeadingWithAnchorComponent");

const HeadingWithAnchorComponentRoot = styled(NodeViewWrapper, {
  name: componentName,
  slot: "root" satisfies HeadingWithAnchorComponentClassKey,
  overridesResolver: (props, styles) => styles.root,
  // Unlike default behavior of `styled`, allow the 'as' prop be forwarded to
  // NodeViewWrapper, which itself supports `as`. Otherwise providing `as` will
  // sidestep using NodeViewWrapper altogether.
  shouldForwardProp: (prop) =>
    prop !== "ownerState" && prop !== "theme" && prop !== "sx",
})({
  // Reference the "link" class defined below so that when the header is
  // hovered over, we make the anchor link visible.
  [`&:hover .${headingWithAnchorComponentClasses.link}`]: {
    opacity: 100,
  },
});

const HeadingWithAnchorComponentContainer = styled("span", {
  name: componentName,
  slot: "container" satisfies HeadingWithAnchorComponentClassKey,
  overridesResolver: (props, styles) => styles.container,
})({
  // Use inline-block so that the container is only as big as the inner
  // heading content
  display: "inline-block",
  // Use relative position so that the link is positioned relative to
  // the inner heading content position (via this common container)
  position: "relative",
});

const HeadingWithAnchorComponentLink = styled("a", {
  name: componentName,
  slot: "link" satisfies HeadingWithAnchorComponentClassKey,
  overridesResolver: (props, styles) => styles.link,
})(({ theme }) => ({
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

  // As described here https://github.com/ueberdosis/tiptap/issues/3775,
  // updates to editor isEditable do not trigger re-rendering of node views.
  // Even editor state changes external to a given ReactNodeView component
  // will not trigger re-render (which is probably a good thing most of the
  // time, in terms of performance). As such, we always render the link in the
  // DOM, but hide it with CSS when the editor is editable.
  '.ProseMirror[contenteditable="true"] &': {
    display: "none",
  },
}));

const HeadingWithAnchorComponentLinkIcon = styled(LinkIcon, {
  name: componentName,
  slot: "linkIcon" satisfies HeadingWithAnchorComponentClassKey,
  overridesResolver: (props, styles) => styles.linkIcon,
})(({ theme }) => ({
  // Looks better to have at an angle, similar to the GitHub icon
  transform: "rotate(-45deg)",

  fontSize: "1.25rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.15rem",
  },
}));

export default function HeadingWithAnchorComponent(
  inProps: HeadingWithAnchorComponentProps,
) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const { editor, node, extension, classes = {}, sx } = props;

  // Some of the logic here is based on the renderHTML definition from the
  // original Heading Node
  // (https://github.com/ueberdosis/tiptap/blob/c9eb6a6299796450c7c1cfdc3552d76070c78c65/packages/extension-heading/src/heading.ts#L58-L65)
  const hasLevel = extension.options.levels.includes(node.attrs.level);
  const level = hasLevel ? node.attrs.level : extension.options.levels[0];
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
  // Create an anchor ID based on the text content of the header (like
  // GitHub/GitLab do). Note that we use Tiptap's `getText` rather than
  // `node.textContent` so that nodes like Mentions can produce text for this
  // purpose (see https://github.com/ueberdosis/tiptap/pull/1875 and
  // https://github.com/ueberdosis/tiptap/issues/1336 for instance)
  const textSerializers = useMemo(
    () => getTextSerializersFromSchema(editor.schema),
    [editor.schema],
  );
  const headingId = slugify(
    getText(node, {
      textSerializers: textSerializers,
    }),
  );

  return (
    <HeadingWithAnchorComponentRoot
      as={HeadingTag}
      id={headingId}
      {...extension.options.HTMLAttributes}
      className={clsx([headingWithAnchorComponentClasses.root, classes.root])}
      // Handle @tiptap/extension-text-align. Ideally we'd be able to inherit
      // this style from TextAlign's GlobalAttributes directly, but those are
      // only applied via `renderHTML` and not the `NodeView` renderer
      // (https://github.com/ueberdosis/tiptap/blob/6c34dec33ac39c9f037a0a72e4525f3fc6d422bf/packages/extension-text-align/src/text-align.ts#L43-L49),
      // so we have to do this manually/redundantly here.
      style={{ textAlign: node.attrs.textAlign }}
      sx={sx}
    >
      {/* We need a separate inner container here in order to (1) have the node
      view wrapper take up the full width of its parent div created by
      ReactNodeViewRender (so we can utilize text-align for its children
      elements), and (2) position the anchor link/icon relative to the *aligned*
      position of the inner text content, by having this inner container match
      the dimensions and location of the its content. */}
      <HeadingWithAnchorComponentContainer
        className={clsx([
          headingWithAnchorComponentClasses.container,
          classes.container,
        ])}
      >
        <HeadingWithAnchorComponentLink
          href={`#${headingId}`}
          contentEditable={false}
          className={clsx([
            headingWithAnchorComponentClasses.link,
            classes.link,
          ])}
        >
          <HeadingWithAnchorComponentLinkIcon
            className={clsx([
              headingWithAnchorComponentClasses.linkIcon,
              classes.linkIcon,
            ])}
          />
        </HeadingWithAnchorComponentLink>
        {/* This is the editable content of the header: */}
        <NodeViewContent<"span"> as="span" />
      </HeadingWithAnchorComponentContainer>
    </HeadingWithAnchorComponentRoot>
  );
}
