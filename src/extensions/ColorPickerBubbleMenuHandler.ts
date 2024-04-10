import { Extension } from "@tiptap/core";
import type { ColorPickerBubbleMenuProps } from "../ColorPickerBubbleMenu";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    colorPickerBubbleMenu: {
      openColorPickerBubbleMenu: (
        options?: Partial<ColorPickerBubbleMenuProps>
      ) => ReturnType;

      closeColorPickerBubbleMenu: () => ReturnType;
    };
  }
}

export type ColorPickerBubbleMenuHandlerStorage = {
  state: boolean;
  bubbleMenuOptions: Partial<ColorPickerBubbleMenuProps> | undefined;
};

/* The Tiptap Color extension (@tiptap/extension-color, @tiptap/extension-highlight) should also be installed
 * and included in your extensions when using ColorPickerBubbleMenuHandler:
 */
const ColorPickerBubbleMenuHandler = Extension.create<
  undefined,
  ColorPickerBubbleMenuHandlerStorage
>({
  name: "colorPickerBubbleMenuHandler",

  addStorage() {
    return {
      state: false,
      bubbleMenuOptions: undefined,
    };
  },

  addCommands() {
    return {
      openColorPickerBubbleMenu:
        (bubbleMenuOptions = {}) =>
        () => {
          this.storage.state = true;
          this.storage.bubbleMenuOptions = bubbleMenuOptions;

          return true;
        },

      closeColorPickerBubbleMenu:
        () =>
        ({ commands, dispatch }) => {
          commands.focus();

          if (dispatch) {
            // Only change the state if this is not a dry-run
            // https://tiptap.dev/api/commands#dry-run-for-commands. Note that
            // this happens automatically for the Tiptap built-in commands
            // called with `commands` above.
            this.storage.state = false;
          }

          return true;
        },
    };
  },
});

export default ColorPickerBubbleMenuHandler;
