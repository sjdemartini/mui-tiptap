import { Box } from "@mui/material";
import type { Editor as CoreEditor } from "@tiptap/core";
import type { Table } from "@tiptap/extension-table";
import {
  columnResizingPluginKey,
  tableEditingKey,
} from "@tiptap/prosemirror-tables";
import {
  EditorContent,
  getExtensionField,
  getNodeType,
  type AnyConfig,
} from "@tiptap/react";
import { useEffect, useMemo, useRef } from "react";
import { useUpdateEffect } from "react-use";
import { keyframes } from "tss-react";
import { makeStyles } from "tss-react/mui";
import LinkBubbleMenu from "./LinkBubbleMenu";
import TableBubbleMenu from "./TableBubbleMenu";
import { useMuiTiptapEditorContext } from "./context";
import { getEditorStyles } from "./styles";

export type MuiTiptapContentProps = {
  /** Optional additional className to provide to the root element. */
  className?: string;
  /**
   * If true, checks whether the current URL hash string indicates we should be
   * anchored to a specific heading, and if so, scrolls to that heading after
   * rendering editor content. Since Tiptap's editor does not add content to the
   * DOM on initial/server render, this must be set to true in order to scroll
   * after mounting.
   */
  skipScrollToAnchor?: boolean;
};

const useStyles = makeStyles({ name: { MuiTiptapContent } })((theme) => ({
  editor: {
    "& .ProseMirror": {
      ...getEditorStyles(theme),

      // So that we initially show the user name above the caret on first render
      // (e.g. when a user clicks to move their cursor, and on page load), use an
      // animation to delay updating the opacity. We'll then use transitions based
      // on :hover selectors on the caret to let users view the name again while
      // hovering thereafter. Note that we define this here and not in the
      // getEditorStyles function, since @keyframes definitions for the animation
      // cannot appear within a selector and must be a top-level definition in the
      // JSS styles. We also use a slightly different selector here ("&& ..."
      // instead of "& ..." to avoid overwriting those getEditorStyles CSS
      // properties for the label. "&&"" just adds extra specificity.)
      "&& .collaboration-cursor__label": {
        animation: `${keyframes`
            // We start at fully visible, then fade out after the user would've had a chance
            // to see/read the user name
            "0%,95%": {
              opacity: 1,
            },
            "100%": {
              opacity: 0,
            },
          `}
          3s linear 1`,
      },
    },
  },

  editableEditor: {
    // Add padding around the input area
    padding: theme.spacing(1.5),

    // We may want to restrict the height of the editor input area, since it
    // gets unwieldy to use the menu bar otherwise (particularly for an
    // "embedded" editor as opposed to full-page document editor, though we'd
    // probably set up the menu bar and page behavior differently on a
    // Confluence-like "page"). The caveat is that it could be a scrollable zone
    // inside an outer scrollable zone, which is super awkward. So don't add
    // this for now.
    // maxHeight: "calc(60vh - 80px)",
    // overflowY: "auto",
  },
}));

/**
 * Check whether there's a URL hash string indicating we should be anchored to a
 * specific heading.
 *
 * We have to do this programmatically, since when the page first loads, this
 * component and its editor content will not be mounted/rendered, so the browser
 * doesn't move to the anchor automatically. Note that we only want to do this
 * once on mount/create. When not using collaboration, we can plug into
 * `onCreate`, to be sure that our HeadingWithAnchor node-views have rendered,
 * since they happen after initial document rendering. When using collaboration,
 * we have to wait until the document content has synced.
 */
