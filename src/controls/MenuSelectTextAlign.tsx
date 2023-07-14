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
import MenuSelect from "./MenuSelect";

export type MenuSelectTextAlignProps = {
  /**
   * The tooltip title used when hovering over the select element itself. By
   * default "Align".
   */
  tooltipTitle?: string;
};

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

const ALIGNMENT_OPTIONS: {
  alignment: string;
  label: string;
  shortcutKeys: MenuButtonTooltipProps["shortcutKeys"];
  IconComponent: React.ElementType<{ className: string }>;
}[] = [
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
  tooltipTitle,
}: MenuSelectTextAlignProps) {
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
      tooltipTitle={tooltipTitle ?? "Align"}
      onChange={handleAlignmentSelect}
      disabled={
        !editor?.isEditable ||
        !Array.from(enabledAlignments).some((alignment) =>
          editor.can().setTextAlign(alignment)
        )
      }
      aria-label="Text alignment"
      value={selectedValue}
      // Override the rendering of the selected value so that we don't show
      // tooltips on hovering (like we do for the menu options)
      renderValue={(selectedValue) => {
        let content;
        if (selectedValue === "left") {
          content = <FormatAlignLeftIcon className={classes.menuButtonIcon} />;
        } else if (selectedValue === "center") {
          content = (
            <FormatAlignCenterIcon className={classes.menuButtonIcon} />
          );
        } else if (selectedValue === "right") {
          content = <FormatAlignRightIcon className={classes.menuButtonIcon} />;
        } else if (selectedValue === "justify") {
          content = (
            <FormatAlignJustifyIcon className={classes.menuButtonIcon} />
          );
        } else {
          content = selectedValue;
        }

        return <span className={classes.menuOption}>{content}</span>;
      }}
    >
      {ALIGNMENT_OPTIONS.filter((alignmentOption) =>
        enabledAlignments.has(alignmentOption.alignment)
      ).map((alignmentOption) => (
        <MenuItem
          key={alignmentOption.alignment}
          value={alignmentOption.alignment}
          disabled={!editor?.can().setTextAlign(alignmentOption.alignment)}
          className={classes.menuItem}
        >
          <MenuButtonTooltip
            label={alignmentOption.label}
            shortcutKeys={alignmentOption.shortcutKeys}
            placement="right"
            contentWrapperClassName={classes.menuOption}
          >
            <alignmentOption.IconComponent className={classes.menuButtonIcon} />
          </MenuButtonTooltip>
        </MenuItem>
      ))}
    </MenuSelect>
  );
}
