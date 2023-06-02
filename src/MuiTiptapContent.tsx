import { Box } from "@mui/material";
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
import classNames from "./classNames";
import { useMuiTiptapEditorContext } from "./context";
import { getEditorStyles } from "./styles";

export type MuiTiptapContentProps = {
  /** Optional additional className to provide to the root element. */
  className?: string;
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
 * A component for rendering a MUI-styled version of Tiptap rich text editor
 * content.
 *
 * Must be used as a child of the MuiTiptapProvider.
 */
export default function MuiTiptapContent({ className }: MuiTiptapContentProps) {
  const { classes, cx } = useStyles();
  const editor = useMuiTiptapEditorContext();
  const editorClasses = useMemo(
    () =>
      cx(
        classNames.MuiTiptapContent,
        className,
        classes.editor,
        editor?.isEditable && classes.editableEditor
      ),
    [className, classes, editor?.isEditable, cx]
  );

  // In order to utilize the latest `editor` in effect hooks below, but avoid
  // those hooks running just due to the editor changing (rather only run in
  // response to some other dependencies changing), we create a ref to point to
  // the current `editor` instance to use in those contexts.
  const editorRef = useRef(editor);
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Whenever the editor's `editable` state changes, we need to refresh our
  // plugins to get the Table extension to properly reflect the current state.
  useUpdateEffect(() => {
    if (!editorRef.current || editorRef.current.isDestroyed) {
      return;
    }

    // The Table extension doesn't properly handle changes between editable=true
    // and editable=false via `setEditable`. The extension uses different markup
    // and also allows/disallows column resizing depending on `editable` state
    // due to how it's plugins are registered, and changing state with just
    // `setEditable` doesn't properly reset the extension's plugins for this
    // behavior (https://github.com/ueberdosis/tiptap/issues/2301), even on a
    // newer version of the extension (2.0.0-beta.209). Callers could have
    // `editable` be a dependency of the `useEditor` hook itself so that we'd
    // re-create the entire `editor` (and so re-instantiate the extensions) any
    // time the editable state changed, but this is overkill and would lead to a
    // "flash" when switching between `editable` true vs false when using
    // Collaboration, since the document appears blank on first render of an
    // editor when its content comes from a collaboration Y.Doc. So instead,
    // based on the logic in
    // https://github.com/ueberdosis/tiptap/blob/5fed0f2fc69fc42e7e287c84f6414b8437becb4d/packages/core/src/ExtensionManager.ts#L298-L308,
    // we simply re-register the Table plugins editor whenever we toggle
    // `editable`. This makes Table work properly, while also avoiding the need
    // to recreate the editor or have it flash blank when using collaboration.
    // Note that we only reconfigure the table plugins in particular and don't
    // simply reconfigure *all* plugins based on editor.extensionManager.plugins
    // alone, or we'd lose any plugins that were separately registered via
    // registerPlugin.
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
