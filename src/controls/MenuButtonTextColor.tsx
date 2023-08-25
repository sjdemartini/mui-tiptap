/// <reference types="@tiptap/extension-color" />
import { useRichTextEditorContext } from "../context";
import { FormatColorTextNoBar } from "../icons";
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

export default function MenuButtonTextColor({
  IconComponent = FormatColorTextNoBar,
  tooltipLabel = "Text color",
  defaultTextColor = "",
  ...menuButtonProps
}: MenuButtonTextColorProps) {
  const editor = useRichTextEditorContext();
  const currentTextColor = editor?.getAttributes("textStyle").color as
    | string
    | null
    | undefined;
  return (
    <MenuButtonColorPicker
      IconComponent={IconComponent}
      tooltipLabel={tooltipLabel}
      // If the color is unset, we fall back to the default color
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      value={currentTextColor || defaultTextColor}
      onChange={(newColor) => {
        editor?.chain().focus().setColor(newColor).run();
      }}
      labels={{ removeColorButton: "Reset", ...menuButtonProps.labels }}
      disabled={!editor?.isEditable || !editor.can().setColor("#000")}
      {...menuButtonProps}
    />
  );
}
