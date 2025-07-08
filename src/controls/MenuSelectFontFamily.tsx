/// <reference types="@tiptap/extension-font-family" />
import { MenuItem } from "@mui/material";
import type { Editor } from "@tiptap/core";
import type { ReactNode } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { useRichTextEditorContext } from "../context";
import { getAttributesForEachSelected } from "../utils/getAttributesForEachSelected";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type FontFamilySelectOption = {
  /**
   * The underlying `font-family` CSS value string
   * (https://developer.mozilla.org/en-US/docs/Web/CSS/font-family), used when
   * calling the Tiptap `setFontFamily` command when selecting this option.
   * Ex: "Comic Sans MS, Comic Sans"
   *
   * If set as an empty string, selecting this option will instead unset/remove
   * the font-family. (If you provide an option with an empty string `value`,
   * you will likely want to set the `hideUnsetOption` prop to true. This can be
   * useful if you want to place the "unset" option in a custom position amongst
   * the options, rather than having it appear first.)
   */
  value: string;
  /**
   * The user-facing label to show for this value. Ex: "Comic Sans". If not
   * provided, uses the `value` as the option label.
   */
  label?: ReactNode;
};

export type MenuSelectFontFamilyProps = Except<
  MenuSelectProps<string>,
  "value" | "children"
> & {
  /**
   * Provide the list of font families to show as options.
   */
  options: FontFamilySelectOption[];
  /**
   * Override the content shown for the Select's MenuItem option that allows a
   * user to unset the font-family of the selected text. If not provided, uses
   * "Default" as the displayed label. To hide this select option entirely, set
   * `hideUnsetOption` to true.
   *
   * You can also provide your own "unset" option via the `options` array by
   * setting its value to the empty string "".
   */
  unsetOptionLabel?: React.ReactNode;
  /**
   * If true, hides the additional first select option to "unset" the
   * font-family back to its default. By default false.
   */
  hideUnsetOption?: boolean;
  /**
   * What to render in the Select when either no font-family is currently set
   * for the selected text, or when multiple different values are set. By
   * default shows "Font".
   */
  emptyLabel?: React.ReactNode;
};

const useStyles = makeStyles({ name: { MenuSelectFontFamily } })({
  selectInput: {
    // We use a fixed width so that the Select element won't change sizes as
    // the selected option changes
    width: 55,
  },
});

// We can return any textStyle attributes when calling
// `getAttributes("textStyle")`, but may return the font-family attribute here,
// so add typing for that. Based on
// https://github.com/ueberdosis/tiptap/blob/6cbc2d423391c950558721510c1b4c8614feb534/packages/extension-font-family/src/font-family.ts#L57-L69
interface TextStyleAttrs extends ReturnType<Editor["getAttributes"]> {
  fontFamily?: string | null;
}

// Use this as a sentinel value so we can handle the case that the user's
// selection includes multiple different font families. There won't be a visible
// "option" in the Select for this value, and this will allow the user to set
// the current font family to "Default" or to any of the multiple values, and
// have it take effect. See more comments around `currentFontFamily` below.
const MULTIPLE_FAMILIES_SELECTED_VALUE = "MULTIPLE";

/** A font-family selector for use with the Tiptap FontFamily extension.  */
export default function MenuSelectFontFamily({
  options,
  hideUnsetOption = false,
  unsetOptionLabel = "Default",
  emptyLabel = "Font",
  ...menuSelectProps
}: MenuSelectFontFamilyProps) {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  // Determine if all of the selected content shares the same set font family.
  // Scenarios:
  // 1) If there is exactly one font family amongst the selected content and all
  //    of the selected content has the font family set, we'll show that as the
  //    current Selected value (as a user would expect).
  // 2) If there are multiple families used in the selected content or some
  //    selected content has font family set and other content does not, we'll
  //    assign the Select's `value` to a sentinel variable so that users can
  //    unset the families or can change to any given family.
  // 3) Otherwise (no font family is set in any selected content), we'll show the
  //    unsetOption as selected.
  const allCurrentTextStyleAttrs: TextStyleAttrs[] = editor
    ? getAttributesForEachSelected(editor.state, "textStyle")
    : [];
  const isTextStyleAppliedToEntireSelection = !!editor?.isActive("textStyle");
  const currentFontFamilies: string[] = allCurrentTextStyleAttrs.map(
    (attrs) => attrs.fontFamily ?? "", // Treat any null/missing font-family as ""
  );
  if (!isTextStyleAppliedToEntireSelection) {
    // If there is some selected content that does not have textStyle, we can
    // treat it the same as a selected textStyle mark with fontFamily set to
    // null or ""
    currentFontFamilies.push("");
  }
  const numUniqueCurrentFontFamilies = new Set(currentFontFamilies).size;

  let currentFontFamily;
  if (numUniqueCurrentFontFamilies === 1) {
    // There's exactly one font family selected, so show that
    currentFontFamily = currentFontFamilies[0];
  } else if (numUniqueCurrentFontFamilies > 1) {
    // There are multiple font families (either explicitly, or because some of the
    // selection has a font family set and some does not). This is similar to what
    // Microsoft Word and Google Docs do, for instance, showing the font family
    // input as blank when there are multiple values. If we simply set
    // currentFontFamily as "" here, then the "unset option" would show as
    // selected, which would prevent the user from unsetting the font families
    // for the selected content (since Select onChange does not fire when the
    // currently selected option is chosen again).
    currentFontFamily = MULTIPLE_FAMILIES_SELECTED_VALUE;
  } else {
    // Show as unset (empty), since there are no font families in any of the
    // selected content. This will show the "unset option" with the
    // unsetOptionLabel as selected, if `hideUnsetOption` is false.
    currentFontFamily = "";
  }

  return (
    <MenuSelect<string>
      onChange={(event) => {
        const value = event.target.value;
        if (value) {
          editor?.chain().setFontFamily(value).focus().run();
        } else {
          editor?.chain().unsetFontFamily().focus().run();
        }
      }}
      disabled={
        // Pass an arbitrary value just to check `can()`
        !editor?.isEditable || !editor.can().setFontFamily("serif")
      }
      renderValue={(value) => {
        if (!value || value === MULTIPLE_FAMILIES_SELECTED_VALUE) {
          return emptyLabel;
        }
        return options.find((option) => option.value === value)?.label ?? value;
      }}
      displayEmpty
      aria-label="Font families"
      tooltipTitle="Font"
      {...menuSelectProps}
      // We don't want to pass any non-string falsy values here, always falling
      // back to ""
      value={currentFontFamily || ""}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: cx(
          classes.selectInput,
          menuSelectProps.inputProps?.className,
        ),
      }}
    >
      {!hideUnsetOption && (
        // Allow users to unset the font-family
        <MenuItem value="">{unsetOptionLabel}</MenuItem>
      )}

      {/* Including a "hidden" option for "multiple selected" (we don't want a
      user to be able to select this) allows us to avoid "you have provided an
      out-of-range value" errors */}
      <MenuItem
        style={{ display: "none" }}
        value={MULTIPLE_FAMILIES_SELECTED_VALUE}
      />

      {options.map((fontFamilyOption) => (
        <MenuItem key={fontFamilyOption.value} value={fontFamilyOption.value}>
          <span style={{ fontFamily: fontFamilyOption.value }}>
            {fontFamilyOption.label ?? fontFamilyOption.value}
          </span>
        </MenuItem>
      ))}
    </MenuSelect>
  );
}
