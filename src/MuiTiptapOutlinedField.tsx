import { makeStyles } from "tss-react/mui";
import { CollapsibleEditorMenuBar } from "./CollapsibleEditorMenuBar";
import MuiTiptapContent from "./MuiTiptapContent";
import OutlinedField from "./OutlinedField";
import { useMuiTiptapEditorContext } from "./context";
import { EDITOR_TABLE_ELEMENT_Z_INDEX, parseToNumPixels } from "./styles";
import useDebouncedFocus from "./useDebouncedFocus";

type Props = {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  hideMenuBar?: boolean;
  /**
   * If true, the menu bar will not "stick" inside the outlined editor as you
   * scroll past it.
   */
  disableStickyMenuBar?: boolean;
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

const useStyles = makeStyles({
  name: { MuiTiptapField: MuiTiptapOutlinedField },
})((theme) => {
  // When this gets embedded in an outlined input (which uses padding to ensure
  // the different border widths don't change the inner content position), we
  // have to add negative margins to have the border "reach" the edges of the
  // input container
  const extraOuterMarginCompensationPixels = 1;
  const paddingHorizontalPixels =
    parseToNumPixels(theme.spacing(0.5)) + extraOuterMarginCompensationPixels;
  return {
    root: {},

    menuBar: {
      paddingLeft: paddingHorizontalPixels,
      paddingRight: paddingHorizontalPixels,
      marginLeft: -extraOuterMarginCompensationPixels,
      marginRight: -extraOuterMarginCompensationPixels,
    },

    menuBarSticky: {
      position: "sticky",
      top: 0,
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
}: Props) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });
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
      <MuiTiptapContent />
      {children}
    </OutlinedField>
  );
}
