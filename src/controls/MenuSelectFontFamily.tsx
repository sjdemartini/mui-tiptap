/// <reference types="@tiptap/extension-font-family" />
import { MenuItem } from "@mui/material";
import type { Editor } from "@tiptap/core";
import type { ReactNode } from "react";
import type { Except } from "type-fest";
import { useRichTextEditorContext } from "../context";
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

export interface MenuSelectFontFamilyProps
  extends Except<MenuSelectProps<string>, "value" | "children"> {
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
   * What to render in the Select when no font-family is currently set for the
   * selected text. By default shows "Font".
   */
  emptyLabel?: React.ReactNode;
}

// We can return any textStyle attributes when calling
// `getAttributes("textStyle")`, but may return the font-family attribute here,
// so add typing for that. Based on
// https://github.com/ueberdosis/tiptap/blob/6cbc2d423391c950558721510c1b4c8614feb534/packages/extension-font-family/src/font-family.ts#L57-L69
interface TextStyleAttrs extends ReturnType<Editor["getAttributes"]> {
  fontFamily?: string | null;
}

/** A font-family selector for use with the Tiptap FontFamily extension.  */
export default function MenuSelectFontFamily({
  options,
  hideUnsetOption = false,
  unsetOptionLabel = "Default",
  emptyLabel = "Font",
  ...menuSelectProps
}: MenuSelectFontFamilyProps) {
  const editor = useRichTextEditorContext();

  const currentAttrs: TextStyleAttrs | undefined =
    editor?.getAttributes("textStyle");
  const currentFontFamily = currentAttrs?.fontFamily;

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
        if (!value) {
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
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      value={currentFontFamily || ""}
    >
      {!hideUnsetOption && (
        // Allow users to unset the font-family
        <MenuItem value="">{unsetOptionLabel}</MenuItem>
      )}

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
