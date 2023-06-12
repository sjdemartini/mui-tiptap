import type { Editor } from "@tiptap/react";
import { makeStyles } from "tss-react/mui";
import MenuBar from "./MenuBar";
import OutlinedField from "./OutlinedField";
import RichTextContent from "./RichTextContent";
import classNames from "./classNames";
import { useRichTextEditorContext } from "./context";
import useDebouncedFocus from "./hooks/useDebouncedFocus";
import DebounceRender from "./utils/DebounceRender";

export type RichTextFieldProps = {
  /** Which style to use for */
  variant?: "outlined" | "standard";
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
  footer?: React.ReactNode;
  /**
   * Whether to hide the editor menu bar. When toggling between true and false,
   * uses a collapse animation.
   */
  hideMenuBar?: boolean;
  /**
   * Render the controls content to show inside the menu bar. Typically will be
   * set to render a <MenuControlsContainer> containing several MenuButton*
   * components, depending on what controls you want to include in the menu bar
   * (and what extensions you've enabled).
   */
  renderControls?: (editor: Editor | null) => React.ReactNode;
  /**
   * If true, the controls rendered via `renderControls` will not be debounced.
   * If not debounced, then upon every editor interaction (caret movement,
   * character typed, etc.), the entire renderControls content will re-render,
   * which tends to be very expensive and can bog down the editor performance,
   * so debouncing is generally recommended. By default false.
   */
  disableDebounceRenderControls?: boolean;
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

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const useStyles = makeStyles<void, "menuBar" | "content">({
  name: { RichTextField },
  uniqId: "E2Alw3", // https://docs.tss-react.dev/nested-selectors#ssr
})((theme, _params, classes) => {
  return {
    // This first class is added to allow convenient user overrides. Users can
    // similarly override the other classes below.
    root: {},

    standard: {
      // We don't need horizontal spacing when not using the outlined variant
      [`& .${classes.content}`]: {
        padding: theme.spacing(1.5, 0),
      },

      [`& .${classes.menuBar}`]: {
        padding: theme.spacing(1, 0),
      },
    },

    outlined: {
      // Add padding around the input area and menu bar, since they're
      // contained in the outline
      [`& .${classes.content}`]: {
        padding: theme.spacing(1.5),
      },

      [`& .${classes.menuBar}`]: {
        padding: theme.spacing(1, 1.5),
      },
    },

    menuBar: {},
    content: {},
  };
});

/**
 * A version of the MUI Tiptap editor including the content and menu bar, with
 * an interface like the material-ui TextField with the "outlined" variant.
 */
export default function RichTextField({
  variant = "outlined",
  renderControls,
  disableDebounceRenderControls = false,
  disabled,
  className,
  classes: overrideClasses = {},
  footer,
  hideMenuBar = false,
  disableStickyMenuBar = false,
  stickyMenuBarOffset,
}: RichTextFieldProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });
  const editor = useRichTextEditorContext();

  // Because the user interactions with the editor menu bar buttons unfocus the
  // editor (since it's not part of the editor content), we'll debounce our
  // visual focused state of the OutlinedField so that it doesn't "flash" when
  // that happens
  const isOutlinedFieldFocused = useDebouncedFocus({ editor });

  const content = (
    <>
      {renderControls && (
        <MenuBar
          className={classes.menuBar}
          hide={hideMenuBar}
          disableSticky={disableStickyMenuBar}
          stickyOffset={stickyMenuBarOffset}
        >
          {disableDebounceRenderControls ? (
            renderControls(editor)
          ) : (
            <DebounceRender>{renderControls(editor)}</DebounceRender>
          )}
        </MenuBar>
      )}
      <RichTextContent className={classes.content} />
      {footer}
    </>
  );

  return variant === "outlined" ? (
    <OutlinedField
      focused={!disabled && isOutlinedFieldFocused}
      disabled={disabled}
      className={cx(
        classNames.RichTextField,
        className,
        classes.root,
        classes.outlined
      )}
    >
      {content}
    </OutlinedField>
  ) : (
    <div
      className={cx(
        classNames.RichTextField,
        className,
        classes.root,
        classes.standard
      )}
    >
      {content}
    </div>
  );
}
