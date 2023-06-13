import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import ControlledBubbleMenu, {
  type ControlledBubbleMenuProps,
} from "../ControlledBubbleMenu";
import { useRichTextEditorContext } from "../context";
import {
  LinkMenuState,
  type LinkBubbleMenuHandlerStorage,
} from "../extensions/LinkBubbleMenuHandler";
import EditLinkMenuContent from "./EditLinkMenuContent";
import ViewLinkMenuContent from "./ViewLinkMenuContent";

export type LinkBubbleMenuProps = Partial<
  Except<ControlledBubbleMenuProps, "open" | "editor" | "children">
>;

const useStyles = makeStyles({ name: { LinkBubbleMenu } })((theme) => ({
  content: {
    padding: theme.spacing(1.5, 2, 0.5),
  },
}));

/**
 * A hook for providing a menu for viewing, creating, or editing a link in a
 * Tiptap editor. To be rendered when using the LinkBubbleMenuHandler extension.
 */
export default function LinkBubbleMenu({
  ...controlledBubbleMenuProps
}: LinkBubbleMenuProps) {
  const { classes } = useStyles();
  const editor = useRichTextEditorContext();

  if (!editor) {
    return null;
  }

  if (!("linkBubbleMenuHandler" in editor.storage)) {
    throw new Error(
      "You must add the LinkBubbleMenuHandler extension to the useEditor `extensions` array in order to use this component!"
    );
  }
  const handlerStorage = editor.storage
    .linkBubbleMenuHandler as LinkBubbleMenuHandlerStorage;

  // Update the menu step if the bubble menu state has changed
  const menuState = handlerStorage.state;

  let linkMenuContent = null;
  if (menuState === LinkMenuState.VIEW_LINK_DETAILS) {
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

  return (
    <ControlledBubbleMenu
      editor={editor}
      open={menuState !== LinkMenuState.HIDDEN}
      {...controlledBubbleMenuProps}
    >
      <div className={classes.content}>{linkMenuContent}</div>
    </ControlledBubbleMenu>
  );
}
