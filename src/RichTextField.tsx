import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import FieldContainer, { type FieldContainerProps } from "./FieldContainer";
import MenuBar, { type MenuBarProps } from "./MenuBar";
import RichTextContent, { type RichTextContentProps } from "./RichTextContent";
import {
  richTextFieldClasses,
  type RichTextFieldClassKey,
  type RichTextFieldClasses,
} from "./RichTextField.classes";
import { useRichTextEditorContext } from "./context";
import useDebouncedFocus from "./hooks/useDebouncedFocus";
import { getUtilityComponentName } from "./styles";
import DebounceRender from "./utils/DebounceRender";

export type RichTextFieldProps = Omit<
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
  footer?: ReactNode;
  /**
   * The controls content to show inside the menu bar. Typically will be set to
   * a <MenuControlsContainer> containing several MenuButton* components,
   * depending on what controls you want to include in the menu bar (and what
   * extensions you've enabled).
   */
  controls?: ReactNode;
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
  /** Provide custom styles. */
  sx?: SxProps;
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

interface RichTextFieldOwnerState
  extends Pick<
    RichTextFieldProps,
    "variant" | "disabled" | "disableDebounceRenderControls"
  > {}

const componentName = getUtilityComponentName("RichTextField");

const RichTextFieldRoot = styled(FieldContainer, {
  name: componentName,
  slot: "root" satisfies RichTextFieldClassKey,
  overridesResolver: (
    props: { ownerState: RichTextFieldOwnerState },
    styles,
  ) => [
    styles.root,
    props.ownerState.variant === "outlined" && styles.outlined,
    props.ownerState.variant === "standard" && styles.standard,
  ],
})<{ ownerState: RichTextFieldOwnerState }>(({ theme, ownerState }) => ({
  // This first class is added to allow convenient user overrides. Users can
  // similarly override the other classes below.

  // TODO(Steven DeMartini): We could seemingly switch to using `styled()`
  // wrappers for the content and menu bar elements, and apply the styles
  // directly rather than with nested selectors.
  ...(ownerState.variant === "standard" && {
    // We don't need horizontal spacing when not using the outlined variant
    [`& .${richTextFieldClasses.content}`]: {
      padding: theme.spacing(1.5, 0),
    },

    [`& .${richTextFieldClasses.menuBarContent}`]: {
      padding: theme.spacing(1, 0),
    },
  }),

  ...(ownerState.variant === "outlined" && {
    // Add padding around the input area and menu bar, since they're
    // contained in the outline
    [`& .${richTextFieldClasses.content}`]: {
      padding: theme.spacing(1.5),
    },

    [`& .${richTextFieldClasses.menuBarContent}`]: {
      padding: theme.spacing(1, 1.5),
    },
  }),
}));

/**
 * Renders the Tiptap rich text editor content and a controls menu bar.
 *
 * With the "outlined" variant, renders a bordered UI similar to the Material UI
 * `TextField`. The "standard" variant does not have an outline/border.
 *
 * Must be a child of the RichTextEditorProvider so that the `editor` context is
 * available.
 */
export default function RichTextField(inProps: RichTextFieldProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    variant = "outlined",
    controls,
    disableDebounceRenderControls = false,
    disabled,
    className,
    classes = {},
    footer,
    MenuBarProps,
    RichTextContentProps,
    sx,
    ...fieldContainerProps
  } = props;

  const editor = useRichTextEditorContext();

  const ownerState: RichTextFieldOwnerState = {
    variant,
    disabled,
    disableDebounceRenderControls,
  };

  // Because the user interactions with the editor menu bar buttons unfocus the editor
  // (since it's not part of the editor content), we'll debounce our visual focused
  // state so that the (outlined) field focus styles don't "flash" whenever that happens
  const isFieldFocused = useDebouncedFocus({ editor });

  return (
    // Don't even bother rendering if editor from useEditor is undefined like V2 can do,
    // so everything inside is safe to assume editor is valid
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    editor && (
      <RichTextFieldRoot
        {...fieldContainerProps}
        variant={variant}
        focused={!disabled && isFieldFocused}
        disabled={disabled}
        className={clsx([
          richTextFieldClasses.root,
          classes.root,
          variant === "outlined"
            ? [richTextFieldClasses.outlined, classes.outlined]
            : [richTextFieldClasses.standard, classes.standard],
          className,
        ])}
        ownerState={ownerState}
        sx={sx}
      >
        {controls && (
          <MenuBar
            {...MenuBarProps}
            classes={{
              ...MenuBarProps?.classes,
              root: clsx([
                richTextFieldClasses.menuBar,
                classes.menuBar,
                MenuBarProps?.classes?.root,
              ]),
              content: clsx([
                richTextFieldClasses.menuBarContent,
                classes.menuBarContent,
                MenuBarProps?.classes?.content,
              ]),
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
          className={clsx([
            richTextFieldClasses.content,
            classes.content,
            RichTextContentProps?.className,
          ])}
        />

        {footer}
      </RichTextFieldRoot>
    )
  );
}
