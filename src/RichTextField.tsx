import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import FieldContainer, { type FieldContainerProps } from "./FieldContainer";
import MenuBar, { type MenuBarProps } from "./MenuBar";
import RichTextContent, { type RichTextContentProps } from "./RichTextContent";
import { useRichTextEditorContext } from "./context";
import useDebouncedFocus from "./hooks/useDebouncedFocus";
import { getUtilityClasses } from "./styles";
import DebounceRender from "./utils/DebounceRender";

export type RichTextFieldClasses = ReturnType<typeof useStyles>["classes"];

export type RichTextFieldProps = Except<
  FieldContainerProps,
  "children" | "className" | "classes" | "focused" | "disabled"
> & {
  /**
   * Which style to use for the field. "outlined" shows a border around the controls,
   * editor, and footer, which updates depending on hover/focus states, like MUI's
   * OutlinedInput. "standard" does not include any outer border.
   */
  variant?: "outlined" | "standard";
  /** Class applied to the root element. */
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
   * The controls content to show inside the menu bar. Typically will be set to
   * a <MenuControlsContainer> containing several MenuButton* components,
   * depending on what controls you want to include in the menu bar (and what
   * extensions you've enabled).
   */
  controls?: React.ReactNode;
  /**
   * If true, the controls rendered via `controls` will not be debounced. If not
   * debounced, then upon every editor interaction (caret movement, character
   * typed, etc.), the entire controls content will re-render, which tends to be
   * very expensive and can bog down the editor performance, so debouncing is
   * generally recommended. Controls are often expensive since they need to
   * check a lot of editor state, with `editor.can()` commands and whatnot. By
   * default false.
   */
  disableDebounceRenderControls?: boolean;
  /** Override or extend existing styles. */
  classes?: Partial<RichTextFieldClasses>;
  /**
   * Override any props for the child MenuBar component (rendered if `controls`
   * is provided).
   */
  MenuBarProps?: Partial<MenuBarProps>;
  /**
   * Override any props for the child RichTextContent component.
   */
  RichTextContentProps?: Partial<RichTextContentProps>;
};

const richTextFieldClasses: RichTextFieldClasses = getUtilityClasses(
  "RichTextField",
  ["root", "standard", "outlined", "menuBar", "menuBarContent", "content"],
);

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const useStyles = makeStyles<void, "menuBar" | "menuBarContent" | "content">({
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

      [`& .${classes.menuBarContent}`]: {
        padding: theme.spacing(1, 0),
      },
    },

    outlined: {
      // Add padding around the input area and menu bar, since they're
      // contained in the outline
      [`& .${classes.content}`]: {
        padding: theme.spacing(1.5),
      },

      [`& .${classes.menuBarContent}`]: {
        padding: theme.spacing(1, 1.5),
      },
    },

    menuBar: {},
    menuBarContent: {},
    content: {},
  };
});

/**
 * Renders the Tiptap rich text editor content and a controls menu bar.
 *
 * With the "outlined" variant, renders a bordered UI similar to the Material UI
 * `TextField`. The "standard" variant does not have an outline/border.
 *
 * Must be a child of the RichTextEditorProvider so that the `editor` context is
 * available.
 */
export default function RichTextField({
  variant = "outlined",
  controls,
  disableDebounceRenderControls = false,
  disabled,
  className,
  classes: overrideClasses = {},
  footer,
  MenuBarProps,
  RichTextContentProps,
  ...fieldContainerProps
}: RichTextFieldProps) {
  const { classes, cx } = useStyles(undefined, {
    props: { classes: overrideClasses },
  });
  const editor = useRichTextEditorContext();

  // Because the user interactions with the editor menu bar buttons unfocus the editor
  // (since it's not part of the editor content), we'll debounce our visual focused
  // state so that the (outlined) field focus styles don't "flash" whenever that happens
  const isFieldFocused = useDebouncedFocus({ editor });

  return (
    <FieldContainer
      {...fieldContainerProps}
      variant={variant}
      focused={!disabled && isFieldFocused}
      disabled={disabled}
      className={cx(
        richTextFieldClasses.root,
        classes.root,
        variant === "outlined"
          ? [richTextFieldClasses.outlined, classes.outlined]
          : [richTextFieldClasses.standard, classes.standard],
        className,
      )}
    >
      {controls && (
        <MenuBar
          {...MenuBarProps}
          classes={{
            ...MenuBarProps?.classes,
            root: cx(
              richTextFieldClasses.menuBar,
              classes.menuBar,
              MenuBarProps?.classes?.root,
            ),
            content: cx(
              richTextFieldClasses.content,
              classes.menuBarContent,
              MenuBarProps?.classes?.content,
            ),
          }}
        >
          {disableDebounceRenderControls ? (
            controls
          ) : (
            <DebounceRender>{controls}</DebounceRender>
          )}
        </MenuBar>
      )}

      <RichTextContent
        {...RichTextContentProps}
        className={cx(
          richTextFieldClasses.content,
          classes.content,
          RichTextContentProps?.className,
        )}
      />

      {footer}
    </FieldContainer>
  );
}
