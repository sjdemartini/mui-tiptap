import BorderStyle from "@mui/icons-material/BorderStyle";
import { MenuItem, type SelectChangeEvent } from "@mui/material";
import { useCallback } from "react";
import { makeStyles } from "tss-react/mui";
import { useRichTextEditorContext } from "../context";
import {
  BorderStyleDashed,
  BorderStyleDotted,
  BorderStyleDouble,
  BorderStyleGroove,
  BorderStyleInset,
  BorderStyleNone,
  BorderStyleOutset,
  BorderStyleRidge,
  BorderStyleSolid,
} from "../icons";
import MenuButtonTooltip from "./MenuButtonTooltip";

import type { Except } from "type-fest";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "./MenuButton";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type BorderStyleSelectOption = {
  value: string;
  Component: React.ElementType<{
    className: string;
  }>;

  label?: string;
};

export interface MenuSelectTableBorderStyleProps
  extends Except<MenuSelectProps<string>, "children"> {
  options?: BorderStyleSelectOption[];

  emptyLabel?: React.ReactNode;
}

const useStyles = makeStyles({ name: { MenuSelectTableBorderStyle } })(
  (theme) => ({
    selectInput: {
      width: MENU_BUTTON_FONT_SIZE_DEFAULT,
    },

    menuItem: {
      paddingLeft: 0,
      paddingRight: 0,
    },

    menuOption: {
      display: "flex",
      width: "100%",
      justifyContent: "center",
    },

    menuButton: {
      fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,

      color: theme.palette.action.active,
    },
  })
);

const DEFAULT_STYLE_OPTIONS: BorderStyleSelectOption[] = [
  {
    value: "solid",
    label: "Solid",
    Component: BorderStyleSolid,
  },
  {
    value: "dashed",
    label: "Dashed",
    Component: BorderStyleDashed,
  },
  {
    value: "dotted",
    label: "Dotted",
    Component: BorderStyleDotted,
  },
  {
    value: "double",
    label: "Double",
    Component: BorderStyleDouble,
  },
  {
    value: "groove",
    label: "Groove",
    Component: BorderStyleGroove,
  },
  {
    value: "ridge",
    label: "Ridge",
    Component: BorderStyleRidge,
  },
  {
    value: "inset",
    label: "Inset",
    Component: BorderStyleInset,
  },
  {
    value: "outset",
    label: "Outset",
    Component: BorderStyleOutset,
  },
  {
    value: "none",
    label: "None",
    Component: BorderStyleNone,
  },
];

export default function MenuSelectTableBorderStyle({
  options = DEFAULT_STYLE_OPTIONS,
  emptyLabel = <BorderStyle />,
  ...menuSelectProps
}: MenuSelectTableBorderStyleProps) {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  const handleStyleSelect: (event: SelectChangeEvent) => void = useCallback(
    (event) => {
      const style = event.target.value;
      editor?.chain().focus().setCellAttribute("borderStyle", style).run();
    },
    [editor]
  );

  const selectedValue = (editor?.getAttributes("tableCell").borderStyle ??
    "") as string;

  return (
    <MenuSelect<string>
      onChange={handleStyleSelect}
      disabled={!editor?.isEditable}
      renderValue={(value) => {
        let content;
        if (value) {
          const styleOptionForValue = options.find(
            (option) => option.value === value
          );
          content = styleOptionForValue ? (
            <styleOptionForValue.Component className={classes.menuButton} />
          ) : (
            value
          );
        } else {
          content = emptyLabel;
        }
        return <span className={classes.menuOption}>{content}</span>;
      }}
      aria-label="Border style"
      tooltipTitle="Border style"
      value={selectedValue}
      displayEmpty
      {...menuSelectProps}
      inputProps={{
        ...menuSelectProps.inputProps,
        className: cx(
          classes.selectInput,
          menuSelectProps.inputProps?.className
        ),
      }}
    >
      {options.map((styleOption) => (
        <MenuItem
          key={styleOption.value}
          value={styleOption.value}
          disabled={
            !editor?.can().setCellAttribute("borderStyle", styleOption.value)
          }
          className={classes.menuItem}
        >
          <MenuButtonTooltip
            label={styleOption.label ?? ""}
            placement="right"
            contentWrapperClassName={classes.menuOption}
          >
            <styleOption.Component className={classes.menuButton} />
          </MenuButtonTooltip>
        </MenuItem>
      ))}
    </MenuSelect>
  );
}
