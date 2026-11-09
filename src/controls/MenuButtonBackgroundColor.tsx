/// <reference types="@tiptap/extension-text-style" />
import type { Editor } from "@tiptap/core";
import { useRichTextEditorContext } from "../context";
import { FormatColorFillNoBar } from "../icons";
import { getAttributesForEachSelected } from "../utils";
import MenuButtonColorPicker, {
  type MenuButtonColorPickerProps,
} from "./MenuButtonColorPicker";

export type MenuButtonBackgroundColorProps =
  Partial<MenuButtonColorPickerProps>;

// Tiptap will return any textStyle attributes when calling
// `getAttributes("textStyle")`, but here we care about `backgroundColor`, so
// add more explicit typing for that. Based on
// https://github.com/ueberdosis/tiptap/blob/17ec9ff0bda0381a4386d67e198054bf085fbc26/packages/extension-text-style/src/background-color/background-color.ts#L33-L38
interface TextStyleAttrs extends ReturnType<Editor["getAttributes"]> {
  backgroundColor?: string | null;
}

/**
 * Control for a user to choose a text background color, for the Tiptap v3
 * `BackgroundColor` extension from @tiptap/extension-text-style
 * (https://tiptap.dev/docs/editor/extensions/functionality/background-color).
 *
 * Unlike the Highlight extension (see MenuButtonHighlightColor), which wraps
 * text in `<mark>` elements, `BackgroundColor` sets a `background-color` style
 * on the `textStyle` mark's `<span>`.
 */
export default function MenuButtonBackgroundColor({
  IconComponent = FormatColorFillNoBar,
  tooltipLabel = "Background color",
  ...menuButtonProps
}: MenuButtonBackgroundColorProps) {
  const editor = useRichTextEditorContext();

  // Determine if all of the selected content shares the same set background
  // color. Any selected content without a background color is treated as
  // having an empty ("") color.
  const allCurrentTextStyleAttrs: TextStyleAttrs[] = editor
    ? getAttributesForEachSelected(editor.state, "textStyle")
    : [];
  const isTextStyleAppliedToEntireSelection = !!editor?.isActive("textStyle");
  const currentColors: string[] = allCurrentTextStyleAttrs.map(
    (attrs) => attrs.backgroundColor || "",
  );
  if (!isTextStyleAppliedToEntireSelection) {
    // If there is some selected content that does not have textStyle, we can
    // treat it the same as a selected textStyle mark with no background color
    currentColors.push("");
  }
  const uniqueCurrentColors = new Set(currentColors);

  // Only show a current color if there's exactly one background color in the
  // selected content. If there are multiple colors (either explicitly, or
  // because only some of the selection has a background color set), similar to
  // MenuButtonTextColor, we'll treat this as "unset" and not show a color
  // indicator in the button or a "current" color in the color picker.
  const currentColor = uniqueCurrentColors.size === 1 ? currentColors[0] : "";

  return (
    <MenuButtonColorPicker
      IconComponent={IconComponent}
      tooltipLabel={tooltipLabel}
      value={currentColor}
      onChange={(newColor) => {
        // We set the textStyle mark attribute directly, rather than using the
        // `setBackgroundColor`/`unsetBackgroundColor` commands, since those
        // commands (and their types) don't exist in Tiptap v2. This is
        // equivalent to the implementation of those commands in Tiptap v3.
        if (newColor) {
          editor
            ?.chain()
            .focus()
            .setMark("textStyle", { backgroundColor: newColor })
            .run();
        } else {
          editor
            ?.chain()
            .focus()
            .setMark("textStyle", { backgroundColor: null })
            .removeEmptyTextStyle()
            .run();
        }
      }}
      disabled={!editor?.isEditable || !editor.can().setMark("textStyle")}
      {...menuButtonProps}
      labels={{
        removeColorButtonTooltipTitle: "Remove background color from this text",
        ...menuButtonProps.labels,
      }}
    />
  );
}
