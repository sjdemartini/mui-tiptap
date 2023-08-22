/// <reference types="@tiptap/extension-highlight" />
import { BorderColor } from "@mui/icons-material";
import { useRichTextEditorContext } from "..";
import {
  MenuButtonColorPicker,
  type MenuButtonColorPickerProps,
} from "./MenuButtonColorPicker";

export interface MenuButtonHighlightColorProps
  extends Partial<MenuButtonColorPickerProps> {
  /**
   * Shows this as the current highlight color (in the color picker) if a
   * highlight is active for the selected editor text but no specific color was
   * specified for it.
   *
   * The Tiptap Highlight extension uses HTML `<mark>` elements, so this default
   * color should be chosen based on any styling applied to mark
   * background-color on your page.
   *
   * This prop is set to "#ffff00" (yellow) by default, as this is what most
   * browsers will show, per the W3 spec defaults
   * https://stackoverflow.com/a/34969133/4543977.
   */
  defaultMarkColor?: string;
}

/**
 * Control for a user to choose a text highlight color, for the
 * @tiptap/extension-highlight when it's configured with
 * `Highlight.configure({ multicolor: true })`.
 *
 * See also MenuButtonHighlightToggle for a simple "on off" highlight toggle
 * control, for use with the Highlight extension when not using multicolor.
 */
export default function MenuButtonHighlightColor({
  defaultMarkColor = "#ffff00",
  ...menuButtonProps
}: MenuButtonHighlightColorProps) {
  const editor = useRichTextEditorContext();
  const currentHighlightColor = editor?.isActive("highlight")
    ? // If there's no color set for the highlight (as can happen with the
      // highlight keyboard shortcut, toggleHighlight/setHighlight when no
      // explicit color is provided, and the "==thing==" syntax), fall back to
      // the provided defaultMarkColor
      (editor.getAttributes("highlight").color as string | null | undefined) ??
      defaultMarkColor
    : "";
  return (
    <MenuButtonColorPicker
      // TODO(Steven DeMartini): Add a custom icon component here that handles
      // showing the "current" color in the bar below the pen (see
      // MenuButtonTextColor comments for more details).
      // Note that MUI does not expose a "highlight color" icon, so BorderColor
      // is the next best option
      IconComponent={BorderColor}
      tooltipLabel="Highlight color"
      tooltipShortcutKeys={["mod", "Shift", "H"]}
      colorValue={currentHighlightColor}
      onColorValueChange={(newColor) => {
        if (newColor) {
          editor?.chain().focus().setHighlight({ color: newColor }).run();
        } else {
          editor?.chain().focus().unsetHighlight().run();
        }
      }}
      disabled={!editor?.isEditable || !editor.can().toggleHighlight()}
      labels={{
        removeColorButton: "None",
        removeColorButtonTooltipTitle: "Remove highlighting from this text",
        ...menuButtonProps.labels,
      }}
      {...menuButtonProps}
    />
  );
}
