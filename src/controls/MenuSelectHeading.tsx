/// <reference types="@tiptap/extension-paragraph" />
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import type { Heading, Level } from "@tiptap/extension-heading";
import { clsx } from "clsx";
import { useCallback, useMemo, type ReactNode } from "react";
import { useRichTextEditorContext } from "../context";
import { getEditorStyles, getUtilityComponentName } from "../styles";
import { getAttributesForEachSelected } from "../utils/getAttributesForEachSelected";
import MenuButtonTooltip, {
  type MenuButtonTooltipProps,
} from "./MenuButtonTooltip";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";
import {
  menuSelectHeadingClasses,
  type MenuSelectHeadingClassKey,
  type MenuSelectHeadingClasses,
} from "./MenuSelectHeading.classes";

export type MenuSelectHeadingProps = Omit<
  MenuSelectProps<HeadingOptionValue | "">,
  "value" | "children" | "classes"
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
   * Override the default shortcut keys shown in the tooltip for each heading
   * option. For any value that is omitted, it falls back to the default
   * shortcut keys. Use `hideShortcuts` to hide all shortcuts entirely.
   *
   * Useful for localizing key names, or for updating the displayed shortcuts to
   * match any custom keyboard shortcuts configured in your Tiptap editor.
   *
   * Use the literal string "mod" to represent Cmd on Mac and Ctrl on Windows
   * and Linux.
   */
  shortcutKeys?: {
    /** Shortcut keys for the "Paragraph" option. Default: ["mod", "alt", "0"] */
    paragraph?: MenuButtonTooltipProps["shortcutKeys"];
    /** Shortcut keys for Heading 1. Default: ["mod", "alt", "1"] */
    heading1?: MenuButtonTooltipProps["shortcutKeys"];
    /** Shortcut keys for Heading 2. Default: ["mod", "alt", "2"] */
    heading2?: MenuButtonTooltipProps["shortcutKeys"];
    /** Shortcut keys for Heading 3. Default: ["mod", "alt", "3"] */
    heading3?: MenuButtonTooltipProps["shortcutKeys"];
    /** Shortcut keys for Heading 4. Default: ["mod", "alt", "4"] */
    heading4?: MenuButtonTooltipProps["shortcutKeys"];
    /** Shortcut keys for Heading 5. Default: ["mod", "alt", "5"] */
    heading5?: MenuButtonTooltipProps["shortcutKeys"];
    /** Shortcut keys for Heading 6. Default: ["mod", "alt", "6"] */
    heading6?: MenuButtonTooltipProps["shortcutKeys"];
  };
  /**
   * Whether to hide the shortcut key tooltips for each heading option. By
   * default false.
   */
  hideShortcuts?: boolean;
  /** Override or extend existing styles. */
  classes?: Partial<MenuSelectHeadingClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
};

const componentName = getUtilityComponentName("MenuSelectHeading");

const MenuSelectHeadingRoot = styled(MenuSelect<HeadingOptionValue | "">, {
  name: componentName,
  slot: "root" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.root,
})({
  [`& .${menuSelectHeadingClasses.selectInput}`]: {
    // We use a fixed width so that the Select element won't change sizes as
    // the selected option changes (which would shift other elements in the
    // menu bar)
    width: 77,
  },
});

const MenuSelectMenuOption = styled(MenuButtonTooltip, {
  name: componentName,
  slot: "menuOption" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.menuOption,
})({
  // These styles ensure the item fills its MenuItem container, and the
  // tooltip appears in the same place when hovering over the item generally
  // (not just the text of the item)
  display: "block",
  width: "100%",
});

const MenuSelectHeadingOption = styled(MenuSelectMenuOption, {
  name: componentName,
  slot: "headingOption" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.option,
})({
  marginBlockStart: 0,
  marginBlockEnd: 0,
  fontWeight: "bold",
});

const MenuSelectHeadingOption1 = styled(MenuSelectHeadingOption, {
  name: componentName,
  slot: "headingOption1" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.headingOption1,
})(({ theme }) => ({
  fontSize: getEditorStyles(theme)["& h1"].fontSize,
}));

const MenuSelectHeadingOption2 = styled(MenuSelectHeadingOption, {
  name: componentName,
  slot: "headingOption2" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.headingOption2,
})(({ theme }) => ({
  fontSize: getEditorStyles(theme)["& h2"].fontSize,
}));

const MenuSelectHeadingOption3 = styled(MenuSelectHeadingOption, {
  name: componentName,
  slot: "headingOption3" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.headingOption3,
})(({ theme }) => ({
  fontSize: getEditorStyles(theme)["& h3"].fontSize,
}));

const MenuSelectHeadingOption4 = styled(MenuSelectHeadingOption, {
  name: componentName,
  slot: "headingOption4" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.headingOption4,
})(({ theme }) => ({
  fontSize: getEditorStyles(theme)["& h4"].fontSize,
}));

const MenuSelectHeadingOption5 = styled(MenuSelectHeadingOption, {
  name: componentName,
  slot: "headingOption5" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.headingOption5,
})(({ theme }) => ({
  fontSize: getEditorStyles(theme)["& h5"].fontSize,
}));

const MenuSelectHeadingOption6 = styled(MenuSelectHeadingOption, {
  name: componentName,
  slot: "headingOption6" satisfies MenuSelectHeadingClassKey,
  overridesResolver: (props, styles) => styles.headingOption6,
})(({ theme }) => ({
  fontSize: getEditorStyles(theme)["& h6"].fontSize,
}));

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

