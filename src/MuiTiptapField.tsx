import { makeStyles } from "tss-react/mui";
import { CollapsibleEditorMenuBar } from "./CollapsibleEditorMenuBar";
import MuiTiptapContent from "./MuiTiptapContent";
import OutlinedField from "./OutlinedField";
import { useMuiTiptapEditorContext } from "./context";
import { parseToNumPixels } from "./styles";
import useDebouncedFocus from "./useDebouncedFocus";

type Props = {
  className?: string;
  disabled?: boolean;
  hideMenuBar?: boolean;
  children?: React.ReactNode;
};

const useStyles = makeStyles({ name: { MuiTiptapField } })((theme) => {
  // When this gets embedded in an outlined input (which uses padding to ensure
  // the different border widths don't change the inner content position), we
  // have to add negative margins to have the border "reach" the edges of the
  // input container
  const extraOuterMarginCompensationPixels = 1;
  const paddingHorizontalPixels =
    parseToNumPixels(theme.spacing(0.5)) + extraOuterMarginCompensationPixels;
  return {
    menuBar: {
      paddingLeft: paddingHorizontalPixels,
      paddingRight: paddingHorizontalPixels,
      marginLeft: -extraOuterMarginCompensationPixels,
      marginRight: -extraOuterMarginCompensationPixels,
    },
  };
});

/**
 * A version of the MUI Tiptap editor including the content and menu bar, with
 * an interface like the material-ui TextField with the "outlined" variant.
 */
export default function MuiTiptapField({
  disabled,
  className,
  hideMenuBar = false,
  children,
}: Props) {
  const { classes } = useStyles();
  const editor = useMuiTiptapEditorContext();

  // Because the user interactions with the editor menu bar buttons unfocus the editor
  // (since it's not part of the editor content), we'll debounce our visual focused
  // state of the OutlinedField so that it doesn't "flash" when that happens
  const isOutlinedFieldFocused = useDebouncedFocus({ editor });

  return (
    <OutlinedField
      focused={isOutlinedFieldFocused}
      disabled={disabled}
      className={className}
    >
      <CollapsibleEditorMenuBar
        open={!hideMenuBar}
        className={classes.menuBar}
      />
      <MuiTiptapContent />
      {children}
    </OutlinedField>
  );
}
