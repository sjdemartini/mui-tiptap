import { Extension, getAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { LinkBubbleMenuProps } from "../LinkBubbleMenu";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkBubbleMenu: {
      /**
       * Open/show the link bubble menu. Create a link if one doesn't exist at
       * the current cursor selection, or edit the existing link if there is
       * already a link at the current selection.
       *
       * If the options are provided, they're used to override the bubble menu
       * props, which can be useful for specific positioning needs. Each call to
       * `openLinkBubbleMenu` will reset the options based on the provided
       * argument, falling back to default behavior if not provided.
       *
       * For instance, if the anchorEl option is provided, it overrides the
       * anchor point for positioning the bubble menu. (The default anchorEl for
       * LinkBubbleMenu is to anchor to the location in the editor content where
       * the link appears or will appear.)
       */
      openLinkBubbleMenu: (
        options?: Partial<LinkBubbleMenuProps>,
      ) => ReturnType;
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
  bubbleMenuOptions: Partial<LinkBubbleMenuProps> | undefined;
};

/**
 * To be used in conjunction with the `LinkBubbleMenu` component, as this
 * extension provides editor commands to control the state of the link bubble
 * menu.
 *
 * The Tiptap Link extension (@tiptap/extension-link) should also be installed
 * and included in your extensions when using LinkBubbleMenuHandler:
 * https://tiptap.dev/api/marks/link.
 */
const LinkBubbleMenuHandler = Extension.create<
  undefined,
  LinkBubbleMenuHandlerStorage
>({
  name: "linkBubbleMenuHandler",

  addStorage() {
    return {
      state: LinkMenuState.HIDDEN,
      bubbleMenuOptions: undefined,
    };
  },

  addCommands() {
    return {
      openLinkBubbleMenu:
        (bubbleMenuOptions = {}) =>
        ({ editor, chain, dispatch }) => {
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

          if (dispatch) {
            // Only change the state if this is not a dry-run
            // https://tiptap.dev/api/commands#dry-run-for-commands. Note that
            // this happens automatically for the Tiptap built-in commands
            // called with `chain()` above.
            this.storage.state = newMenuState;
            this.storage.bubbleMenuOptions = bubbleMenuOptions;
          }

          return true;
        },

      editLinkInBubbleMenu:
        () =>
        ({ dispatch }) => {
          const currentMenuState = this.storage.state;
          const newMenuState = LinkMenuState.EDIT_LINK;
          if (currentMenuState === newMenuState) {
            return false;
          }

          if (dispatch) {
            // Only change the state if this is not a dry-run
            // https://tiptap.dev/api/commands#dry-run-for-commands.
            this.storage.state = newMenuState;
          }

          return true;
        },

      closeLinkBubbleMenu:
        () =>
        ({ commands, dispatch }) => {
          const currentMenuState = this.storage.state;
          if (currentMenuState === LinkMenuState.HIDDEN) {
            return false;
          }

          // Re-focus on the editor (e.g. for re-selection) since the user was
          // previously editing and has now canceled
          commands.focus();

          if (dispatch) {
            // Only change the state if this is not a dry-run
            // https://tiptap.dev/api/commands#dry-run-for-commands. Note that
            // this happens automatically for the Tiptap built-in commands
            // called with `commands` above.
            this.storage.state = LinkMenuState.HIDDEN;
          }

          return true;
        },
    };
  },

  onSelectionUpdate() {
    // To ensure we maintain the proper bubble menu state, if someone is
    // viewing/editing a link but moves off of it (e.g. with their keyboard
    // arrow keys, or by clicking out, or by typing over the currently selected
    // link), we'll close the bubble menu. Note that when in "view" mode (and
    // not "edit") for an existing link, we only close if the state shows the
    // user is not on an active link anymore, since the selection can be updated
    // via `openLinkBubbleMenu` (and we don't want to immediately close it upon
    // initial opening of the bubble menu). By contrast in "edit" mode, the
    // user's focus should be in the edit form and selection shouldn't
    // automatically update during opening or otherwise, so clicking out (i.e.
    // changing selection) definitively indicates cancellation.
    // onSelectionUpdate runs before handleClick, so we need to promptly close
    // in that scenario.
    if (this.storage.state === LinkMenuState.EDIT_LINK) {
      this.editor.commands.closeLinkBubbleMenu();
    } else if (
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
