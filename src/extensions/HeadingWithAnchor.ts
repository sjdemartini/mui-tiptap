import { Heading } from "@tiptap/extension-heading";
import { ReactNodeViewRenderer } from "@tiptap/react";
import HeadingWithAnchorComponent from "./HeadingWithAnchorComponent";

const HeadingWithAnchor = Heading.extend({
  // Although we could render this using just HTML presumably (via `renderHTML`)
  // and don't need any fancy interaction with React, doing so allows us to use
  // a MUI SVG icon as well as MUI styling
  addNodeView() {
    return ReactNodeViewRenderer(HeadingWithAnchorComponent);
  },
});

export default HeadingWithAnchor;
