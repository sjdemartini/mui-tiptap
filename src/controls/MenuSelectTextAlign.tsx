import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { MenuItem, type SelectChangeEvent } from "@mui/material";
import { useCallback, useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import { useRichTextEditorContext } from "../context";
import MenuButtonTooltip, {
  type MenuButtonTooltipProps,
} from "./MenuButtonTooltip";
// We'll import just the type for TextAlignOptions, which we don't expose
// externally but only utilize within the component below, so allow this import
// without needing to list extension-text-align as a peer dependency.
// eslint-disable-next-line import/no-extraneous-dependencies
import type { TextAlignOptions } from "@tiptap/extension-text-align";
import type { Except } from "type-fest";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "./MenuButton";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type TextAlignSelectOption = {
  /**
   * Which textAlign value this option enables. Ex: "left", "right",
   * "center", "justify".
   */
  value: string;
  /**
   * What icon to show for this option in the select option dropdown.
   */
  IconComponent: React.ElementType<{
    className: string;
  }>;
  /**
   * What tooltip label to show (if any) when hovering over this option.
   */
  label?: string;
  /**
   * What keyboard shortcut keys can be used to enable this text-alignment.
   * Example: ["mod", "Shift", "L"] is the default shortcut for left-align.
   */
  shortcutKeys?: MenuButtonTooltipProps["shortcutKeys"];
};

export type MenuSelectTextAlignProps = Except<
  MenuSelectProps<string>,
  "children"
> & {
  /**
   * Override the options shown for text alignment. Use this to change the
   * label, icon, tooltip, and shortcut keys shown for each option, and/or the
   * order in which the options appear. Note that of the options provided here
   * (or if this prop is omitted and the default set of options is used), this
   * component will omit an option if it's not enabled in the TextAlign
   * extension's `alignments` option.
   */
  options?: TextAlignSelectOption[];
  // We use the more generic `options` prop name for consistency in prop naming
  // across various `MenuSelect*` components, rather than having a unique prop
  // name for each one.
  /** @deprecated Use `options` prop instead. */
  alignmentOptions?: {
    /**
     * `alignment` has been renamed `value` in the new preferred `options` prop.
     */
    alignment: string;
    IconComponent: React.ElementType<{
      className: string;
    }>;
    label?: string;
    shortcutKeys?: MenuButtonTooltipProps["shortcutKeys"];
  }[];
  /**
   * What to render in the Select when the highlighted content is currently
   * using multiple different text-alignments (so no one icon applies). By
   * default renders as blank (similar to Microsoft Word and Google Docs do for
   * font size, for instance).
   */
  emptyLabel?: React.ReactNode;
};

const useStyles = makeStyles({ name: { MenuSelectTextAlign } })((theme) => ({
  selectInput: {
    // We use a fixed width equal to the size of the menu button icon so that
    // the Select element won't change sizes even if we show the "blank"
    // interface when the selected content contains multiple different text
    // alignments.
    width: MENU_BUTTON_FONT_SIZE_DEFAULT,
  },

  menuItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },

  menuOption: {
    // These styles ensure the item fills its MenuItem container, and the
    // tooltip appears in the same place when hovering over the item generally
    // (not just the text of the item)
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },

  menuButtonIcon: {
    fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,
    // For consistency with toggle button default icon color and the Select
    // dropdown arrow icon color
    // https://github.com/mui/material-ui/blob/2cb9664b16d5a862a3796add7c8e3b088b47acb5/packages/mui-material/src/ToggleButton/ToggleButton.js#L60,
    // https://github.com/mui/material-ui/blob/0b7beb93c9015da6e35c2a31510f679126cf0de1/packages/mui-material/src/NativeSelect/NativeSelectInput.js#L96
    color: theme.palette.action.active,
  },
}));

