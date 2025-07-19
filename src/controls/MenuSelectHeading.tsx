/// <reference types="@tiptap/extension-paragraph" />
import { MenuItem, type SelectChangeEvent } from "@mui/material";
import type { Heading, Level } from "@tiptap/extension-heading";
import { useCallback, useMemo, type ReactNode } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { useRichTextEditorContext } from "../context";
import { getEditorStyles } from "../styles";
import { getAttributesForEachSelected } from "../utils/getAttributesForEachSelected";
import MenuButtonTooltip from "./MenuButtonTooltip";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type MenuSelectHeadingProps = Except<
  MenuSelectProps<HeadingOptionValue | "">,
  "value" | "children"
> & {
  /**
   * Override the default labels for the select options. For any value that
   * is omitted in this object, it falls back to the default content.
   */
  labels?: {
    /** Label shown for the "Paragraph" (non-heading) option. */
    paragraph?: ReactNode;
    /** Label shown for the level 1 heading (h1) option. */
    heading1?: ReactNode;
    /** Label shown for the level 2 heading (h2) option. */
    heading2?: ReactNode;
    /** Label shown for the level 3 heading (h3) option. */
    heading3?: ReactNode;
    /** Label shown for the level 4 heading (h4) option. */
    heading4?: ReactNode;
    /** Label shown for the level 5 heading (h5) option. */
    heading5?: ReactNode;
    /** Label shown for the level 6 heading (h6) option. */
    heading6?: ReactNode;
    /**
     * Label shown when the user is currently on a non-paragraph, non-heading.
     * By default shows "Change to…" in italics, since choosing a new option
     * will change the node type to one of the given heading/paragraph types.
     */
    empty?: ReactNode;
    /** @deprecated Use `labels.empty` instead. */
    emptyValue?: React.ReactNode;
  };
  /**
   * Whether to hide the shortcut key tooltips for each heading option. By
   * default false.
   */
  hideShortcuts?: boolean;
};

