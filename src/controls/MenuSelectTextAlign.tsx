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
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type TextAlignSelectOption = {
  /**
   * Which textAlign value this option enables. Ex: "left", "right",
   * "center", "justify".
   */
  alignment: string;
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

export interface MenuSelectTextAlignProps
  extends Except<MenuSelectProps<string>, "children"> {
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
  alignmentOptions?: TextAlignSelectOption[];
}

const useStyles = makeStyles({ name: { MenuSelectTextAlign } })({
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
    fontSize: "1.25rem",
  },
});

const DEFAULT_ALIGNMENT_OPTIONS: TextAlignSelectOption[] = [
  {
    alignment: "left",
    label: "Left",
    shortcutKeys: ["mod", "Shift", "L"],
    IconComponent: FormatAlignLeftIcon,
  },
  {
    alignment: "center",
    label: "Center",
    shortcutKeys: ["mod", "Shift", "E"],
    IconComponent: FormatAlignCenterIcon,
  },
  {
    alignment: "right",
    label: "Right",
    shortcutKeys: ["mod", "Shift", "R"],
    IconComponent: FormatAlignRightIcon,
  },
  {
    alignment: "justify",
    label: "Justify",
    shortcutKeys: ["mod", "Shift", "J"],
    IconComponent: FormatAlignJustifyIcon,
  },
];

export default function MenuSelectTextAlign({
  options = DEFAULT_ALIGNMENT_OPTIONS,
  alignmentOptions,
  ...menuSelectProps
}: MenuSelectTextAlignProps) {
  // Handle the deprecated name for the options prop if present
  options = alignmentOptions ?? options;
  const { classes } = useStyles();
  const editor = useRichTextEditorContext();

  const handleAlignmentSelect: (event: SelectChangeEvent) => void = useCallback(
    (event) => {
      const alignment = event.target.value;
      editor?.chain().setTextAlign(alignment).focus().run();
    },
    [editor]
  );

  // Figure out which settings the user has enabled with the heading extension
  const textAlignExtensionOptions = useMemo(() => {
    const textAlignExtension = editor?.extensionManager.extensions.find(
      (extension) => extension.name == "textAlign"
    );
    return textAlignExtension?.options as TextAlignOptions | undefined;
  }, [editor]);

  const enabledAlignments: Set<TextAlignOptions["alignments"][0]> =
    useMemo(() => {
      return new Set(textAlignExtensionOptions?.alignments);
    }, [textAlignExtensionOptions]);

  const selectedValue =
    Array.from(enabledAlignments).find((alignment) =>
      editor?.isActive({ textAlign: alignment })
    ) ??
    textAlignExtensionOptions?.defaultAlignment ??
    // Fall back to empty string, though this shouldn't happen if the TextAlign
    // extension is used in a standard way
    "";

  return (
    <MenuSelect<string>
      onChange={handleAlignmentSelect}
      disabled={
        !editor?.isEditable ||
        !Array.from(enabledAlignments).some((alignment) =>
          editor.can().setTextAlign(alignment)
        )
      }
      // Override the rendering of the selected value so that we don't show
      // tooltips on hovering (like we do for the menu options)
      renderValue={(value) => {
        const alignmentOptionForValue = options.find(
          (option) => option.alignment === value
        );
        return (
          <span className={classes.menuOption}>
            {alignmentOptionForValue ? (
              <alignmentOptionForValue.IconComponent
                className={classes.menuButtonIcon}
              />
            ) : (
              value
            )}
          </span>
        );
      }}
      aria-label="Text alignments"
      tooltipTitle="Align"
      value={selectedValue}
      {...menuSelectProps}
    >
      {options
        .filter((alignmentOption) =>
          enabledAlignments.has(alignmentOption.alignment)
        )
        .map((alignmentOption) => (
          <MenuItem
            key={alignmentOption.alignment}
            value={alignmentOption.alignment}
            disabled={!editor?.can().setTextAlign(alignmentOption.alignment)}
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
