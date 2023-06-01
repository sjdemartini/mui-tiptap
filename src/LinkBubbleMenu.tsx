import { Box } from "@mui/material";
import type { Editor } from "@tiptap/core";
import ControlledBubbleMenu from "./ControlledBubbleMenu";
import EditLinkMenuContent from "./EditLinkMenuContent";
import ViewLinkMenuContent from "./ViewLinkMenuContent";
import {
  LinkMenuState,
  type LinkBubbleMenuHandlerStorage,
} from "./extensions/LinkBubbleMenuHandler";

export type LinkBubbleMenuProps = {
  editor: Editor;
};

/**
 * A hook for providing a menu for viewing, creating, or editing a link in a
 * Tiptap editor.
 */
export default function LinkBubbleMenu({ editor }: LinkBubbleMenuProps) {
  if (!("linkBubbleMenuHandler" in editor.extensionStorage)) {
    throw new Error(
      "You must add the LinkBubbleMenuHandler extension to the useEditor `extensions` array in order to use this component!"
    );
  }
  const handlerStorage = editor.storage
    .linkBubbleMenuHandler as LinkBubbleMenuHandlerStorage;

  // Update the menu step if the bubble menu state has changed
  const menuState = handlerStorage.state;

  let linkMenuContent = null;
  if (
    editor.isActive("link") &&
    menuState === LinkMenuState.VIEW_LINK_DETAILS
  ) {
    linkMenuContent = (
      <ViewLinkMenuContent
        editor={editor}
        onCancel={editor.commands.closeLinkBubbleMenu}
        onEdit={editor.commands.editLinkInBubbleMenu}
        onRemove={() => {
          // Remove the link and place the cursor at the end of the link (which
          // requires "focus" to take effect)
          editor
            .chain()
            .unsetLink()
            .setTextSelection(editor.state.selection.to)
            .focus()
            .run();
        }}
      />
    );
  } else if (menuState === LinkMenuState.EDIT_LINK) {
    linkMenuContent = (
      <EditLinkMenuContent
        editor={editor}
        onCancel={editor.commands.closeLinkBubbleMenu}
        onSave={({ text, link }) => {
          editor
            .chain()
            // Make sure if we're updating a link, we update the link for the
            // full link "mark"
            .extendMarkRange("link")
            // Update the link href and its text content
            .insertContent({
              type: "text",
              marks: [
                {
                  type: "link",
                  attrs: {
                    href: link,
                  },
                },
              ],
              text: text,
            })
            // Note that as of "@tiptap/extension-link" 2.0.0-beta.37 when
            // `autolink` is on (which we want), adding the link mark directly
            // via `insertContent` above wasn't sufficient for the link mark to
            // be applied (though specifying it above is still necessary), so we
            // insert the content there and call `setLink` separately here.
            // Unclear why this separate command is necessary, but it does the
            // trick.
            .setLink({
              href: link,
            })
            // Place the cursor at the end of the link (which requires "focus"
            // to take effect)
            .focus()
            .run();

          editor.commands.closeLinkBubbleMenu();
        }}
      />
    );
  }

  // We'll show the link bubble menu as open if the user is currently adding/editing a link
  let shouldShow: boolean;
  if (menuState === LinkMenuState.HIDDEN) {
    shouldShow = false;
  } else if (menuState === LinkMenuState.VIEW_LINK_DETAILS) {
    // While we could just set `shouldShow = true;` here and everything would
    // work properly, by checking that a link is currently active under the
    // editor cursor, we can more quickly "close" the bubble menu if someone
    // clicks off (without having to wait for the "cancel" click-handler to set
    // the menuState in response to clicking off of a link), to prevent menu
    // repositioning/flashing before closing. We can only do this for "view"
    // (and not "edit"), since when adding a new link, there is not yet a link
    // at the current position.
    shouldShow = !!editor.isActive("link");

    // TODO(Steven DeMartini): We could perhaps add a useEffect hook which
    // calls `closeLinkBubbleMenu` in the event that this condition is reached,
    // so that the storage/state is updated to reflect that the link menu should
    // be closed. Otherwise, moving the cursor with the arrow keys away from one
    // link will close the menu, and entering a link again with the keyboard
    // will re-open the menu. (A minor edge case.) Or, this could probably
    // better be solved by moving the menuState state from this React component
    // instead into the LinkBubbleMenuHandler extension, and having that
    // extension listen to `onUpdate`. Then there aren't two sources of truth
    // for the link menu state.
  } else {
    shouldShow = true;
  }

  return (
    <ControlledBubbleMenu editor={editor} open={shouldShow}>
      <Box sx={{ pt: 1.5, px: 2, pb: 0.5 }}>{linkMenuContent}</Box>
    </ControlledBubbleMenu>
  );
}
