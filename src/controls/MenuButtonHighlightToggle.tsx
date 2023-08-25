/// <reference types="@tiptap/extension-highlight" />
import { useRichTextEditorContext } from "../context";
import { FormatInkHighlighter } from "../icons";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonHighlightToggleProps = Partial<MenuButtonProps>;

/**
 * Control for a user to toggle text highlighting with the
 * @tiptap/extension-highlight, just using the default `<mark>`
 * background-color.
 *
 * This is typically useful when using the default Highlight extension
 * configuration (*not* configuring with `mulitcolor: true`). See
 * MenuButtonHighlightColor for a multicolor-oriented color-selection highlight
 * control.
 */
export default function MenuButtonHighlightToggle({
  ...menuButtonProps
}: MenuButtonHighlightToggleProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      IconComponent={FormatInkHighlighter}
      tooltipLabel="Highlight"
      tooltipShortcutKeys={["mod", "Shift", "H"]}
      selected={editor?.isActive("highlight") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleHighlight()}
      onClick={() => editor?.chain().focus().toggleHighlight().run()}
      {...menuButtonProps}
    />
  );
}
