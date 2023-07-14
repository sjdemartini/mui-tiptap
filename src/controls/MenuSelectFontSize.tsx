import { FormatSize } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import type { Editor } from "@tiptap/core";
import { makeStyles } from "tss-react/mui";
import type { Except } from "type-fest";
import { useRichTextEditorContext } from "../context";
import type { FontSizeAttrs } from "../extensions/FontSize";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "./MenuButton";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type FontSizeSelectOption = { name: string; value: string };

export interface MenuSelectFontSizeProps
  extends Except<MenuSelectProps<string>, "value" | "children"> {
  /**
   * Override the list of the size option strings shown in the dropdown.
   *
   * Values in this array can be any valid CSS font-size
   * (https://developer.mozilla.org/en-US/docs/Web/CSS/font-size); ex: "12px",
   * "2rem", "small". Values that include pixels like "12px" will be displayed
   * in this component as just "12" for simplicity (but will still properly set
   * the fontSize using the original "12px" value).
   */
  sizeOptions?: string[];
  /**
   * Override the content shown for the Select's MenuItem that allows a user to
   * unset the font-size of the selected text. If not provided, uses "Default"
   * as the displayed text. To hide this select option entirely, set
   * `hideUnsetOption` to true.
   */
  unsetOptionContent?: React.ReactNode;
  /**
   * If true, hides the additional first select option to "unset" the font-size
   * back to its default. By default false.
   */
  hideUnsetOption?: boolean;
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

const DEFAULT_FONT_SIZE_SELECT_OPTIONS: MenuSelectFontSizeProps["sizeOptions"] =
  [
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
  sizeOptions = DEFAULT_FONT_SIZE_SELECT_OPTIONS,
  hideUnsetOption = false,
  unsetOptionContent = "Default",
  ...menuSelectProps
}: MenuSelectFontSizeProps) {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  const currentAttrs: TextStyleAttrs | undefined =
    editor?.getAttributes("textStyle");
  const currentFontSize = currentAttrs?.fontSize;

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
          return <FormatSize className={classes.fontSizeIcon} />;
        }
        return stripPxFromValue(value);
      }}
      displayEmpty
      aria-label="Font size"
      {...menuSelectProps}
      tooltipTitle={menuSelectProps.tooltipTitle ?? "Font size"}
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
        <MenuItem value="">{unsetOptionContent}</MenuItem>
      )}

      {(sizeOptions ?? []).map((sizeOption) => (
        <MenuItem key={sizeOption} value={sizeOption}>
          {stripPxFromValue(sizeOption)}
        </MenuItem>
      ))}
    </MenuSelect>
  );
}
