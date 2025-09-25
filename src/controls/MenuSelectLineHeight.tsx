/// <reference types="@tiptap/extension-text-style" />
import FormatLineSpacing from "@mui/icons-material/FormatLineSpacing";
import MenuItem from "@mui/material/MenuItem";
import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import type { Editor } from "@tiptap/core";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import { useRichTextEditorContext } from "../context";
import { getUtilityComponentName } from "../styles";
import { getAttributesForEachSelected } from "../utils/getAttributesForEachSelected";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "./MenuButton";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";
import {
  menuSelectLineHeightClasses,
  type MenuSelectLineHeightClassKey,
  type MenuSelectLineHeightClasses,
} from "./MenuSelectLineHeight.classes";

export type LineHeightSelectOptionObject = {
  /**
   * The underlying `line-height` CSS value string, which can be any valid CSS
   * line-height (https://developer.mozilla.org/en-US/docs/Web/CSS/line-height);
   * ex: "1.5", "2", "1.25".
   *
   * If a custom `label` is not provided for an option, the value will be displayed
   * directly in this component.
   */
  value: string;
  /**
   * A customized user-facing label to show for this line-height value. If not
   * provided, uses the `value` as the option label.
   */
  label?: ReactNode;
};

/**
 * A line-height option shown in the select dropdown. If given as a string, that string
 * is used both as the CSS `line-height` value and the user-facing `label`
 * (equivalent to using an object with just the `value` set as that string).
 */
export type LineHeightSelectOption = string | LineHeightSelectOptionObject;

export type MenuSelectLineHeightProps = Omit<
  MenuSelectProps<string>,
  "value" | "children" | "classes"
> & {
  /**
   * Override the list of the line-height option strings shown in the dropdown.
   */
  options?: LineHeightSelectOption[];
  /**
   * Override the label content shown for the Select's MenuItem option that
   * allows a user to unset the line-height of the selected text. If not provided,
   * uses "Default" as the displayed text. To hide this select option entirely,
   * set `hideUnsetOption` to true.
   */
  unsetOptionLabel?: ReactNode;
  /**
   * If true, hides the additional first select option to "unset" the line-height
   * back to its default. By default false.
   */
  hideUnsetOption?: boolean;
  /**
   * What to render in the Select when either no line-height is currently set for
   * the selected text, or when multiple different values are set. By default,
   * uses the FormatLineSpacing MUI icon.
   */
  emptyLabel?: React.ReactNode;
  /** Override or extend existing styles. */
  classes?: Partial<MenuSelectLineHeightClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
};

const componentName = getUtilityComponentName("MenuSelectLineHeight");

const MenuSelectLineHeightRoot = styled(MenuSelect<string>, {
  name: componentName,
  slot: "root" satisfies MenuSelectLineHeightClassKey,
  overridesResolver: (props, styles) => styles.root,
})(() => ({
  [`& .${menuSelectLineHeightClasses.selectInput}`]: {
    // We use a fixed width so that the Select element won't change sizes as
    // the selected option changes (which would shift other elements in the
    // menu bar), since the options may be different sizes
    width: 20,

    // Ensure that if we render an icon as the value, it's vertically aligned
    // properly
    display: "flex",
    alignItems: "center",
  },
}));

const MenuSelectLineHeightIcon = styled(FormatLineSpacing, {
  name: componentName,
  slot: "icon" satisfies MenuSelectLineHeightClassKey,
  overridesResolver: (props, styles) => styles.icon,
})(() => ({
  fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,
}));

const DEFAULT_LINE_HEIGHT_SELECT_OPTIONS: MenuSelectLineHeightProps["options"] =
  ["1", "1.15", "1.25", "1.5", "1.75", "2", "2.5", "3"];

// We can return any textStyle attributes when calling
// `getAttributes("textStyle")`, but may return line-height attributes here, so
// add typing for those. Based on the official Tiptap LineHeight extension.
interface TextStyleAttrs extends ReturnType<Editor["getAttributes"]> {
  lineHeight?: string | null;
}

// Use this as a sentinel value so we can handle the case that the user's
// selection includes multiple different line heights. There won't be a visible
// "option" in the Select for this value, and this will allow the user to set
// the current line height to "Default" or to any of the multiple values, and have
// it take effect. See more comments around `currentLineHeight` below.
const MULTIPLE_LINE_HEIGHTS_SELECTED_VALUE = "MULTIPLE";

