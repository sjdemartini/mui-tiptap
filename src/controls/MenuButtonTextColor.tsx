/// <reference types="@tiptap/extension-color" />
import { FormatColorText } from "@mui/icons-material";
import { useRichTextEditorContext } from "..";
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
  IconComponent = FormatColorText,
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
      // Ideally we'd show the current selected color in the lower bar of the
      // icon (like Office, Google Docs, and other tools do), but this is
      // relatively complicated to implement since the svg is all one path.
      // (We'd presumably need to combine two SVGs here, one of which shows the
      // color in the bar below, and one of which shows the "normal" icon
      // uncolored above it excluding the bar.) We don't color the entire icon
      // since it can make the icon invisible depending on the color chosen and
      // user's background color.
      // TODO(Steven DeMartini): Add a custom icon component here that handles a
      // "current" color per the above
      IconComponent={IconComponent}
      tooltipLabel={tooltipLabel}
      // If the color is unset, we fall back to the default color
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      colorValue={currentTextColor || defaultTextColor}
      onColorValueChange={(newColor) => {
        editor?.chain().focus().setColor(newColor).run();
      }}
      labels={{ removeColorButton: "Reset", ...menuButtonProps.labels }}
      disabled={!editor?.isEditable || !editor.can().setColor("#000")}
      {...menuButtonProps}
    />
  );
}
