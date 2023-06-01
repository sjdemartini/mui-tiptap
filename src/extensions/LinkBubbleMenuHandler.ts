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
      /**
       * Edit an existing link in the bubble menu, to be used when currently
       * viewing a link in the already-opened bubble menu.
       */
      editLinkInBubbleMenu: () => ReturnType;
      /** Close/hide the link bubble menu, canceling any ongoing edits. */
      closeLinkBubbleMenu: () => ReturnType;
    };
  }
}

export enum LinkMenuState {
  HIDDEN,
  VIEW_LINK_DETAILS,
  EDIT_LINK,
}

export type LinkBubbleMenuHandlerStorage = {
  state: LinkMenuState;
};

const LinkBubbleMenuHandler = Extension.create<
  undefined,
  LinkBubbleMenuHandlerStorage
>({
  name: "linkBubbleMenuHandler",

  addStorage() {
    return {
      state: LinkMenuState.HIDDEN,
    };
  },

  addCommands() {
    return {
      openLinkBubbleMenu:
        () =>
        ({ editor, chain }) => {
          const currentMenuState = this.storage.state;

          let newMenuState: LinkMenuState;
          if (editor.isActive("link")) {
            // If their cursor is currently on a link, we'll open the link menu to
            // view the details.
            if (currentMenuState !== LinkMenuState.VIEW_LINK_DETAILS) {
              // If the user isn't already in the "View Link Details" menu, we'll first
              // change the selection to encompass the entire link to make it obvious which
              // link is being edited and what text it includes. We also focus in case the
              // user clicked the Link menu button (so we re-focus on the editor).

              // NOTE: there is a bug in Tiptap where `extendMarkRange` will not
              // work despite `isActive("link")` having returning true if the
              // click/cursor is at the end of a link
              // https://github.com/ueberdosis/tiptap/issues/2535. This leads to
              // confusing behavior and should probably be handled with a workaround
              // (like checking whether `extendMarkRange` had any effect) so that we
              // don't open the link menu unless we know we've selected the entire
              // link.
              chain().extendMarkRange("link").focus().run();
            }

            newMenuState = LinkMenuState.VIEW_LINK_DETAILS;
          } else {
            // Otherwise open the edit link menu for the user to add a new link
            newMenuState = LinkMenuState.EDIT_LINK;
          }

          this.storage.state = newMenuState;
          return true;
        },

      editLinkInBubbleMenu: () => () => {
        const currentMenuState = this.storage.state;
        const newMenuState = LinkMenuState.EDIT_LINK;
        if (currentMenuState === newMenuState) {
          return false;
        }

        this.storage.state = newMenuState;
        return true;
      },

      closeLinkBubbleMenu:
        () =>
        ({ commands }) => {
          const currentMenuState = this.storage.state;
          if (currentMenuState === LinkMenuState.HIDDEN) {
            return false;
          }

          // Re-focus on the editor (e.g. for re-selection) since the user was
          // previously editing and has now canceled
          commands.focus();

          this.storage.state = LinkMenuState.HIDDEN;
          return true;
        },
    };
  },

  onSelectionUpdate() {
    // To ensure we maintain the proper bubble menu state, if someone is viewing
    // an existing link but moves off of it (e.g. with their keyboard), we'll
    // close the bubble menu. Note that we only do this for "view" (and not
    // "edit"), since when adding a new link, there is not yet a link at the
    // current position and the user's focus will be in the edit form anyway,
    // where clicking out would already close the menu.
    if (
      this.storage.state === LinkMenuState.VIEW_LINK_DETAILS &&
      !this.editor.isActive("link")
    ) {
      this.editor.commands.closeLinkBubbleMenu();
    }
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
            // it's already open allows a user to put their cursor at a specific
            // point within the link text and implicitly close the bubble menu,
            // like the Slack UI does, if they don't want to use the bubble menu
            // but instead want to use regular cursor/keyboard interaction with
            // the link text.)
            if (
              link &&
              attrs.href &&
              this.storage.state === LinkMenuState.HIDDEN
            ) {
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
