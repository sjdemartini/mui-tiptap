/**
 * Class names that can be used for targeting specific components to override
 * styles.
 */
const classNames = {
  MuiTiptapContent: "MuiTiptapContent",
  MuiTiptapMenuBar: "MuiTiptapMenuBar",
  MuiTiptapMenuBarContainer: "MuiTiptapMenuBarContainer",
  MuiTiptapOutlinedField: "MuiTiptapOutlinedField",
} as const;

// TODO(Steven DeMartini): Support "slots" for these in the same way as MUI
// does, like MuiTiptapOutlinedField-root, MuiTiptapOutlinedField-menuBarSticky,
// etc.

export default classNames;
