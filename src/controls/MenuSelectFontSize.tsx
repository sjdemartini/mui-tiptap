import FormatSize from "@mui/icons-material/FormatSize";
import { MenuItem } from "@mui/material";
import type { Editor } from "@tiptap/core";
import type { ReactNode } from "react";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { useRichTextEditorContext } from "../context";
import type { FontSizeAttrs } from "../extensions/FontSize";
import { getAttributesForEachSelected } from "../utils/getAttributesForEachSelected";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "./MenuButton";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type FontSizeSelectOptionObject = {
  /**
   * The underlying `font-size` CSS value string, which can be any valid CSS
   * font-size (https://developer.mozilla.org/en-US/docs/Web/CSS/font-size); ex:
   * "12px", "2rem", "small".
   *
   * If a custom `label` is not provided for an option, a value that include
   * pixels like "12px" will be displayed in this component as just "12" for
   * simplicity (but it will still properly set the fontSize using the original
   * "12px" value).
   */
  value: string;
  /**
   * A customized user-facing label to show for this font-size value. If not
   * provided, uses the `value` as the option label (with any "px" removed).
   */
  label?: ReactNode;
};

/**
 * A size option shown in the select dropdown. If given as a string, that string
 * is used both as the CSS `font-size` value and the user-facing `label`
 * (equivalent to using an object with just the `value` set as that string).
 */
export type FontSizeSelectOption = string | FontSizeSelectOptionObject;

export type MenuSelectFontSizeProps = Except<
  MenuSelectProps<string>,
  "value" | "children"
> & {
  /**
   * Override the list of the size option strings shown in the dropdown.
   */
  options?: FontSizeSelectOption[];
  /** @deprecated Use `options` prop instead. */
  sizeOptions?: string[];
  /**
   * Override the label content shown for the Select's MenuItem option that
   * allows a user to unset the font-size of the selected text. If not provided,
   * uses "Default" as the displayed text. To hide this select option entirely,
   * set `hideUnsetOption` to true.
   */
  unsetOptionLabel?: ReactNode;
  /** @deprecated Use `unsetOptionLabel` prop instead. */
  unsetOptionContent?: ReactNode;
  /**
   * If true, hides the additional first select option to "unset" the font-size
   * back to its default. By default false.
   */
  hideUnsetOption?: boolean;
  /**
   * What to render in the Select when either no font-size is currently set for
   * the selected text, or when multiple different values are set. By default,
   * uses the FormatSize MUI icon.
   */
  emptyLabel?: React.ReactNode;
  /** @deprecated Use `emptyLabel` prop instead. */
  emptyValue?: React.ReactNode;
};

const useStyles = makeStyles({ name: { MenuSelectFontSize } })({
  selectInput: {
    // We use a fixed width so that the Select element won't change sizes as
    // the selected option changes (which would shift other elements in the
    // menu bar), since the options may be different sizes
    width: 17,

    // Ensure that if we render an icon as the value, it's vertically aligned
    // properly
    display: "flex",
    alignItems: "center",
  },

  fontSizeIcon: {
    fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,
  },
});

const DEFAULT_FONT_SIZE_SELECT_OPTIONS: MenuSelectFontSizeProps["options"] = [
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "24px",
  "30px",
  "36px",
  "48px",
  "60px",
  "72px",
  "96px",
];

// We can return any textStyle attributes when calling
// `getAttributes("textStyle")`, but may return font-size attributes here, so
// add typing for those
interface TextStyleAttrs
  extends ReturnType<Editor["getAttributes"]>,
    FontSizeAttrs {}

function stripPxFromValue(value: string): string {
  return value.replace("px", "");
}

// Use this as a sentinel value so we can handle the case that the user's
// selection includes multiple different font sizes. There won't be a visible
// "option" in the Select for this value, and this will allow the user to set
// the current font size to "Default" or to any of the multiple values, and have
// it take effect. See more comments around `currentFontSize` below.
const MULTIPLE_SIZES_SELECTED_VALUE = "MULTIPLE";

