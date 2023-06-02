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
import type { CSSObject } from "tss-react";
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

const useStyles = makeStyles({ name: { MuiTiptapContent } })((theme) => {
  return {
    editor: {
      // We add `as CSSObject` to get around typing issues with our editor
      // styles function. For future reference, this old issue and its solution
      // are related, though not quite right
      // https://github.com/garronej/tss-react/issues/2
      // https://github.com/garronej/tss-react/commit/9dc3f6f9f70b6df0bd83cd5689c3313467fb4f06
      "& .ProseMirror": {
        ...getEditorStyles(theme),
      } as CSSObject,
    },

    editableEditor: {
      // Add padding around the input area
      padding: theme.spacing(1.5),
    },
  };
});

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
