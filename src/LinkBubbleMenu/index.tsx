/// <reference types="@tiptap/extension-link" />
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
import EditLinkMenuContent, {
  type EditLinkMenuContentProps,
} from "./EditLinkMenuContent";
import ViewLinkMenuContent, {
  type ViewLinkMenuContentProps,
} from "./ViewLinkMenuContent";

export interface LinkBubbleMenuProps
  extends Partial<
    Except<ControlledBubbleMenuProps, "open" | "editor" | "children">
  > {
  /**
   * Override the default text content/labels in this interface. For any value
   * that is omitted in this object, it falls back to the default content.
   */
  labels?: ViewLinkMenuContentProps["labels"] &
    EditLinkMenuContentProps["labels"];
  formatHref?: EditLinkMenuContentProps["formatHref"];
}

const useStyles = makeStyles({ name: { LinkBubbleMenu } })((theme) => ({
  content: {
    padding: theme.spacing(1.5, 2, 0.5),
  },
}));

/**
 * A component that renders a bubble menu when viewing, creating, or editing a
 * link. Requires the mui-tiptap LinkBubbleMenuHandler extension and Tiptap's
 * Link extension (@tiptap/extension-link, https://tiptap.dev/api/marks/link) to
 * both be included in your editor `extensions` array.
 *
 * Pairs well with the `<MenuButtonEditLink />` component.
 *
 * If you're using `RichTextEditor`, include this component via
 * `RichTextEditor`’s `children` render-prop. Otherwise, include the
 * `LinkBubbleMenu` as a child of the component where you call `useEditor` and
 * render your `RichTextField` or `RichTextContent`. (The bubble menu itself
 * will be positioned appropriately no matter where you put it in your React
 * tree, as long as it is re-rendered whenever the Tiptap `editor` forces an
 * update, which will happen if it's a child of the component using
 * `useEditor`).
 */
export default function LinkBubbleMenu({
  labels,
  formatHref,
  ...controlledBubbleMenuProps
}: LinkBubbleMenuProps) {
  const { classes } = useStyles();
  const editor = useRichTextEditorContext();

  if (!editor?.isEditable) {
    return null;
  }

  if (!("linkBubbleMenuHandler" in editor.storage)) {
    throw new Error(
      "You must add the LinkBubbleMenuHandler extension to the useEditor `extensions` array in order to use this component!",
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
        labels={labels}
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
        labels={labels}
        formatHref={formatHref}
      />
    );
  }

  return (
    <ControlledBubbleMenu
      editor={editor}
      open={menuState !== LinkMenuState.HIDDEN}
      {...handlerStorage.bubbleMenuOptions}
      {...controlledBubbleMenuProps}
    >
      <div className={classes.content}>{linkMenuContent}</div>
    </ControlledBubbleMenu>
  );
}
