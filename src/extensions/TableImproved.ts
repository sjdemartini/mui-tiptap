import { Table } from "@tiptap/extension-table";
import { columnResizing, tableEditing } from "@tiptap/prosemirror-tables";

/**
 * Extend the standard Table extension, but ensures that columns maintain their
 * previously set widths even when `editable=false`.
 */
const TableImproved = Table.extend({
  // This function is taken directly from
  // https://github.com/ueberdosis/tiptap/blob/31c3a9aad9eb37f445eadcd27135611291178ca6/packages/extension-table/src/table.ts#L229-L245,
  // except overridden to always include `columnResizing`, even if `editable` is
  // false. We update our RichTextContent styles so that the table resizing
  // controls are not visible when `editable` is false, and since the editor
  // itself has contenteditable=false, the table will remain read-only. By doing
  // this, we can ensure that column widths are preserved when editable is false
  // (otherwise any dragged column widths are ignored when editable is false, as
  // reported here https://github.com/ueberdosis/tiptap/issues/2041). Moreover,
  // we do not need any hacky workarounds to ensure that the necessary table
  // extensions are reset when the editable state changes (since the resizable
  // extension will be omitted if not initially editable, or wouldn't be removed
  // if initially not editable if we relied on it being removed, as reported
  // here https://github.com/ueberdosis/tiptap/issues/2301, which was not
  // resolved despite what the OP there later said).
  addProseMirrorPlugins() {
    const isResizable = this.options.resizable;

    return [
      ...(isResizable
        ? [
            columnResizing({
              handleWidth: this.options.handleWidth,
              cellMinWidth: this.options.cellMinWidth,
              View: this.options.View,
              // TODO: PR for @types/prosemirror-tables
              // @ts-expect-error (incorrect type)
              lastColumnResizable: this.options.lastColumnResizable,
            }),
          ]
        : []),

      tableEditing({
        allowTableNodeSelection: this.options.allowTableNodeSelection,
      }),
    ];
  },
});

export default TableImproved;
