import {
  AddPhotoAlternate,
  Code as CodeIcon,
  FormatBold,
  FormatClear,
  FormatIndentDecrease,
  FormatIndentIncrease,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Link as LinkIcon,
  StrikethroughS,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { BiCodeBlock, BiTable } from "react-icons/bi";
import { MdChecklist } from "react-icons/md";
import { makeStyles } from "tss-react/mui";
import EditorMenuButton from "./EditorMenuButton";
import EditorMenuDivider from "./EditorMenuDivider";
import EditorMenuSelectOption from "./EditorMenuHeadingSelect";
import { useMuiTiptapEditorContext } from "./context";
import debounceRender from "./utils/debounceRender";
import { isTouchDevice } from "./utils/platform";

export interface EditorMenuBarProps {
  onAddImagesClick?: () => void;
  /** If true, the indent/unindent buttons show up, even if not using a touch device. */
  alwaysShowIndentButtons?: boolean;
  className?: string;
}

const useStyles = makeStyles({ name: { EditorMenuBarInner } })((theme) => {
  return {
    root: {
      display: "flex",
      padding: theme.spacing(0.8, 0.5),
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
    },
  };
});

// For the list of pre-configured shortcuts, see
// https://tiptap.dev/api/keyboard-shortcuts

function EditorMenuBarInner({
  onAddImagesClick,
  alwaysShowIndentButtons = false,
  className,
}: EditorMenuBarProps) {
  const editor = useMuiTiptapEditorContext();
  const { classes, cx } = useStyles();
  return (
    <div className={cx(classes.root, className)}>
      <Grid container columnSpacing={0.5} rowSpacing={0.3} alignItems="center">
        {!!editor && "heading" in editor.storage && (
          <Grid item>
            <EditorMenuSelectOption editor={editor} />
          </Grid>
        )}

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Bold"
            tooltipShortcutKeys={["mod", "B"]}
            IconComponent={FormatBold}
            value="bold"
            selected={editor?.isActive("bold") ?? false}
            disabled={!editor?.can().toggleBold()}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Italic"
            tooltipShortcutKeys={["mod", "I"]}
            IconComponent={FormatItalic}
            value="italic"
            selected={editor?.isActive("italic") ?? false}
            disabled={!editor?.can().toggleItalic()}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Strikethrough"
            tooltipShortcutKeys={["mod", "Shift", "X"]}
            IconComponent={StrikethroughS}
            value="strike"
            selected={editor?.isActive("strike") ?? false}
            disabled={!editor?.can().toggleStrike()}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Subscript"
            tooltipShortcutKeys={["mod", ","]}
            IconComponent={SubscriptIcon}
            value="subscript"
            selected={editor?.isActive("subscript") ?? false}
            disabled={!editor?.can().toggleSubscript()}
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Superscript"
            tooltipShortcutKeys={["mod", "."]}
            IconComponent={SuperscriptIcon}
            value="superscript"
            selected={editor?.isActive("superscript") ?? false}
            disabled={!editor?.can().toggleSuperscript()}
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuDivider />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Link"
            tooltipShortcutKeys={["mod", "Shift", "U"]}
            IconComponent={LinkIcon}
            value="addLink"
            selected={editor?.isActive("link")}
            onClick={editor?.commands.openLinkBubbleMenu}
          />
        </Grid>

        <Grid item>
          <EditorMenuDivider />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Ordered list"
            tooltipShortcutKeys={["mod", "Shift", "7"]}
            IconComponent={FormatListNumbered}
            value="orderedList"
            selected={editor?.isActive("orderedList") ?? false}
            disabled={!editor?.can().toggleOrderedList()}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Bulleted list"
            tooltipShortcutKeys={["mod", "Shift", "8"]}
            IconComponent={FormatListBulleted}
            value="bulletList"
            selected={editor?.isActive("bulletList") ?? false}
            disabled={!editor?.can().toggleBulletList()}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
        </Grid>

        {editor && "taskList" in editor.storage && (
          <Grid item>
            <EditorMenuButton
              tooltipLabel="Task checklist"
              tooltipShortcutKeys={["mod", "Shift", "9"]}
              IconComponent={MdChecklist}
              value="taskList"
              selected={editor.isActive("taskList")}
              disabled={!editor.can().toggleTaskList()}
              onClick={() => editor.chain().focus().toggleTaskList().run()}
            />
          </Grid>
        )}

        {/* On touch devices, we'll show indent/unindent buttons, since they're
        unlikely to have a keyboard that will allow for using Tab/Shift+Tab.
        These buttons probably aren't necessary for keyboard users and would add
        extra clutter. */}
        {(alwaysShowIndentButtons || isTouchDevice()) && (
          <>
            <Grid item>
              <EditorMenuButton
                tooltipLabel="Indent"
                tooltipShortcutKeys={["Tab"]}
                IconComponent={FormatIndentIncrease}
                value="sinkListItem"
                disabled={!editor?.can().sinkListItem("listItem")}
                onClick={() =>
                  editor?.chain().focus().sinkListItem("listItem").run()
                }
              />
            </Grid>

            <Grid item>
              <EditorMenuButton
                tooltipLabel="Unindent"
                tooltipShortcutKeys={["Shift", "Tab"]}
                IconComponent={FormatIndentDecrease}
                value="liftListItem"
                disabled={!editor?.can().liftListItem("listItem")}
                onClick={() =>
                  editor?.chain().focus().liftListItem("listItem").run()
                }
              />
            </Grid>
          </>
        )}

        <Grid item>
          <EditorMenuDivider />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Blockquote"
            tooltipShortcutKeys={["mod", "Shift", "B"]}
            IconComponent={FormatQuote}
            value="blockquote"
            selected={editor?.isActive("blockquote") ?? false}
            disabled={!editor?.can().toggleBlockquote()}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuDivider />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Code"
            tooltipShortcutKeys={["mod", "E"]}
            IconComponent={CodeIcon}
            value="code"
            selected={editor?.isActive("code") ?? false}
            disabled={!editor?.can().toggleCode()}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Code block"
            tooltipShortcutKeys={["mod", "Alt", "C"]}
            IconComponent={BiCodeBlock}
            value="codeBlock"
            selected={editor?.isActive("codeBlock") ?? false}
            disabled={!editor?.can().toggleCodeBlock()}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          />
        </Grid>

        {editor && "image" in editor.storage && onAddImagesClick && (
          <>
            <Grid item>
              <EditorMenuDivider />
            </Grid>

            <Grid item>
              <EditorMenuButton
                tooltipLabel="Upload an image"
                IconComponent={AddPhotoAlternate}
                value="addImage"
                disabled={!editor.can().setImage({ src: "http://example.com" })}
                onClick={onAddImagesClick}
              />
            </Grid>
          </>
        )}

        <Grid item>
          <EditorMenuDivider />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Insert table"
            IconComponent={BiTable}
            value="insertTable"
            disabled={!editor?.can().insertTable()}
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          />
        </Grid>

        <Grid item>
          <EditorMenuDivider />
        </Grid>

        <Grid item>
          <EditorMenuButton
            tooltipLabel="Remove inline formatting"
            IconComponent={FormatClear}
            value="unsetAllMarks"
            disabled={!editor?.can().unsetAllMarks()}
            onClick={() => editor?.chain().focus().unsetAllMarks().run()}
          />
        </Grid>
      </Grid>
    </div>
  );
}

// We use a debounced render here, since otherwise this renders per editor state change
// (e.g. for every character typed or cursor movement), which can bog things down a bit,
// like when holding down backspace or typing very quickly. We do want/need it to update
// very frequently, since we need the menu bar to reflect the state of the current
// cursor position and editor nodes/marks, etc., but we want rendering to stay
// performant, so this is a reasonable enough balance. Google Docs seems to do something
// similar, based on some barely-noticeable delay between action/movement and menu bar
// state.
const EditorMenuBar = debounceRender(EditorMenuBarInner, 170, {
  maxWait: 300,
});

export default EditorMenuBar;
