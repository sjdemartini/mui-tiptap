import { Editor as CoreEditor } from "@tiptap/core";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { History } from "@tiptap/extension-history";
import { Italic } from "@tiptap/extension-italic";
import LinkExtension from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Text } from "@tiptap/extension-text";
import {
  columnResizingPluginKey,
  tableEditingKey,
} from "@tiptap/prosemirror-tables";
import {
  AnyConfig,
  Editor,
  EditorEvents,
  getExtensionField,
  getNodeType,
  useEditor,
} from "@tiptap/react";
import { Slice } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { useEffect, useMemo, useRef } from "react";
import { useUpdateEffect } from "react-use";
import { keyframes } from "tss-react";
import { makeStyles } from "tss-react/mui";
import HeadingWithAnchor from "./extensions/HeadingWithAnchor";
import ResizableImage from "./extensions/ResizableImage";
import { getEditorStyles } from "./styles";

export type UseMuiEditorOptions = {
  /** The initial content to use when rendering the editor. */
  content?: string;
  /** Placeholder hint to show in the text input area before a user types a message. */
  placeholder?: string;
  /** Optional class name to add to the editor. */
  className?: string;
  /** Whether the content is editable. If false, content is read-only. */
  editable?: boolean;
  /** Whether to disallow using the Headings functionality. */
  disableHeadings?: boolean;
  /** Whether to disallow using the Images (inline in the doc) functionality. */
  disableImages?: boolean;
  /** Whether to disallow using the task checklist functionality. */
  disableTaskList?: boolean;
  /**
   * Callback when the editor content has changed. Useful if callers need to handle
   * saving changes in real-time for instance.
   */
  onUpdate?: (props: EditorEvents["update"]) => void;
  /**
   * Callback when the editor goes out of focus (blur event).
   */
  onBlur?: (props: EditorEvents["blur"]) => void;
  /**
   * Callback when a user drops something in the text area. Useful if callers need to
   * handle file upload events, for instance.
   *
   * Boolean return value should be `true` if the event is considered handled and
   * preventDefault should be called (also preventing further drop-handlers from
   * running). `false` if the handler is ignoring the event. See
   * https://prosemirror.net/docs/ref/#view.EditorProps for more info.
   */
  onDrop?: (
    view: EditorView,
    event: Event,
    slice: Slice,
    moved: boolean
  ) => boolean;
  /**
   * Callback when a user pastes into the text area. Useful if callers need to handle
   * paste events on top of the editor's usual behavior (such as for files being
   * pasted).
   *
   * Boolean return value should be `true` if the event is considered handled and
   * preventDefault should be called (also preventing further paste-handlers from
   * running). `false` if the handler is ignoring the event. See
   * https://prosemirror.net/docs/ref/#view.EditorProps for more info.
   */
  onPaste?: (event: ClipboardEvent) => boolean;
};

type UseMuiEditorResult = Editor | null;

