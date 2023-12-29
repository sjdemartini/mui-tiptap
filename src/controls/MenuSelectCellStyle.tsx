import { MenuItem, type SelectChangeEvent } from "@mui/material";
import { useCallback } from "react";
import { makeStyles } from "tss-react/mui";
import { useRichTextEditorContext } from "../context";
import MenuButtonTooltip, {
} from "./MenuButtonTooltip";
import BorderStyleSolidIcon from '../icons/BorderStyleSolid';
import BorderStyleDashedIcon from '../icons/BorderStyleDashed';
import BorderStyleDottedIcon from '../icons/BorderStyleDotted';
import BorderStyleInset from "../icons/BorderStyleInset";
import BorderStyleOutset from "../icons/BorderStyleOutset";
import BorderStyleDouble from "../icons/BorderStyleDouble";
import BorderStyleGroove from "../icons/BorderStyleGroove";
import BorderStyleRidge from "../icons/BorderStyleRidge";
import BorderStyleNone from "../icons/BorderStyleNone";

import type { Except } from "type-fest";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "./MenuButton";
import MenuSelect, { type MenuSelectProps } from "./MenuSelect";

export type CellStyleSelectOption = {
  value: string;
  IconComponent: React.ElementType<{
    className: string;
  }>;

  label?: string;

};

export interface MenuSelectCellStyleProps
  extends Except<MenuSelectProps<string>, "children"> {

  options?: CellStyleSelectOption[];

  emptyLabel?: React.ReactNode;
}

const useStyles = makeStyles({ name: { MenuSelectCellStyle } })((theme) => ({
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

  menuButtonIcon: {
    fontSize: MENU_BUTTON_FONT_SIZE_DEFAULT,

    color: theme.palette.action.active,
  },
}));

const DEFAULT_STYLE_OPTIONS: CellStyleSelectOption[] = [
  {
    value: "solid",
    label: "Solid",
    IconComponent: BorderStyleSolidIcon,
  },
  {
    value: "dashed",
    label: "Dashed",
    IconComponent: BorderStyleDashedIcon,
  },
  {
    value: "dotted",
    label: "Dotted",
    IconComponent: BorderStyleDottedIcon,
  },
  {
    value: "double",
    label: "Double",
    IconComponent: BorderStyleDouble,
  },
  {
    value: "groove",
    label: "Groove",
    IconComponent: BorderStyleGroove,
  },
  {
    value: "ridge",
    label: "Ridge",
    IconComponent: BorderStyleRidge,
  },
  {
    value: "inset",
    label: "Inset",
    IconComponent: BorderStyleInset,
  },
  {
    value: "outset",
    label: "Outset",
    IconComponent: BorderStyleOutset,
  },
  {
    value: "none",
    label: "None",
    IconComponent: BorderStyleNone,
  }
];

export default function MenuSelectCellStyle({
  options = DEFAULT_STYLE_OPTIONS,
  emptyLabel = "",
  ...menuSelectProps
}: MenuSelectCellStyleProps) {
  const { classes, cx } = useStyles();
  const editor = useRichTextEditorContext();

  const handleSTYLESelect: (event: SelectChangeEvent) => void = useCallback(
    (event) => {
      const style = event.target.value;
      editor?.chain().focus().setCellAttribute('borderStyle', style).run();
    },
    [editor]
  );

  const selectedValue =
  editor?.getAttributes("TableCell").borderStyle ?? "";

  return (
    <MenuSelect<string>
      onChange={handleSTYLESelect}
      disabled={
        !editor?.isEditable
      }

      renderValue={(value) => {
        let content;
        if (value) {
          const styleOptionForValue = options.find(
            (option) => option.value === value
          );
          content = styleOptionForValue ? (
            <styleOptionForValue.IconComponent
              className={classes.menuButtonIcon}
            />
          ) : (
            value
          );
        } else {
          content = emptyLabel;
        }
        return <span className={classes.menuOption}>{content}</span>;
      }}
      aria-label="Cell style"
      tooltipTitle="Cell style"
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
      {options
        .map((styleOption) => (
          <MenuItem
            key={styleOption.value}
            value={styleOption.value}
            disabled={!editor?.can().setCellAttribute('borderStyle', styleOption.value)}
            className={classes.menuItem}
          >
            <MenuButtonTooltip
              label={styleOption.label ?? ""}
              placement="right"
              contentWrapperClassName={classes.menuOption}
            >
              <styleOption.IconComponent
                className={classes.menuButtonIcon}
              />
            </MenuButtonTooltip>
          </MenuItem>
        ))}
    </MenuSelect>
  );
}
