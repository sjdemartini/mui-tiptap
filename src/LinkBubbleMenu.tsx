import { Box } from "@mui/material";
import type { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import ControlledBubbleMenu from "./ControlledBubbleMenu";
import EditLinkMenuContent from "./EditLinkMenuContent";
import ViewLinkMenuContent from "./ViewLinkMenuContent";
import type { LinkBubbleMenuHandlerStorage } from "./extensions/LinkBubbleMenuHandler";

export type LinkBubbleMenuProps = {
  editor: Editor;
};

enum LinkMenuStep {
  HIDDEN,
  VIEW_LINK_DETAILS,
  EDIT_LINK,
}

/**
 * A hook for providing a menu for viewing, creating, or editing a link in a
 * Tiptap editor.
 */
export default function LinkBubbleMenu({ editor }: LinkBubbleMenuProps) {
  const [menuStep, setMenuStep] = useState(LinkMenuStep.HIDDEN);

  const handlerStorage = editor.storage
    .linkBubbleMenuHandler as LinkBubbleMenuHandlerStorage;

  if (!("linkBubbleMenuHandler" in editor.extensionStorage)) {
    throw new Error(
      "You must add the LinkBubbleMenuHandler extension to the useEditor `extensions` array in order to use this component!"
    );
  }

  // Update the menu step if the bubble menu state has changed
  const isTriggeredToOpenViaHandlerExtension = handlerStorage.open;
  useEffect(() => {
    function handleShowLinkMenu() {
      if (editor.isDestroyed) {
        return;
      }

      setMenuStep((currentMenuStep) => {
        if (editor.isActive("link")) {
          // If their cursor is currently on a link, we'll open the link menu to
          // view the details.
          if (currentMenuStep !== LinkMenuStep.VIEW_LINK_DETAILS) {
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
            editor.chain().extendMarkRange("link").focus().run();
          }

          return LinkMenuStep.VIEW_LINK_DETAILS;
        }

        // Otherwise open the edit link menu for the user to add a new link
        return LinkMenuStep.EDIT_LINK;
      });
    }

    function handleCancelLinkEdit() {
      setMenuStep((previousStep) => {
        const wasEditing = previousStep !== LinkMenuStep.HIDDEN;
        if (wasEditing) {
          // Re-focus on the editor (e.g. for re-selection) if the user was
          // previously editing and has now canceled
          editor.commands.focus();
        }
        return LinkMenuStep.HIDDEN;
      });
    }

    if (isTriggeredToOpenViaHandlerExtension) {
      handleShowLinkMenu();
    } else {
      handleCancelLinkEdit();
    }
  }, [isTriggeredToOpenViaHandlerExtension, editor]);

  let linkMenuContent = null;
  if (editor.isActive("link") && menuStep === LinkMenuStep.VIEW_LINK_DETAILS) {
    linkMenuContent = (
      <ViewLinkMenuContent
        editor={editor}
        onCancel={editor.commands.closeLinkBubbleMenu}
        onEdit={() => {
          setMenuStep(LinkMenuStep.EDIT_LINK);
        }}
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
  } else if (menuStep === LinkMenuStep.EDIT_LINK) {
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
  if (menuStep === LinkMenuStep.HIDDEN) {
    shouldShow = false;
  } else if (menuStep === LinkMenuStep.VIEW_LINK_DETAILS) {
    // While we could just set `shouldShow = true;` here and everything would
    // work properly, by checking that a link is currently active under the
    // editor cursor, we can more quickly "close" the bubble menu if someone
    // clicks off (without having to wait for the "cancel" click-handler to set
    // the menuStep in response to clicking off of a link), to prevent menu
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
    // better be solved by moving the menuStep state from this React component
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
