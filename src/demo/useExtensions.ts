import type { EditorOptions } from "@tiptap/core";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Color } from "@tiptap/extension-color";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { FontFamily } from "@tiptap/extension-font-family";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Highlight } from "@tiptap/extension-highlight";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { Mention } from "@tiptap/extension-mention";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Text } from "@tiptap/extension-text";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { useMemo } from "react";
import {
  FontSize,
  HeadingWithAnchor,
  LinkBubbleMenuHandler,
  ResizableImage,
  TableImproved,
} from "../";
import { mentionSuggestionOptions } from "./mentionSuggestionOptions";

export type UseExtensionsOptions = {
  /** Placeholder hint to show in the text input area before a user types a message. */
  placeholder?: string;
};

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
// the LinkBubbleMenu, but I can't figure out an alternative approach that
// avoids the issue. This is arguably better than being "stuck" in the link
// without being able to leave it, but it is still not quite right. See the
// related open issues here:
// https://github.com/ueberdosis/tiptap/issues/2571,
// https://github.com/ueberdosis/tiptap/issues/2572, and
// https://github.com/ueberdosis/tiptap/issues/514
const CustomLinkExtension = Link.extend({
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
 * A hook for providing a default set of useful extensions for the MUI-Tiptap
 * editor.
 */
export default function useExtensions({
  placeholder,
}: UseExtensionsOptions = {}): EditorOptions["extensions"] {
  return useMemo(() => {
    return [
      // We incorporate all of the functionality that's part of
      // https://tiptap.dev/api/extensions/starter-kit, plus a few additional
      // extensions, including mui-tiptap's

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
      TableImproved.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

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

      // Blockquote must come after Bold, since we want the "Cmd+B" shortcut to
      // have lower precedence than the Blockquote "Cmd+Shift+B" shortcut.
      // Otherwise using "Cmd+Shift+B" will mistakenly toggle the bold mark.
      // (See https://github.com/ueberdosis/tiptap/issues/4005,
      // https://github.com/ueberdosis/tiptap/issues/4006)
      Bold,
      Blockquote,

      Code,
      Italic,
      Underline,
      Strike,
      CustomLinkExtension.configure({
        // autolink is generally useful for changing text into links if they
        // appear to be URLs (like someone types in literally "example.com"),
        // though it comes with the caveat that if you then *remove* the link
        // from the text, and then add a space or newline directly after the
        // text, autolink will turn the text back into a link again. Not ideal,
        // but probably still overall worth having autolink enabled, and that's
        // how a lot of other tools behave as well.
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
      }),
      LinkBubbleMenuHandler,

      // Extensions
      Gapcursor,
      HeadingWithAnchor,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({ multicolor: true }),
      HorizontalRule,

      ResizableImage,
      // When images are dragged, we want to show the "drop cursor" for where they'll
      // land
      Dropcursor,

      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      Mention.configure({
        suggestion: mentionSuggestionOptions,
      }),

      Placeholder.configure({
        placeholder,
      }),

      // We use the regular `History` (undo/redo) extension when not using
      // collaborative editing
      History,
    ];
  }, [placeholder]);
}
