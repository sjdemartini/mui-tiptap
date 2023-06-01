import { makeStyles } from "tss-react/mui";
import { CollapsibleEditorMenuBar } from "./CollapsibleEditorMenuBar";
import MuiTiptapContent from "./MuiTiptapContent";
import OutlinedField from "./OutlinedField";
import { useMuiTiptapEditorContext } from "./context";
import { EDITOR_TABLE_ELEMENT_Z_INDEX, parseToNumPixels } from "./styles";
import useDebouncedFocus from "./useDebouncedFocus";

export type MuiTiptapOutlinedFieldProps = {
  /** Class applied to the outlined field, the outermost `root` element. */
  className?: string;
  /**
   * Whether the outlined field should appear as disabled. Typically the
   * editor's `editable` field would also be set to `false` when setting this to
   * true.
   */
  disabled?: boolean;
  /**
   * Any additional content to render inside the outlined field, below the
   * editor content.
   */
  children?: React.ReactNode;
  /**
   * Whether to hide the editor menu bar. When toggling between true and false,
   * uses a collapse animation.
   */
  hideMenuBar?: boolean;
  /**
   * If true, the menu bar will not "stick" inside the outlined editor as you
   * scroll past it.
   */
  disableStickyMenuBar?: boolean;
  /**
   * The menu bar's sticky `top` offset, when `disableStickyMenuBar=false`.
   * Useful if there's other fixed/sticky content above the editor (like an app
   * navigation toolbar). By default 0.
   */
  stickyMenuBarOffset?: number;
  /** Override or extend existing styles. */
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

const useStyles = makeStyles<{ stickyMenuBarOffset?: number }>({
  name: { MuiTiptapOutlinedField },
})((theme, { stickyMenuBarOffset }) => {
  // When this gets embedded in an outlined input (which uses padding to ensure
  // the different border widths don't change the inner content position), we
  // have to add negative margins to have the border "reach" the edges of the
  // input container
  const extraOuterMarginCompensationPixels = 1;
  const paddingHorizontalPixels =
    parseToNumPixels(theme.spacing(0.5)) + extraOuterMarginCompensationPixels;
  return {
    // `root` and `content` are added to allow convenient user overrides
    root: {},
    content: {},

    menuBar: {
      paddingLeft: paddingHorizontalPixels,
      paddingRight: paddingHorizontalPixels,
      marginLeft: -extraOuterMarginCompensationPixels,
      marginRight: -extraOuterMarginCompensationPixels,
    },

    menuBarSticky: {
      position: "sticky",
      top: stickyMenuBarOffset ?? 0,
      // This should sit on top of editor components
      zIndex: EDITOR_TABLE_ELEMENT_Z_INDEX + 1,
      background: theme.palette.background.default,
    },
  };
});

/**
 * A version of the MUI Tiptap editor including the content and menu bar, with
 * an interface like the material-ui TextField with the "outlined" variant.
 */
export default function MuiTiptapOutlinedField({
  disabled,
  className,
  classes: overrideClasses = {},
  children,
  hideMenuBar = false,
  disableStickyMenuBar = false,
  stickyMenuBarOffset,
}: MuiTiptapOutlinedFieldProps) {
  const { classes, cx } = useStyles(
    { stickyMenuBarOffset },
    {
      props: { classes: overrideClasses },
    }
  );
  const editor = useMuiTiptapEditorContext();

  // Because the user interactions with the editor menu bar buttons unfocus the editor
  // (since it's not part of the editor content), we'll debounce our visual focused
  // state of the OutlinedField so that it doesn't "flash" when that happens
  const isOutlinedFieldFocused = useDebouncedFocus({ editor });

  return (
    <OutlinedField
      focused={isOutlinedFieldFocused}
      disabled={disabled}
      className={cx(className, classes.root)}
    >
      <CollapsibleEditorMenuBar
        open={!hideMenuBar}
        classes={{
          // Note that we have to apply the sticky CSS classes to the container
          // (rather than the menu bar itself) in order for it to behave
          // properly
          menuBarContainer: cx(!disableStickyMenuBar && classes.menuBarSticky),
        }}
        className={classes.menuBar}
      />
      <MuiTiptapContent className={classes.content} />
      {children}
    </OutlinedField>
  );
}
