import { FormatSize } from "@mui/icons-material";
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

export interface MenuSelectFontSizeProps
  extends Except<MenuSelectProps<string>, "value" | "children"> {
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
   * What to render in the Select when no font-size is currently set for the
   * selected text. By default, uses the FormatSize MUI icon.
   */
  emptyLabel?: React.ReactNode;
  /** @deprecated Use `emptyLabel` prop instead. */
  emptyValue?: React.ReactNode;
}

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

/** A font-size selector for use with the mui-tiptap FontSize extension.  */
export default function MenuSelectFontSize({
  options = DEFAULT_FONT_SIZE_SELECT_OPTIONS,
  sizeOptions,
  hideUnsetOption = false,
  unsetOptionLabel = "Default",
  unsetOptionContent,
  emptyLabel,
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
    (option) => (typeof option === "string" ? { value: option } : option)
  );

  // Determine if all of the selected content shares the same set font size. If
  // not, treat the font-size as unset, so that the user can select a common
  // font size for the full selection (and so we don't erroneously display just
  // the first of the selected marks' font sizes). This is similar to what
  // Google Docs does, for instance, showing the font size input as blank when
  // there are multiple values. If all of the selected content has a textStyle
  // assigned (`isActive("textStyle")`), we get the textStyle attributes for
  // each of the marks in the selection. If not every selected node/mark has
  // textStyle assigned, then we can treat the "current font size" as unset.
  const allCurrentTextStyleAttrs: TextStyleAttrs[] = editor?.isActive(
    "textStyle"
  )
    ? getAttributesForEachSelected(editor.state, "textStyle")
    : [];
  const currentFontSizes = allCurrentTextStyleAttrs.map(
    (attrs) => attrs.fontSize
  );
  const numCurrentFontSizes = new Set(currentFontSizes).size;
  const currentFontSize =
    numCurrentFontSizes === 1 ? currentFontSizes[0] : undefined;

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
        if (!value) {
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
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      value={currentFontSize || ""}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: cx(
          classes.selectInput,
          menuSelectProps.inputProps?.className
        ),
      }}
    >
      {!hideUnsetOption && (
        // Allow users to unset the font size
        <MenuItem value="">{unsetOptionLabel}</MenuItem>
      )}

      {optionObjects.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label ?? stripPxFromValue(option.value)}
        </MenuItem>
      ))}
    </MenuSelect>
  );
}
