/**
 * Class names that can be used for targeting specific components to override
 * styles.
 */
const classNames = {
  MenuBar: "MenuBar",
  RichTextContent: "RichTextContent",
  RichTextField: "RichTextField",
} as const;

// TODO(Steven DeMartini): Prefix all of these class-name selectors with
// "MuiTiptap-" when adding them to components (somewhat similar to what MUI and
// Mantine both do), to avoid clashing with any end users' classes

// TODO(Steven DeMartini): Support "slots" for these in the same way as MUI
// does, like RichTextField-root, RichTextField-outlined,
// RichTextField-standard, RichTextField-menuBarSticky, etc.

export default classNames;
