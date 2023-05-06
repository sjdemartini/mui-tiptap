import { Box } from "@mui/material";
import { Editor, getAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import React, { useCallback, useEffect, useState } from "react";
import ControlledBubbleMenu from "./ControlledBubbleMenu";
import EditLinkMenuContent from "./EditLinkMenuContent";
import keymapPluginFactory from "./keymapPluginFactory";
import ViewLinkMenuContent from "./ViewLinkMenuContent";

interface UseLinkMenuOptions {
  editor: Editor | null;
}

export interface UseLinkMenuResult {
  linkBubbleMenu: React.ReactNode;
  onShowLinkMenu: () => void;
}

enum LinkMenuStep {
  HIDDEN,
  VIEW_LINK_DETAILS,
  EDIT_LINK,
}

/**
 * A hook for providing a menu for viewing or editing a link in a Tiptap editor.
 */
export default function useLinkMenu({
  editor,
}: UseLinkMenuOptions): UseLinkMenuResult {
  const [menuStep, setMenuStep] = useState(LinkMenuStep.HIDDEN);

  const handleShowLinkMenu = useCallback(() => {
    if (!editor || editor.isDestroyed) {
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
  }, [editor]);

  const handleCancelLinkEdit = useCallback(() => {
    setMenuStep((previousStep) => {
      const wasEditing = previousStep !== LinkMenuStep.HIDDEN;
      if (wasEditing) {
        // Re-focus on the editor (e.g. for re-selection) if the was previously editing and has now
        // canceled
        editor?.commands.focus();
      }
      return LinkMenuStep.HIDDEN;
    });
  }, [editor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }

    const pluginKey = new PluginKey("handleClickLinkForMenu");
    const handleClickPlugin = new Plugin({
      key: pluginKey,
      props: {
        handleClick: (view, pos, event) => {
          const attrs = getAttributes(view.state, "link");
          const link = (event.target as HTMLElement).closest("a");
          if (link && attrs.href) {
            handleShowLinkMenu();
          } else {
            handleCancelLinkEdit();
          }
          // Return false so that the click still propagates to any other handlers,
          // without `preventDefault` (see note on boolean return values here
          // https://prosemirror.net/docs/ref/#view.EditorProps)
          return false;
        },
      },
    });

    editor.registerPlugin(handleClickPlugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, handleShowLinkMenu, handleCancelLinkEdit]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }

    const pluginKey = new PluginKey("linkMenuKeymap");
    const linkKeyMapPlugin = keymapPluginFactory(
      {
        "Mod-Shift-u": () => {
          handleShowLinkMenu();
          return true;
        },
      },
      pluginKey
    );

    editor.registerPlugin(linkKeyMapPlugin);
    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, handleShowLinkMenu]);

  let linkMenuContent = null;
  if (editor?.isActive("link") && menuStep === LinkMenuStep.VIEW_LINK_DETAILS) {
    linkMenuContent = (
      <ViewLinkMenuContent
        editor={editor}
        onCancel={handleCancelLinkEdit}
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
  } else if (editor && menuStep === LinkMenuStep.EDIT_LINK) {
    linkMenuContent = (
      <EditLinkMenuContent
        editor={editor}
        onCancel={handleCancelLinkEdit}
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
          setMenuStep(LinkMenuStep.HIDDEN);
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
    shouldShow = !!editor?.isActive("link");
  } else {
    shouldShow = true;
  }

  return {
    onShowLinkMenu: handleShowLinkMenu,
    linkBubbleMenu: editor ? (
      <ControlledBubbleMenu editor={editor} open={shouldShow}>
        <Box p={(theme) => theme.spacing(1.5, 2, 0.5)}>{linkMenuContent}</Box>
      </ControlledBubbleMenu>
    ) : null,
  };
}
