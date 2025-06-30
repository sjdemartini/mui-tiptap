/// <reference types="@tiptap/extension-color" />
import type { Editor } from "@tiptap/core";
import { useRichTextEditorContext } from "../context";
import { FormatColorTextNoBar } from "../icons";
import { getAttributesForEachSelected } from "../utils";
import {
  MenuButtonColorPicker,
  type MenuButtonColorPickerProps,
} from "./MenuButtonColorPicker";

export interface MenuButtonTextColorProps
  extends Partial<MenuButtonColorPickerProps> {
  /**
   * Used to indicate the default color of the text in the Tiptap editor, if no
   * color has been set with the color extension (or if color has been *unset*
   * with the extension). Typically should be set to the same value as the MUI
   * `theme.palette.text.primary`.
   */
  defaultTextColor?: string;
}

// Tiptap will return any textStyle attributes when calling
// `getAttributes("textStyle")`, but here we care about `color`, so add more
// explicit typing for that. Based on
// https://github.com/ueberdosis/tiptap/blob/6cbc2d423391c950558721510c1b4c8614feb534/packages/extension-color/src/color.ts#L37-L51
interface TextStyleAttrs extends ReturnType<Editor["getAttributes"]> {
  color?: string | null;
}

export default function MenuButtonTextColor({
  IconComponent = FormatColorTextNoBar,
  tooltipLabel = "Text color",
  defaultTextColor = "",
  ...menuButtonProps
}: MenuButtonTextColorProps) {
  const editor = useRichTextEditorContext();

  // Determine if all of the selected content shares the same set color.
  const allCurrentTextStyleAttrs: TextStyleAttrs[] = editor
    ? getAttributesForEachSelected(editor.state, "textStyle")
    : [];
  const isTextStyleAppliedToEntireSelection = !!editor?.isActive("textStyle");
  const currentColors: string[] = allCurrentTextStyleAttrs.map(
    // Treat any null/missing color as the default color
    (attrs) => attrs.color || defaultTextColor,
  );
  if (!isTextStyleAppliedToEntireSelection) {
    // If there is some selected content that does not have textStyle, we can
    // treat it the same as a selected textStyle mark with color set to the
    // default
    currentColors.push(defaultTextColor);
  }
  const numUniqueCurrentColors = new Set(currentColors).size;

  let currentColor;
  if (numUniqueCurrentColors === 1) {
    // There's exactly one color in the selected content, so show that
    currentColor = currentColors[0];
  } else if (numUniqueCurrentColors > 1) {
    // There are multiple colors (either explicitly, or because some of the
    // selection has a color set and some does not and is using the default
    // color). Similar to other rich text editors like Google Docs, we'll treat
    // this as "unset" and not show a color indicator in the button or a
    // "current" color when interacting with the color picker.
    currentColor = "";
  } else {
    // Since no color was set anywhere in the selected content, we should show
    // the default color
    currentColor = defaultTextColor;
  }

  return (
    <MenuButtonColorPicker
      IconComponent={IconComponent}
      tooltipLabel={tooltipLabel}
      value={currentColor}
      onChange={(newColor) => {
        editor?.chain().focus().setColor(newColor).run();
      }}
      disabled={!editor?.isEditable || !editor.can().setColor("#000")}
      {...menuButtonProps}
      labels={{ removeColorButton: "Reset", ...menuButtonProps.labels }}
    />
  );
}
