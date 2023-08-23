/// <reference types="@tiptap/extension-highlight" />
import { BorderColor } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
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
      // Note that MUI does not expose a "highlight color" icon, so BorderColor
      // is the next best option
      IconComponent={BorderColor}
      tooltipLabel="Highlight"
      tooltipShortcutKeys={["mod", "Shift", "H"]}
      selected={editor?.isActive("highlight") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleHighlight()}
      onClick={() => editor?.chain().focus().toggleHighlight().run()}
      {...menuButtonProps}
    />
  );
}