function scrollToAnchorLinkAfterRender(editor: CoreEditor) {
  if (editor.isDestroyed || !("heading" in editor.storage)) {
    // If the editor is already removed/destroyed, or the heading extension isn't
    // enabled, we can stop
    return;
  }

  const currentHash = window.location.hash;
  const elementId = currentHash.slice(1);
  if (!elementId) {
    return;
  }

  const elementForHash = window.document.getElementById(elementId);

  // We'll only scroll if the given hash points to an element that's part of our
  // editor content (e.g., ignore external Note anchors)
  if (elementForHash && editor.options.element.contains(elementForHash)) {
    elementForHash.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}

/**
 * A component for rendering a MUI-styled version of Tiptap rich text editor
 * content.
 *
 * Must be used as a child of the MuiTiptapProvider.
 */
export default function MuiTiptapContent({
  skipScrollToAnchor = false,
  className,
}: MuiTiptapContentProps) {
  const { classes, cx } = useStyles();
  const editor = useMuiTiptapEditorContext();
  const editorClasses = useMemo(
    () =>
      cx(
        className,
        classes.editor,
        editor?.isEditable && classes.editableEditor
      ),
    [className, classes, editor?.isEditable, cx]
  );

  useEffect(() => {
    if (skipScrollToAnchor || !editor) {
      return;
    }

    scrollToAnchorLinkAfterRender(editor);
  }, [skipScrollToAnchor, editor]);

  // Because we want to utilize the latest `editor` in several effect hooks
  // below, but don't want those hooks to run just due to the editor changing
  // (but rather only in response to some other property changing), we create a
  // ref to point to the current `editor` instance to use in those contexts.
  const editorRef = useRef(editor);
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useUpdateEffect(() => {
    if (!editorRef.current || editorRef.current.isDestroyed) {
      return;
    }

    // Update the editable state, since it's changed
    editorRef.current.setEditable(editorRef.current.isEditable);

    // The Table extension doesn't properly handle changes between editable=true and
    // editable=false via `setEditable`. The extension uses different markup and also
    // allows/disallows column resizing depending on `editable` state due to how it's
    // plugins are registered, and changing state with just `setEditable` doesn't
    // properly reset the extension's plugins for this behavior
    // (https://github.com/ueberdosis/tiptap/issues/2301), even on a newer version of
    // the extension (2.0.0-beta.209). We used to have `editable` be a dependency of the
    // `useEditor` hook so that we'd re-create the entire `editor` itself (and so
    // re-instantiate the extensions) any time the editable state changed, but this is
    // overkill and would lead to a "flash" when switching between `editable` true vs
    // false when using Collaboration, since the document appears blank on first render
    // of an editor when its content comes from a collaboration Y.Doc. So instead, based
    // on the logic in
    // https://github.com/ueberdosis/tiptap/blob/5fed0f2fc69fc42e7e287c84f6414b8437becb4d/packages/core/src/ExtensionManager.ts#L298-L308,
    // we simply re-register the Table plugins editor whenever we toggle `editable`.
    // This makes Table work properly, while also avoiding the need to recreate the
    // editor or have it flash blank when using collaboration. Note that we only
    // reconfigure the table plugins in particular and don't simply reconfigure *all*
    // plugins based on editor.extensionManager.plugins alone, or we'd lose any plugins
    // that were separately registered via registerPlugin.
    const tableExtension = editorRef.current.extensionManager.extensions.find(
      (extension): extension is typeof Table => extension.name == "table"
    );
    if (!tableExtension) {
      // If the table extension is for some reason not being used, we don't need to
      // reconfigure our plugins.
      return;
    }

    // First unregister the existing table plugins (noted here
    // https://github.com/ueberdosis/tiptap/blob/31c3a9aad9eb37f445eadcd27135611291178ca6/packages/extension-table/src/table.ts#L229-L245).
    // If either is not registered, the function will no-op as intended.
    editorRef.current.unregisterPlugin(tableEditingKey);
    editorRef.current.unregisterPlugin(columnResizingPluginKey);

    // Now regenerate and re-register the table plugins. Note that it should be
    // fine (preferable) for our re-registered table plugins to come last, for
    // the same reason that we put the Table extension first in our extensions
    // list at the top of this hook, since other extensions' plugins should
    // taker higher precedence. See comment above where Table is configured.
    const context = {
      name: tableExtension.name,
      options: tableExtension.options,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      storage: tableExtension.storage,
      editor: editorRef.current,
      type: getNodeType(tableExtension.name, editorRef.current.schema),
    };
    const addProseMirrorPlugins = getExtensionField<
      AnyConfig["addProseMirrorPlugins"]
    >(tableExtension, "addProseMirrorPlugins", context);
    if (addProseMirrorPlugins) {
      const updatedTablePlugins = addProseMirrorPlugins();
      updatedTablePlugins.forEach((plugin) => {
        editorRef.current?.registerPlugin(plugin);
      });
    }
  }, [editor?.isEditable]);

  return (
    <Box className={editorClasses} component={EditorContent} editor={editor}>
      {editor?.isEditable && (
        <>
          {"link" in editor.storage &&
            "linkBubbleMenuHandler" in editor.storage && (
              <LinkBubbleMenu editor={editor} />
            )}

          {"table" in editor.storage && <TableBubbleMenu editor={editor} />}
        </>
      )}
    </Box>
  );
}