const useStyles = makeStyles({ name: { useMuiEditor } })((theme) => ({
  editor: {
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
 * No-op for onUpdate and onBlur by default. Note that we provide a default so
 * that we can simply set the editor's `onUpdate`/`onBlur` properties no matter
 * what, and can update them at will via refs whenever the consumers of
 * useMuiEditor provide a new onUpdate/onBlur prop.
 */
const onUpdateDefault = () => {
  // no-op
};
const onBlurDefault = () => {
  // no-op
};

/**
 * No-op and return false so that the event is treated as unhandled. Note that
 * we provide a default so that we can simply set the editor's
 * `handleDrop`/`handlePaste` no matter what, and can update it at will via refs
 * whenever the consumers of useMuiEditor provide a new onDrop/onPaste prop.
 */
const onDropDefault = () => false;
const onPasteDefault = () => false;

// Don't treat the end cursor as "inclusive" of the Link mark, so that users can
// actually "exit" a link if it's the last element in the editor (see
// https://tiptap.dev/api/schema#inclusive and
// https://github.com/ueberdosis/tiptap/issues/2572#issuecomment-1055827817).
// This also makes the `isActive` behavior somewhat more consistent with
// `extendMarkRange` (as described here
// https://github.com/ueberdosis/tiptap/issues/2535), since a link won't be
// treated as active if the cursor is at the end of the link. One caveat of this
// approach: it seems that after creating or editing a link with the link menu
// (as opposed to having a link created via autolink), the next typed character
// will be part of the link unexpectedly, and subsequent characters will not be.
// This may have to do with how we're using `insertContent` and `setLink` in
// `useLinkMenu`, but I can't figure out an alternative approach that avoids the
// issue. This is arguably better than being "stuck" in the link without being
// able to leave it, but it is still not quite right. See the related open
// issues here:
// https://github.com/ueberdosis/tiptap/issues/2571,
// https://github.com/ueberdosis/tiptap/issues/2572, and
// https://github.com/ueberdosis/tiptap/issues/514
const CustomLinkExtension = LinkExtension.extend({
  inclusive: false,
});

// Make subscript and superscript mutually exclusive
// https://github.com/ueberdosis/tiptap/pull/1436#issuecomment-1031937768

const CustomSubscript = Subscript.extend({
  excludes: "superscript",
});

const CustomSuperscript = Superscript.extend({
  excludes: "subscript",
});

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
  if (editor.isDestroyed || !("heading" in editor.extensionStorage)) {
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
 * A hook for providing a Material-UI styled Tiptap editor.
 *
 * Generally, consumers of the editor should use something like the following:
 *
 *   const editor = useMuiEditor({...});
 *   const onSubmit = useCallback(() => submitData({html: editor.getHTML()}));
 *   return (
 *      <>
 *       <MuiEditorContent editor={editor} ... />
 *       <button onClick={onSubmit}>Save</button>
 *     </>
 *   );
 *
 * Or if you know you only need read-only behavior, you can make things simpler and more
 * efficient by instead just using the following (no need to use this hook):
 *
 *   return <MuiEditorReadOnlyViewer content="<p>..." />;
 */
export default function useMuiEditor({
  content,
  placeholder,
  className,
  disableHeadings = false,
  disableImages = false,
  disableTaskList = false,
  editable = true,
  onUpdate = onUpdateDefault,
  onBlur = onBlurDefault,
  onDrop = onDropDefault,
  onPaste = onPasteDefault,
}: UseMuiEditorOptions): UseMuiEditorResult {
  const { classes, cx } = useStyles();
  const editorClasses = useMemo(
    () => cx(className, classes.editor, editable && classes.editableEditor),
    [className, classes, editable, cx]
  );

  const extensions = useMemo(() => {
    const includedExtensions = [
      // We use some but not all of the extensions from
      // https://tiptap.dev/api/extensions/starter-kit, plus a few additional ones

      // Nodes
      // Note that the Table extension must come before other nodes that also have "tab"
      // shortcut keys so that when using the tab key within a table on a node that also
      // responds to that shortcut, it respects that inner node with higher precedence
      // than the Table. For instance, if you want to indent or dedent a list item
      // inside a table, you should be able to do that by pressing tab. Tab should only
      // move between table cells if not within such a nested node. See comment here for
      // notes on extension ordering
      // https://github.com/ueberdosis/tiptap/issues/1547#issuecomment-890848888, and
      // note in prosemirror-tables on the need to have these plugins be lower
      // precedence
      // https://github.com/ueberdosis/prosemirror-tables/blob/1a0428af3ca891d7db648ce3f08a2c74d47dced7/src/index.js#L26-L30
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      Blockquote,
      BulletList,
      CodeBlock,
      Document,
      HardBreak,
      ListItem,
      OrderedList,
      Paragraph,
      CustomSubscript,
      CustomSuperscript,
      Text,

      // Marks
      Bold,
      Code,
      Italic,
      Strike,
      CustomLinkExtension.configure({
        // autolink is generally useful for changing text into links if they appear to be URLs (like
        // someone types in literally "example.com"), though it comes with the caveat that if you
        // then *remove* the link from the text, and then add a space or newline directly after the
        // text, autolink will turn the text back into a link again. Not ideal, but probably still
        // overall worth having autolink enabled.
        autolink: true,
        linkOnPaste: true,
        // We should set this to true when read-only
        openOnClick: false,
      }),

      // Extensions
      Gapcursor,
    ];

    if (!disableHeadings) {
      includedExtensions.push(
        HeadingWithAnchor.configure({
          // People probably shouldn't need more than 3 levels of headings, so keep a more
          // minimal set (than the default 6) to keep things simpler and less chaotic.
          levels: [1, 2, 3],
        })
      );
    }

    if (!disableImages) {
      includedExtensions.push(
        ResizableImage,

        // When images are dragged, we want to show the "drop cursor" for where they'll
        // land
        Dropcursor
      );
    }

    if (!disableTaskList) {
      includedExtensions.push(
        TaskList,
        TaskItem.configure({
          nested: true,
        })
      );
    }

    if (placeholder) {
      includedExtensions.push(
        Placeholder.configure({
          placeholder,
        })
      );
    }

    // We use the regular `History` (undo/redo) extension when not using
    // collaborative editing
    // TODO(Steven DeMartini): Add explicit support for a collaboration provider
    includedExtensions.push(History);

    return includedExtensions;
  }, [disableHeadings, disableImages, disableTaskList, placeholder]);

  // Create refs for the onUpdate and onPaste functions, and update them on each render,
  // so the handler uses the latest version of the prop function provided by the user of
  // useMuiEditor (without requiring us to reset the editor attributes)
  const onUpdateRef = useRef(onUpdate);
  const onBlurRef = useRef(onBlur);
  const onDropRef = useRef(onDrop);
  const onPasteRef = useRef(onPaste);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onBlurRef.current = onBlur;
    onDropRef.current = onDrop;
    onPasteRef.current = onPaste;
  });

  const handleCreate = ({ editor }: EditorEvents["create"]) => {
    scrollToAnchorLinkAfterRender(editor);
  };

  // The CSS classes can change if the palette is changed between dark and light mode.
  // We use `setOptions` via `useUpdateEffect` below rather than passing
  // `classes.editor` in the dependency array of `useEditor`, since we don't want to
  // re-create the editor and lose editor state just from changing between dark/light
  // modes. (The same does not work for `extensions`, which seems to have no effect via
  // `setOptions` and instead requires editor reconstruction.) Similarly for
  // `setContent` when the `content` prop changes, since we shouldn't bother
  // destroying/rebuilding the editor again just to change the content.
  const editor = useEditor(
    {
      editable,
      extensions,
      content: content,
      onCreate: handleCreate,
      onBlur: (props) => onBlurRef.current(props),
      onUpdate: (props) => onUpdateRef.current(props),
      editorProps: {
        attributes: {
          class: editorClasses,
        },
        handleDrop: (view, event, slice, moved) =>
          onDropRef.current(view, event, slice, moved),
        handlePaste: (view, event, _slice) => onPasteRef.current(event),
      },
    },
    [extensions]
  );
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
    editorRef.current.setEditable(editable);

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
    // plugins based on editor.extenionsManager.plugins alone, or we'd lose any plugins
    // that were separately registered via registerPlugin (like our link menu plugin).
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
  }, [editable]);

  // We use useUpdateEffect (rather than useEffect) for properties below, since
  // we'll have already set the properties when instantiating the editor above
  // on first render (which is necessary to ensure initial state is correct), so
  // it would be redundant to call again here the first time.
  useUpdateEffect(() => {
    if (!editorRef.current || editorRef.current.isDestroyed) {
      return;
    }
    editorRef.current.setOptions({
      editorProps: {
        attributes: {
          class: editorClasses,
        },
      },
    });
  }, [editorClasses]);

  useUpdateEffect(() => {
    if (!editorRef.current || editorRef.current.isDestroyed) {
      return;
    }

    editorRef.current.commands.setContent(content ?? "");
  }, [content]);

  return editor;
}
