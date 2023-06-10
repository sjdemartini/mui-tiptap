/**
 * Class names that can be used for targeting specific components to override
 * styles.
 */
const classNames = {
  RichTextContent: "RichTextContent",
  MuiTiptapMenuBar: "MuiTiptapMenuBar",
  MuiTiptapMenuBarContainer: "MuiTiptapMenuBarContainer",
  RichTextOutlinedField: "RichTextOutlinedField",
} as const;

// TODO(Steven DeMartini): Support "slots" for these in the same way as MUI
// does, like RichTextOutlinedField-root, RichTextOutlinedField-menuBarSticky,
// etc.

export default classNames;
