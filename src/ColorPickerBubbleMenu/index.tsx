/// <reference types="@tiptap/extension-color" />
import type { Editor } from "@tiptap/core";
import type { Except } from "type-fest";
import ControlledBubbleMenu, {
  type ControlledBubbleMenuProps,
} from "../ControlledBubbleMenu";
import { useRichTextEditorContext } from "../context";
import type {
  ColorPickerProps,
  SwatchColorOption,
} from "../controls/ColorPicker";
import { ColorPickerPopperBody } from "../controls/ColorPickerPopper";
import type { ColorPickerBubbleMenuHandlerStorage } from "../extensions/ColorPickerBubbleMenuHandler";
import { getAttributesForEachSelected } from "../utils";
import { ColorPickerMode } from "../utils/types";

export interface ColorPickerBubbleMenuProps
  extends Partial<
    Except<ControlledBubbleMenuProps, "open" | "editor" | "children">
  > {
  /**
   * Provide default list of colors (must be valid CSS color strings) which
   * are used to form buttons for color swatches.
   */
  swatchColors?: SwatchColorOption[];
  /** Override the props for the color picker. */
  ColorPickerProps?: Partial<ColorPickerProps>;
  /**
   * Used to indicate the default color of the text in the Tiptap editor, if no
   * color has been set with the color extension (or if color has been *unset*
   * with the extension). Typically should be set to the same value as the MUI
   * `theme.palette.text.primary`.
   */
  defaultTextColor?: string;
  mode?: ColorPickerMode;
}

// Tiptap will return any textStyle attributes when calling
// `getAttributes("textStyle")`, but here we care about `color`, so add more
// explicit typing for that. Based on
// https://github.com/ueberdosis/tiptap/blob/6cbc2d423391c950558721510c1b4c8614feb534/packages/extension-color/src/color.ts#L37-L51
interface TextStyleAttrs extends ReturnType<Editor["getAttributes"]> {
  color?: string | null;
}

/**
 * A component that renders a bubble menu for color picker.
 *
 * Pairs well with the `<MenuButtonTextColor />`, `<MenuButtonHighlightColor />` component.
 *
 * If you're using `RichTextEditor`, include this component via
 * `RichTextEditor`’s `children` render-prop. Otherwise, include the
 * `ColorPickerBubbleMenu` as a child of the component where you call `useEditor` and
 * render your `RichTextField` or `RichTextContent`. (The bubble menu itself
 * will be positioned appropriately no matter where you put it in your React
 * tree, as long as it is re-rendered whenever the Tiptap `editor` forces an
 * update, which will happen if it's a child of the component using
 * `useEditor`).
 */
export default function ColorPickerBubbleMenu({
  swatchColors,
  defaultTextColor = "",
  ColorPickerProps,
  ...controlledBubbleMenuProps
}: ColorPickerBubbleMenuProps) {
  const editor = useRichTextEditorContext();

  if (!editor?.isEditable) {
    return null;
  }

  if (!("colorPickerBubbleMenuHandler" in editor.storage)) {
    throw new Error(
      "You must add the ColorPickerBubbleMenuHandler extension to the useEditor `extensions` array in order to use this component!"
    );
  }
  const handlerStorage = editor.storage
    .colorPickerBubbleMenuHandler as ColorPickerBubbleMenuHandlerStorage;

  // Update the menu step if the bubble menu state has changed
  const menuState = handlerStorage.state;

  // Determine if all of the selected content shares the same set color.
  const allCurrentTextStyleAttrs: TextStyleAttrs[] =
    getAttributesForEachSelected(editor.state, "textStyle");
  const isTextStyleAppliedToEntireSelection = !!editor.isActive("textStyle");
  const currentColors: string[] = allCurrentTextStyleAttrs.map(
    // Treat any null/missing color as the default color
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (attrs) => attrs.color || defaultTextColor
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
    <ControlledBubbleMenu
      editor={editor}
      open={menuState}
      {...handlerStorage.bubbleMenuOptions}
      {...controlledBubbleMenuProps}
    >
      <ColorPickerPopperBody
        value={currentColor}
        onSave={(newColor: string) => {
          if (handlerStorage.bubbleMenuOptions?.mode === ColorPickerMode.Text) {
            editor.chain().focus().setColor(newColor).run();
          } else {
            // Highlight
            if (newColor) {
              editor.chain().focus().setHighlight({ color: newColor }).run();
            } else {
              editor.chain().focus().unsetHighlight().run();
            }
          }
          editor.commands.closeColorPickerBubbleMenu();
        }}
        onCancel={editor.commands.closeColorPickerBubbleMenu}
        swatchColors={swatchColors}
        ColorPickerProps={ColorPickerProps}
      />
    </ControlledBubbleMenu>
  );
}
