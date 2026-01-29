/// <reference types="@tiptap/extension-link" />
import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import { useEditorState } from "@tiptap/react";
import { clsx } from "clsx";
import ControlledBubbleMenu, {
  type ControlledBubbleMenuProps,
} from "../ControlledBubbleMenu";
import { useRichTextEditorContext } from "../context";
import { LinkMenuState } from "../extensions/LinkBubbleMenuHandler";
import { getUtilityComponentName } from "../styles";
import EditLinkMenuContent, {
  type EditLinkMenuContentProps,
} from "./EditLinkMenuContent";
import {
  linkBubbleMenuClasses,
  type LinkBubbleMenuClassKey,
  type LinkBubbleMenuClasses,
} from "./LinkBubbleMenu.classes";
import ViewLinkMenuContent, {
  type ViewLinkMenuContentProps,
} from "./ViewLinkMenuContent";

export interface LinkBubbleMenuProps
  extends Partial<
    Omit<ControlledBubbleMenuProps, "open" | "editor" | "children" | "classes">
  > {
  /**
   * Override the default text content/labels in this interface. For any value
   * that is omitted in this object, it falls back to the default content.
   */
  labels?: ViewLinkMenuContentProps["labels"] &
    EditLinkMenuContentProps["labels"];
  formatHref?: EditLinkMenuContentProps["formatHref"];
  /** Override or extend existing styles. */
  classes?: Partial<LinkBubbleMenuClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
}

const componentName = getUtilityComponentName("LinkBubbleMenu");

const LinkBubbleMenuContent = styled("div", {
  name: componentName,
  slot: "content" satisfies LinkBubbleMenuClassKey,
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 0.5),
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
 * `RichTextEditor`'s `children` render-prop. Otherwise, include the
 * `LinkBubbleMenu` as a child of the component where you call `useEditor` and
 * render your `RichTextField` or `RichTextContent`. (The bubble menu itself
 * will be positioned appropriately no matter where you put it in your React
 * tree, as long as it is re-rendered whenever the Tiptap `editor` forces an
 * update, which will happen if it's a child of the component using
 * `useEditor`).
 */
export default function LinkBubbleMenu(inProps: LinkBubbleMenuProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    labels,
    formatHref,
    classes = {},
    sx,
    ...controlledBubbleMenuProps
  } = props;

  const editor = useRichTextEditorContext();

  if (!("linkBubbleMenuHandler" in editor.storage)) {
    throw new Error(
      "You must add the LinkBubbleMenuHandler extension to the useEditor `extensions` array in order to use this component!",
    );
  }

  const {
    menuState,
    bubbleMenuOptions,
    closeLinkBubbleMenu,
    editLinkInBubbleMenu,
    selectionTo,
  } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      menuState: editorSnapshot.storage.linkBubbleMenuHandler.state,
      bubbleMenuOptions:
        editorSnapshot.storage.linkBubbleMenuHandler.bubbleMenuOptions,
      closeLinkBubbleMenu: editorSnapshot.commands.closeLinkBubbleMenu,
      editLinkInBubbleMenu: editorSnapshot.commands.editLinkInBubbleMenu,
      selectionTo: editorSnapshot.state.selection.to,
    }),
  });

  if (!editor.isEditable) {
    return null;
  }

  let linkMenuContent = null;
  if (menuState === LinkMenuState.VIEW_LINK_DETAILS) {
    linkMenuContent = (
      <ViewLinkMenuContent
        editor={editor}
        onCancel={closeLinkBubbleMenu}
        onEdit={editLinkInBubbleMenu}
        onRemove={() => {
          // Remove the link and place the cursor at the end of the link (which
          // requires "focus" to take effect)
          editor
            .chain()
            .unsetLink()
            .setTextSelection(selectionTo)
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

          closeLinkBubbleMenu();
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
      {...bubbleMenuOptions}
      {...controlledBubbleMenuProps}
      classes={{
        root: clsx([linkBubbleMenuClasses.root, classes.root]),
        paper: clsx([linkBubbleMenuClasses.paper, classes.paper]),
      }}
      sx={sx}
    >
      <LinkBubbleMenuContent
        className={clsx([linkBubbleMenuClasses.content, classes.content])}
      >
        {linkMenuContent}
      </LinkBubbleMenuContent>
    </ControlledBubbleMenu>
  );
}