/** A line-height selector for use with the Tiptap LineHeight extension.  */
export default function MenuSelectLineHeight(
  inProps: MenuSelectLineHeightProps,
) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    options = DEFAULT_LINE_HEIGHT_SELECT_OPTIONS,
    unsetOptionLabel = "Default",
    emptyLabel,
    hideUnsetOption = false,
    classes = {},
    sx,
    ...menuSelectProps
  } = props;
  const editor = useRichTextEditorContext();

  const optionObjects: LineHeightSelectOptionObject[] = (options ?? []).map(
    (option) => (typeof option === "string" ? { value: option } : option),
  );

  // Determine if all of the selected content shares the same set line height.
  // Scenarios:
  // 1) If there is exactly one line height amongst the selected content and all
  //    of the selected content has the line height set, we'll show that as the
  //    current Selected value (as a user would expect).
  // 2) If there are multiple line heights used in the selected content or some
  //    selected content has line height set and other content does not, we'll
  //    assign the Select's `value` to a sentinel variable so that users can
  //    unset the line heights or can change to any given line height.
  // 3) Otherwise (no line height is set in any selected content), we'll show the
  //    unsetOption as selected.
  const allCurrentTextStyleAttrs: TextStyleAttrs[] = editor
    ? getAttributesForEachSelected(editor.state, "textStyle")
    : [];
  const isTextStyleAppliedToEntireSelection = !!editor?.isActive("textStyle");
  const currentLineHeights: string[] = allCurrentTextStyleAttrs.map(
    (attrs) => attrs.lineHeight ?? "", // Treat any null/missing line-height as ""
  );
  if (!isTextStyleAppliedToEntireSelection) {
    // If there is some selected content that does not have textStyle, we can
    // treat it the same as a selected textStyle mark with lineHeight set to null
    // or ""
    currentLineHeights.push("");
  }
  const numUniqueCurrentLineHeights = new Set(currentLineHeights).size;

  let currentLineHeight;
  if (numUniqueCurrentLineHeights === 1) {
    // There's exactly one line height selected, so show that
    currentLineHeight = currentLineHeights[0];
  } else if (numUniqueCurrentLineHeights > 1) {
    // There are multiple line heights (either explicitly, or because some of the
    // selection has a line height set and some does not). This is similar to what
    // Microsoft Word and Google Docs do, for instance, showing the line height
    // input as blank when there are multiple values. If we simply set
    // currentLineHeight as "" here, then the "unset option" would show as
    // selected, which would prevent the user from unsetting the line heights
    // for the selected content (since Select onChange does not fire when the
    // currently selected option is chosen again).
    currentLineHeight = MULTIPLE_LINE_HEIGHTS_SELECTED_VALUE;
  } else {
    // Show as unset (empty), since there are no line heights in any of the
    // selected content. This will show the "unset option" with the
    // unsetOptionLabel as selected, if `hideUnsetOption` is false.
    currentLineHeight = "";
  }

  return (
    <MenuSelectLineHeightRoot
      onChange={(event) => {
        const value = event.target.value;
        if (value) {
          editor?.chain().setLineHeight(value).focus().run();
        } else {
          editor?.chain().unsetLineHeight().focus().run();
        }
      }}
      disabled={
        // Pass an arbitrary value to can().setLineHeight() just to check `can()`
        !editor?.isEditable || !editor.can().setLineHeight("1.5")
      }
      renderValue={() => {
        // Always show the icon (rather than the current value) to obviously
        // indicate what this does, similar to Google Docs, MS Word, etc.
        return (
          emptyLabel ?? (
            <MenuSelectLineHeightIcon
              className={clsx([menuSelectLineHeightClasses.icon, classes.icon])}
            />
          )
        );
      }}
      displayEmpty
      aria-label="Line heights"
      tooltipTitle="Line height"
      {...menuSelectProps}
      // We don't want to pass any non-string falsy values here, always falling
      // back to ""
      value={currentLineHeight || ""}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: clsx([
          menuSelectLineHeightClasses.selectInput,
          classes.selectInput,
          menuSelectProps.inputProps?.className,
        ]),
      }}
      className={clsx([
        menuSelectLineHeightClasses.root,
        classes.root,
        menuSelectProps.className,
      ])}
      sx={sx}
    >
      {!hideUnsetOption && (
        // Allow users to unset the line height
        <MenuItem value="">{unsetOptionLabel}</MenuItem>
      )}

      {/* Including a "hidden" option for "multiple selected" (we don't want a
      user to be able to select this) allows us to avoid "you have provided an
      out-of-range value" errors */}
      <MenuItem
        style={{ display: "none" }}
        value={MULTIPLE_LINE_HEIGHTS_SELECTED_VALUE}
      />

      {optionObjects.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label ?? option.value}
        </MenuItem>
      ))}
    </MenuSelectLineHeightRoot>
  );
}