export default function MenuSelectHeading(inProps: MenuSelectHeadingProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    labels,
    shortcutKeys,
    hideShortcuts = false,
    classes = {},
    sx,
    ...menuSelectProps
  } = props;
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
    <MenuSelectHeadingRoot
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
      tooltipTitle="Styles"
      {...menuSelectProps}
      value={selectedValue}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: clsx([
          menuSelectHeadingClasses.selectInput,
          classes.selectInput,
          menuSelectProps.inputProps?.className,
        ]),
      }}
      className={clsx([
        menuSelectHeadingClasses.root,
        classes.root,
        menuSelectProps.className,
      ])}
      sx={sx}
    >
      <MenuItem
        value={HEADING_OPTION_VALUES.Paragraph}
        disabled={!isCurrentlyParagraphOrHeading && !canSetParagraph}
      >
        <MenuSelectMenuOption
          label=""
          shortcutKeys={
            hideShortcuts
              ? undefined
              : (shortcutKeys?.paragraph ?? ["mod", "alt", "0"])
          }
          placement="right"
          classes={{
            contentWrapper: clsx([
              menuSelectHeadingClasses.menuOption,
              classes.menuOption,
              menuSelectHeadingClasses.paragraphOption,
              classes.paragraphOption,
            ]),
          }}
        >
          {labels?.paragraph ?? HEADING_OPTION_VALUES.Paragraph}
        </MenuSelectMenuOption>
      </MenuItem>

      {enabledHeadingLevels.has(1) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading1}
          disabled={!canSetHeading}
        >
          <MenuSelectHeadingOption1
            label=""
            shortcutKeys={
              hideShortcuts
                ? undefined
                : (shortcutKeys?.heading1 ?? ["mod", "alt", "1"])
            }
            placement="right"
            className={clsx([
              menuSelectHeadingClasses.menuOption,
              classes.menuOption,
              menuSelectHeadingClasses.headingOption,
              classes.headingOption,
              menuSelectHeadingClasses.headingOption1,
              classes.headingOption1,
            ])}
          >
            {labels?.heading1 ?? HEADING_OPTION_VALUES.Heading1}
          </MenuSelectHeadingOption1>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(2) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading2}
          disabled={!canSetHeading}
        >
          <MenuSelectHeadingOption2
            label=""
            shortcutKeys={
              hideShortcuts
                ? undefined
                : (shortcutKeys?.heading2 ?? ["mod", "alt", "2"])
            }
            placement="right"
            className={clsx([
              menuSelectHeadingClasses.menuOption,
              classes.menuOption,
              menuSelectHeadingClasses.headingOption,
              classes.headingOption,
              menuSelectHeadingClasses.headingOption2,
              classes.headingOption2,
            ])}
          >
            {labels?.heading2 ?? HEADING_OPTION_VALUES.Heading2}
          </MenuSelectHeadingOption2>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(3) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading3}
          disabled={!canSetHeading}
        >
          <MenuSelectHeadingOption3
            label=""
            shortcutKeys={
              hideShortcuts
                ? undefined
                : (shortcutKeys?.heading3 ?? ["mod", "alt", "3"])
            }
            placement="right"
            className={clsx([
              menuSelectHeadingClasses.menuOption,
              classes.menuOption,
              menuSelectHeadingClasses.headingOption,
              classes.headingOption,
              menuSelectHeadingClasses.headingOption3,
              classes.headingOption3,
            ])}
          >
            {labels?.heading3 ?? HEADING_OPTION_VALUES.Heading3}
          </MenuSelectHeadingOption3>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(4) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading4}
          disabled={!canSetHeading}
        >
          <MenuSelectHeadingOption4
            label=""
            shortcutKeys={
              hideShortcuts
                ? undefined
                : (shortcutKeys?.heading4 ?? ["mod", "alt", "4"])
            }
            placement="right"
            className={clsx([
              menuSelectHeadingClasses.menuOption,
              classes.menuOption,
              menuSelectHeadingClasses.headingOption,
              classes.headingOption,
              menuSelectHeadingClasses.headingOption4,
              classes.headingOption4,
            ])}
          >
            {labels?.heading4 ?? HEADING_OPTION_VALUES.Heading4}
          </MenuSelectHeadingOption4>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(5) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading5}
          disabled={!canSetHeading}
        >
          <MenuSelectHeadingOption5
            label=""
            shortcutKeys={
              hideShortcuts
                ? undefined
                : (shortcutKeys?.heading5 ?? ["mod", "alt", "5"])
            }
            placement="right"
            className={clsx([
              menuSelectHeadingClasses.menuOption,
              classes.menuOption,
              menuSelectHeadingClasses.headingOption,
              classes.headingOption,
              menuSelectHeadingClasses.headingOption5,
              classes.headingOption5,
            ])}
          >
            {labels?.heading5 ?? HEADING_OPTION_VALUES.Heading5}
          </MenuSelectHeadingOption5>
        </MenuItem>
      )}

      {enabledHeadingLevels.has(6) && (
        <MenuItem
          value={HEADING_OPTION_VALUES.Heading6}
          disabled={!canSetHeading}
        >
          <MenuSelectHeadingOption6
            label=""
            shortcutKeys={
              hideShortcuts
                ? undefined
                : (shortcutKeys?.heading6 ?? ["mod", "alt", "6"])
            }
            placement="right"
            className={clsx([
              menuSelectHeadingClasses.menuOption,
              classes.menuOption,
              menuSelectHeadingClasses.headingOption,
              classes.headingOption,
              menuSelectHeadingClasses.headingOption6,
              classes.headingOption6,
            ])}
          >
            {labels?.heading6 ?? HEADING_OPTION_VALUES.Heading6}
          </MenuSelectHeadingOption6>
        </MenuItem>
      )}
    </MenuSelectHeadingRoot>
  );
}