const useStyles = makeStyles({ name: { MenuSelectHeading } })((theme) => {
  const editorStyles = getEditorStyles(theme);
  return {
    selectInput: {
      // We use a fixed width so that the Select element won't change sizes as
      // the selected option changes (which would shift other elements in the
      // menu bar)
      width: 77,
    },

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

export type HeadingOptionValue =
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

export default function MenuSelectHeading({
  labels,
  hideShortcuts = false,
  ...menuSelectProps
}: MenuSelectHeadingProps) {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  const handleHeadingType: (
    event: SelectChangeEvent<"" | HeadingOptionValue>,
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
    [editor],
  );

  let selectedValue: HeadingOptionValue | "" = "";
  let currentLevel: number | undefined;
  if (editor?.isActive("paragraph")) {
    selectedValue = HEADING_OPTION_VALUES.Paragraph;
  } else if (editor?.isActive("heading")) {
    const currentNodeHeadingAttributes = getAttributesForEachSelected(
      editor.state,
      "heading",
    );
    const currentNodeLevels = currentNodeHeadingAttributes.map(
      (attrs) => attrs.level as number | undefined,
    );
    const numCurrentNodeLevels = new Set(currentNodeLevels).size;
    // We only want to show a selected level value if all of the selected nodes
    // have the same level. (That way a user can properly change the level when
    // selecting across two separate headings, and so we don't mistakenly just
    // show the first of the selected nodes' levels and not allow changing all
    // selected to that heading level. See
    // https://github.com/ueberdosis/tiptap/issues/3481.)
    currentLevel =
      numCurrentNodeLevels === 1 ? currentNodeLevels[0] : undefined;
    if (currentLevel && currentLevel in LEVEL_TO_HEADING_OPTION_VALUE) {
      selectedValue =
        LEVEL_TO_HEADING_OPTION_VALUE[
          currentLevel as keyof typeof LEVEL_TO_HEADING_OPTION_VALUE
        ];
    }
  }

  const isCurrentlyParagraphOrHeading = selectedValue !== "";
  const canSetParagraph = !!editor?.can().setParagraph();

  // Figure out which settings the user has enabled with the heading extension
  const enabledHeadingLevels: Set<Level> = useMemo(() => {
    const headingExtension = editor?.extensionManager.extensions.find(
      (extension): extension is typeof Heading => extension.name == "heading",
    );
    return new Set(headingExtension?.options.levels ?? []);
  }, [editor]);

  // In determining whether we can set a heading, at least one heading level
  // must be enabled in the extension configuration. We have to pass a level
  // when running `can().setHeading()`, so we just use the first one that is
  // enabled. And since some Tiptap versions return `false` for
  // `can().setHeading()` when passing the current level, we also have to check
  // whether that arbitrary first level is the `currentLevel` (see
  // https://github.com/sjdemartini/mui-tiptap/issues/197).
  const firstEnabledHeadingResult = enabledHeadingLevels.values().next();
  const firstEnabledHeading = firstEnabledHeadingResult.done
    ? undefined
    : firstEnabledHeadingResult.value;
  const canSetHeading =
    firstEnabledHeading !== undefined &&
    (currentLevel === firstEnabledHeading ||
      !!editor?.can().setHeading({ level: firstEnabledHeading }));

  return (
    // We currently have to specify that the value is of type
    // `HeadingOptionValue | ""` rather than just `HeadingOptionValue` due to
    // the bug reported here https://github.com/mui/material-ui/issues/34083. We
    // need it to support "" as a possible value in the `renderValue` function
    // below since we have `displayEmpty=true`, and the types don't properly
    // handle that scenario.
    <MenuSelect<HeadingOptionValue | "">
      onChange={handleHeadingType}
      disabled={
        !editor?.isEditable ||
        (!isCurrentlyParagraphOrHeading && !canSetParagraph && !canSetHeading)
      }
      displayEmpty
      renderValue={(selected) => {
        let result: ReactNode | undefined;
        if (selected === "") {
          // Handle the deprecated `emptyValue` label name, falling back to the
          // newer `labels.empty`, and finally our default empty label
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          result = labels?.emptyValue ?? labels?.empty ?? <em>Change to…</em>;
        } else if (selected === HEADING_OPTION_VALUES.Paragraph) {
          result = labels?.paragraph;
        } else if (selected === HEADING_OPTION_VALUES.Heading1) {
          result = labels?.heading1;
        } else if (selected === HEADING_OPTION_VALUES.Heading2) {
          result = labels?.heading2;
        } else if (selected === HEADING_OPTION_VALUES.Heading3) {
          result = labels?.heading3;
        } else if (selected === HEADING_OPTION_VALUES.Heading4) {
          result = labels?.heading4;
        } else if (selected === HEADING_OPTION_VALUES.Heading5) {
          result = labels?.heading5;
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        } else if (selected === HEADING_OPTION_VALUES.Heading6) {
          result = labels?.heading6;
        }
        return result ?? selected;
      }}
      aria-label="Text headings"
      tooltipTitle="Styles"
      {...menuSelectProps}
      value={selectedValue}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: cx(
          classes.selectInput,
          menuSelectProps.inputProps?.className,
        ),
      }}
    >
      <MenuItem
        value={HEADING_OPTION_VALUES.Paragraph}
        disabled={!isCurrentlyParagraphOrHeading && !canSetParagraph}
      >
        <MenuButtonTooltip
          label=""
          shortcutKeys={hideShortcuts ? undefined : ["mod", "alt", "0"]}
          placement="right"
          contentWrapperClassName={classes.menuOption}
        >
          {labels?.paragraph ?? HEADING_OPTION_VALUES.Paragraph}
        </MenuButtonTooltip>
      </MenuItem>

      {enabledHeadingLevels.has(1) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading1}
          disabled={!canSetHeading}
        >
          <MenuButtonTooltip
            label=""
            shortcutKeys={hideShortcuts ? undefined : ["mod", "alt", "1"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption1,
            )}
          >
            {labels?.heading1 ?? HEADING_OPTION_VALUES.Heading1}
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
            shortcutKeys={hideShortcuts ? undefined : ["mod", "alt", "2"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption2,
            )}
          >
            {labels?.heading2 ?? HEADING_OPTION_VALUES.Heading2}
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
            shortcutKeys={hideShortcuts ? undefined : ["mod", "alt", "3"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption3,
            )}
          >
            {labels?.heading3 ?? HEADING_OPTION_VALUES.Heading3}
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
            shortcutKeys={hideShortcuts ? undefined : ["mod", "alt", "4"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption4,
            )}
          >
            {labels?.heading4 ?? HEADING_OPTION_VALUES.Heading4}
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
            shortcutKeys={hideShortcuts ? undefined : ["mod", "alt", "5"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption5,
            )}
          >
            {labels?.heading5 ?? HEADING_OPTION_VALUES.Heading5}
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
            shortcutKeys={hideShortcuts ? undefined : ["mod", "alt", "6"]}
            placement="right"
            contentWrapperClassName={cx(
              classes.menuOption,
              classes.headingOption,
              classes.headingOption6,
            )}
          >
            {labels?.heading6 ?? HEADING_OPTION_VALUES.Heading6}
          </MenuButtonTooltip>
        </MenuItem>
      )}
    </MenuSelect>
  );
}