const DEFAULT_ALIGNMENT_OPTIONS: TextAlignSelectOption[] = [
  {
    value: "left",
    label: "Left",
    shortcutKeys: ["mod", "Shift", "L"],
    IconComponent: FormatAlignLeftIcon,
  },
  {
    value: "center",
    label: "Center",
    shortcutKeys: ["mod", "Shift", "E"],
    IconComponent: FormatAlignCenterIcon,
  },
  {
    value: "right",
    label: "Right",
    shortcutKeys: ["mod", "Shift", "R"],
    IconComponent: FormatAlignRightIcon,
  },
  {
    value: "justify",
    label: "Justify",
    shortcutKeys: ["mod", "Shift", "J"],
    IconComponent: FormatAlignJustifyIcon,
  },
];

export default function MenuSelectTextAlign({
  options = DEFAULT_ALIGNMENT_OPTIONS,
  emptyLabel = "",
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  alignmentOptions,
  ...menuSelectProps
}: MenuSelectTextAlignProps) {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  // Handle the deprecated name for the `options` prop if present
  options =
    alignmentOptions?.map((option) => ({
      ...option,
      value: option.alignment,
    })) ?? options;

  const handleAlignmentSelect: (event: SelectChangeEvent) => void = useCallback(
    (event) => {
      const alignment = event.target.value;
      editor?.chain().setTextAlign(alignment).focus().run();
    },
    [editor],
  );

  // Figure out which settings the user has enabled with the heading extension
  const textAlignExtensionOptions = useMemo(() => {
    const textAlignExtension = editor?.extensionManager.extensions.find(
      (extension) => extension.name == "textAlign",
    );
    return textAlignExtension?.options as TextAlignOptions | undefined;
  }, [editor]);

  const enabledAlignments: Set<TextAlignOptions["alignments"][0]> =
    useMemo(() => {
      return new Set(textAlignExtensionOptions?.alignments);
    }, [textAlignExtensionOptions]);

  // Only set the Select `value` as non-empty if all alignments are the same
  // (which we'll know if `isActive({ textAlign: alignment })` returns true).
  // This allows the user to change all current selected nodes' alignments to
  // any alignment, including the default alignment. If we instead set the
  // `value` as the default for instance, attempting to change multiple node's
  // alignments to that default would not work (not triggering "onChange").
  const selectedValue =
    Array.from(enabledAlignments).find((alignment) =>
      editor?.isActive({ textAlign: alignment }),
    ) ?? "";

  return (
    <MenuSelect<string>
      onChange={handleAlignmentSelect}
      disabled={
        !editor?.isEditable ||
        !Array.from(enabledAlignments).some((alignment) =>
          editor.can().setTextAlign(alignment),
        )
      }
      // Override the rendering of the selected value so that we don't show
      // tooltips on hovering (like we do for the menu options)
      renderValue={(value) => {
        let content;
        if (value) {
          const alignmentOptionForValue = options.find(
            (option) => option.value === value,
          );
          content = alignmentOptionForValue ? (
            <alignmentOptionForValue.IconComponent
              className={classes.menuButtonIcon}
            />
          ) : (
            value
          );
        } else {
          content = emptyLabel;
        }
        return <span className={classes.menuOption}>{content}</span>;
      }}
      aria-label="Text alignments"
      tooltipTitle="Align"
      value={selectedValue}
      displayEmpty
      {...menuSelectProps}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: cx(
          classes.selectInput,
          menuSelectProps.inputProps?.className,
        ),
      }}
    >
      {options
        .filter((alignmentOption) =>
          enabledAlignments.has(alignmentOption.value),
        )
        .map((alignmentOption) => (
          <MenuItem
            key={alignmentOption.value}
            value={alignmentOption.value}
            disabled={!editor?.can().setTextAlign(alignmentOption.value)}
            className={classes.menuItem}
          >
            <MenuButtonTooltip
              label={alignmentOption.label ?? ""}
              shortcutKeys={alignmentOption.shortcutKeys}
              placement="right"
              contentWrapperClassName={classes.menuOption}
            >
              <alignmentOption.IconComponent
                className={classes.menuButtonIcon}
              />
            </MenuButtonTooltip>
          </MenuItem>
        ))}
    </MenuSelect>
  );
}
