/// <reference types="@tiptap/extension-paragraph" />
import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import type { Heading, Level } from "@tiptap/extension-heading";
import { useCallback, useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import { useRichTextEditorContext } from "../context";
import { getEditorStyles } from "../styles";
import MenuButtonTooltip from "./MenuButtonTooltip";

const useStyles = makeStyles({ name: { MenuHeadingSelect } })((theme) => {
  const editorStyles = getEditorStyles(theme);
  return {
    menuOption: {
      // These styles ensure the item fills its MenuItem container, and the
      // tooltip appears in the same place when hovering over the item generally
      // (not just the text of the item)
      display: "block",
      width: "100%",
    },

    headingOption: {
      marginBlockStart: 0,
      marginBlockEnd: 0,
      fontWeight: "bold",
    },

    headingOption1: {
      fontSize: editorStyles["& h1"].fontSize,
    },

    headingOption2: {
      fontSize: editorStyles["& h2"].fontSize,
    },

    headingOption3: {
      fontSize: editorStyles["& h3"].fontSize,
    },

    headingOption4: {
      fontSize: editorStyles["& h4"].fontSize,
    },

    headingOption5: {
      fontSize: editorStyles["& h5"].fontSize,
    },

    headingOption6: {
      fontSize: editorStyles["& h6"].fontSize,
    },
  };
});

const HEADING_OPTION_VALUES = {
  Paragraph: "Paragraph",
  Heading1: "Heading 1",
  Heading2: "Heading 2",
  Heading3: "Heading 3",
  Heading4: "Heading 4",
  Heading5: "Heading 5",
  Heading6: "Heading 6",
} as const;

type HeadingOptionValue =
  (typeof HEADING_OPTION_VALUES)[keyof typeof HEADING_OPTION_VALUES];

const HEADING_OPTION_VALUE_TO_LEVEL = {
  [HEADING_OPTION_VALUES.Heading1]: 1,
  [HEADING_OPTION_VALUES.Heading2]: 2,
  [HEADING_OPTION_VALUES.Heading3]: 3,
  [HEADING_OPTION_VALUES.Heading4]: 4,
  [HEADING_OPTION_VALUES.Heading5]: 5,
  [HEADING_OPTION_VALUES.Heading6]: 6,
} as const;
const LEVEL_TO_HEADING_OPTION_VALUE = {
  1: HEADING_OPTION_VALUES.Heading1,
  2: HEADING_OPTION_VALUES.Heading2,
  3: HEADING_OPTION_VALUES.Heading3,
  4: HEADING_OPTION_VALUES.Heading4,
  5: HEADING_OPTION_VALUES.Heading5,
  6: HEADING_OPTION_VALUES.Heading6,
} as const;

export default function MenuHeadingSelect() {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  const handleHeadingType: (
    event: SelectChangeEvent<"" | HeadingOptionValue>
  ) => void = useCallback(
    (event) => {
      const value = event.target.value;
      if (value === HEADING_OPTION_VALUES.Paragraph) {
        editor?.chain().setParagraph().focus().run();
      } else if (value in HEADING_OPTION_VALUE_TO_LEVEL) {
        editor
          ?.chain()
          .setHeading({
            level:
              HEADING_OPTION_VALUE_TO_LEVEL[
                value as keyof typeof HEADING_OPTION_VALUE_TO_LEVEL
              ],
          })
          .focus()
          .run();
      }
    },
    [editor]
  );

  let selectedValue: HeadingOptionValue | "" = "";
  if (editor?.isActive("paragraph")) {
    selectedValue = HEADING_OPTION_VALUES.Paragraph;
  } else if (editor?.isActive("heading")) {
    const level = editor.getAttributes("heading").level as number | undefined;
    if (level && level in LEVEL_TO_HEADING_OPTION_VALUE) {
      selectedValue =
        LEVEL_TO_HEADING_OPTION_VALUE[
          level as keyof typeof LEVEL_TO_HEADING_OPTION_VALUE
        ];
    }
  }

  const isCurrentlyParagraphOrHeading = selectedValue !== "";
  const canSetParagraph = editor?.can().setParagraph();
  // We have to pass a level when running `can`, so this is just an arbitrary one
  const canSetHeading = editor?.can().setHeading({ level: 1 });

  // Figure out which settings the user has enabled with the heading extension
  const enabledHeadingLevels: Set<Level> = useMemo(() => {
    const headingExtension = editor?.extensionManager.extensions.find(
      (extension): extension is typeof Heading => extension.name == "heading"
    );
    return new Set(headingExtension?.options.levels ?? []);
  }, [editor]);

  return (
    // We currently have to specify that the value is of type
    // `HeadingOptionValue | ""` rather than just `HeadingOptionValue` due to
    // the bug reported here https://github.com/mui/material-ui/issues/34083. We
    // need it to support "" as a possible value in the `renderValue` function
    // below since we have `displayEmpty=true`, and the types don't properly
    // handle that scenario.
    <Select<HeadingOptionValue | "">
      margin="none"
      variant="outlined"
      size="small"
      onChange={handleHeadingType}
      disabled={
        !editor?.isEditable ||
        (!isCurrentlyParagraphOrHeading && !canSetParagraph && !canSetHeading)
      }
      displayEmpty
      renderValue={(selected) => {
        if (selected === "") {
          return <em>Change to…</em>;
        }
        return selected;
      }}
      aria-label="Heading type"
      value={selectedValue}
      // We use a fixed width so that the Select element won't change sizes as
      // the selected option changes (which would shift other elements in the
      // menu bar)
      inputProps={{ sx: { py: "3px", fontSize: "0.9em", width: 78 } }}
      // Always show the dropdown options directly below the select input,
      // aligned to left-most edge
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      }}
    >
      <MenuItem
        value={HEADING_OPTION_VALUES.Paragraph}
        disabled={!isCurrentlyParagraphOrHeading && !canSetParagraph}
      >
        <MenuButtonTooltip
          label=""
          shortcutKeys={["mod", "alt", "0"]}
          placement="right"
          contentWrapperClassName={classes.menuOption}
        >
          Paragraph
        </MenuButtonTooltip>
      </MenuItem>

      {enabledHeadingLevels.has(1) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading1}
          disabled={!canSetHeading}
        >
          <MenuButtonTooltip
            label=""
            shortcutKeys={["mod", "alt", "1"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption1
            )}
          >
            {HEADING_OPTION_VALUES.Heading1}
          </MenuButtonTooltip>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(2) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading2}
          disabled={!canSetHeading}
        >
          <MenuButtonTooltip
            label=""
            shortcutKeys={["mod", "alt", "2"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption2
            )}
          >
            {HEADING_OPTION_VALUES.Heading2}
          </MenuButtonTooltip>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(3) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading3}
          disabled={!canSetHeading}
        >
          <MenuButtonTooltip
            label=""
            shortcutKeys={["mod", "alt", "3"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption3
            )}
          >
            {HEADING_OPTION_VALUES.Heading3}
          </MenuButtonTooltip>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(4) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading4}
          disabled={!canSetHeading}
        >
          <MenuButtonTooltip
            label=""
            shortcutKeys={["mod", "alt", "4"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption4
            )}
          >
            {HEADING_OPTION_VALUES.Heading4}
          </MenuButtonTooltip>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(5) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading5}
          disabled={!canSetHeading}
        >
          <MenuButtonTooltip
            label=""
            shortcutKeys={["mod", "alt", "5"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption5
            )}
          >
            {HEADING_OPTION_VALUES.Heading5}
          </MenuButtonTooltip>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(6) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading6}
          disabled={!canSetHeading}
        >
          <MenuButtonTooltip
            label=""
            shortcutKeys={["mod", "alt", "6"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption6
            )}
          >
            {HEADING_OPTION_VALUES.Heading6}
          </MenuButtonTooltip>
        </MenuItem>
      )}
    </Select>
  );
}
