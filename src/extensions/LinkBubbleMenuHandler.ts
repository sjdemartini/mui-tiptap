import { Extension, getAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkBubbleMenu: {
      /**
       * Open/show the link bubble menu. Create a link if one doesn't exist at
       * the current cursor selection, or edit the existing link if there is
       * already a link at the current selection.
       */
      openLinkBubbleMenu: () => ReturnType;
      /** Close/hide the link bubble menu, canceling any ongoing edits. */
      closeLinkBubbleMenu: () => ReturnType;
    };
  }
}

export type LinkBubbleMenuHandlerStorage = {
  open: boolean;
};

const LinkBubbleMenuHandler = Extension.create<
  undefined,
  LinkBubbleMenuHandlerStorage
>({
  name: "linkBubbleMenuHandler",

  addStorage() {
    return {
      open: false,
    };
  },

  addCommands() {
    return {
      openLinkBubbleMenu: () => () => {
        if (this.storage.open) {
          return false;
        }
        this.storage.open = true;
        return true;
      },
      closeLinkBubbleMenu: () => () => {
        if (!this.storage.open) {
          return false;
        }

        this.storage.open = false;
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-u": () => {
        this.editor.commands.openLinkBubbleMenu();
        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("handleClickLinkForMenu"),
        props: {
          handleClick: (view, pos, event) => {
            const attrs = getAttributes(view.state, "link");
            const link = (event.target as HTMLElement).closest("a");
            // If the user has clicked on a link and the menu isn't already
            // open, we'll open it. Otherwise we close it. (Closing the menu if
            // it's already open allows a user to put their cursor within the
            // link text and implicitly close the bubble menu, like the Slack UI
            // does, if they don't want to use the bubble menu but instead want
            // to use regular cursor/keyboard interaction with the text.)
            if (link && attrs.href && !this.storage.open) {
              this.editor.commands.openLinkBubbleMenu();
            } else {
              this.editor.commands.closeLinkBubbleMenu();
            }
            // Return false so that the click still propagates to any other
            // handlers, without `preventDefault` (see note on boolean return
            // values here https://prosemirror.net/docs/ref/#view.EditorProps)
            return false;
          },
        },
      }),
    ];
  },
});

export default LinkBubbleMenuHandler;