/** A font-size selector for use with the mui-tiptap FontSize extension.  */
export default function MenuSelectFontSize({
  options = DEFAULT_FONT_SIZE_SELECT_OPTIONS,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  sizeOptions,
  hideUnsetOption = false,
  unsetOptionLabel = "Default",
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  unsetOptionContent,
  emptyLabel,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  emptyValue,
  ...menuSelectProps
}: MenuSelectFontSizeProps) {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  // Handle deprecated legacy names for some props:
  emptyLabel = emptyValue ?? emptyLabel;
  unsetOptionLabel = unsetOptionContent ?? unsetOptionLabel;
  options = sizeOptions ?? options;
  const optionObjects: FontSizeSelectOptionObject[] = (options ?? []).map(
    (option) => (typeof option === "string" ? { value: option } : option),
  );

  // Determine if all of the selected content shares the same set font size.
  // Scenarios:
  // 1) If there is exactly one font size amongst the selected content and all
  //    of the selected content has the font size set, we'll show that as the
  //    current Selected value (as a user would expect).
  // 2) If there are multiple sizes used in the selected content or some
  //    selected content has font size set and other content does not, we'll
  //    assign the Select's `value` to a sentinel variable so that users can
  //    unset the sizes or can change to any given size.
  // 3) Otherwise (no font size is set in any selected content), we'll show the
  //    unsetOption as selected.
  const allCurrentTextStyleAttrs: TextStyleAttrs[] = editor
    ? getAttributesForEachSelected(editor.state, "textStyle")
    : [];
  const isTextStyleAppliedToEntireSelection = !!editor?.isActive("textStyle");
  const currentFontSizes: string[] = allCurrentTextStyleAttrs.map(
    (attrs) => attrs.fontSize ?? "", // Treat any null/missing font-size as ""
  );
  if (!isTextStyleAppliedToEntireSelection) {
    // If there is some selected content that does not have textStyle, we can
    // treat it the same as a selected textStyle mark with fontSize set to null
    // or ""
    currentFontSizes.push("");
  }
  const numUniqueCurrentFontSizes = new Set(currentFontSizes).size;

  let currentFontSize;
  if (numUniqueCurrentFontSizes === 1) {
    // There's exactly one font size selected, so show that
    currentFontSize = currentFontSizes[0];
  } else if (numUniqueCurrentFontSizes > 1) {
    // There are multiple font sizes (either explicitly, or because some of the
    // selection has a font size set and some does not). This is similar to what
    // Microsoft Word and Google Docs do, for instance, showing the font size
    // input as blank when there are multiple values. If we simply set
    // currentFontSize as "" here, then the "unset option" would show as
    // selected, which would prevent the user from unsetting the font sizes
    // for the selected content (since Select onChange does not fire when the
    // currently selected option is chosen again).
    currentFontSize = MULTIPLE_SIZES_SELECTED_VALUE;
  } else {
    // Show as unset (empty), since there are no font sizes in any of the
    // selected content. This will show the "unset option" with the
    // unsetOptionLabel as selected, if `hideUnsetOption` is false.
    currentFontSize = "";
  }

  return (
    <MenuSelect<string>
      onChange={(event) => {
        const value = event.target.value;
        if (value) {
          editor?.chain().setFontSize(value).focus().run();
        } else {
          editor?.chain().unsetFontSize().focus().run();
        }
      }}
      disabled={
        // Pass an arbitrary value to can().setFontSize() just to check `can()`
        !editor?.isEditable || !editor.can().setFontSize("12px")
      }
      renderValue={(value) => {
        if (!value || value === MULTIPLE_SIZES_SELECTED_VALUE) {
          // If a specific font size isn't set, show an icon to indicate what
          // this does, so it's visually similar to other menu button controls,
          // more intuitive, and more meaningful and compact than some other
          // placeholder value here
          return emptyLabel ?? <FormatSize className={classes.fontSizeIcon} />;
        }
        return stripPxFromValue(value);
      }}
      displayEmpty
      aria-label="Font sizes"
      tooltipTitle="Font size"
      {...menuSelectProps}
      // We don't want to pass any non-string falsy values here, always falling
      // back to ""
      value={currentFontSize || ""}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: cx(
          classes.selectInput,
          menuSelectProps.inputProps?.className,
        ),
      }}
    >
      {!hideUnsetOption && (
        // Allow users to unset the font size
        <MenuItem value="">{unsetOptionLabel}</MenuItem>
      )}

      {/* Including a "hidden" option for "multiple selected" (we don't want a
      user to be able to select this) allows us to avoid "you have provided an
      out-of-range value" errors */}
      <MenuItem
        style={{ display: "none" }}
        value={MULTIPLE_SIZES_SELECTED_VALUE}
      />

      {optionObjects.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label ?? stripPxFromValue(option.value)}
        </MenuItem>
      ))}
    </MenuSelect>
  );
}
