/**
 * Class names that can be used for targeting specific components to override
 * styles.
 */
const classNames = {
  RichTextContent: "RichTextContent",
  MuiTiptapMenuBar: "MuiTiptapMenuBar",
  MuiTiptapMenuBarContainer: "MuiTiptapMenuBarContainer",
  RichTextField: "RichTextField",
} as const;

// TODO(Steven DeMartini): Support "slots" for these in the same way as MUI
// does, like RichTextField-root, RichTextField-menuBarSticky, etc.

export default classNames;
