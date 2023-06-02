/**
 * Class names that can be used for targeting specific components to override
 * styles.
 */
const classNames = {
  MuiTiptapContent: "MuiTiptapContent",
  MuiTiptapOutlinedField: "MuiTiptapOutlinedField",
  MuiTiptapMenuBar: "MuiTiptapEditorMenuBar",
  MuiTiptapMenuBarContainer: "MuiTiptapMenuBarContainer",
} as const;

// TODO(Steven DeMartini): Support "slots" for these in the same way as MUI
// does, like MuiTiptapOutlinedField-root, MuiTiptapOutlinedField-menuBarSticky,
// etc.

export default classNames;
