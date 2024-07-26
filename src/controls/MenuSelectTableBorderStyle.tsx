import BorderStyle from "@mui/icons-material/BorderStyle";
import { ClickAwayListener, Fade, Paper, Popper } from "@mui/material";
import * as React from "react";
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
import { Z_INDEXES } from "../styles";
import MenuButton from "./MenuButton";
import type { MenuButtonTooltipProps } from "./MenuButtonTooltip";
import MenuControlsContainer from "./MenuControlsContainer";

export type BorderStyleSelectOption = {
  value: string;
  IconComponent: React.ElementType<{
    className: string;
  }>;
  label?: string;
  shortcutKeys?: MenuButtonTooltipProps["shortcutKeys"];
};

export type MenuSelectTableBorderStyleProps = {
  options?: BorderStyleSelectOption[];
  label?: string;
  className?: string;
};

const useStyles = makeStyles({ name: { MenuSelectTableBorderStyle } })(
  (theme) => ({
    root: {
      zIndex: Z_INDEXES.BUBBLE_MENU,
    },

    paper: {
      backgroundColor: theme.palette.background.default,
    },
  })
);

const DEFAULT_BORDER_STYLE_OPTIONS: BorderStyleSelectOption[] = [
  {
    value: "solid",
    label: "Solid",
    IconComponent: BorderStyleSolid,
  },
  {
    value: "dashed",
    label: "Dashed",
    IconComponent: BorderStyleDashed,
  },
  {
    value: "dotted",
    label: "Dotted",
    IconComponent: BorderStyleDotted,
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
  },
];

export default function MenuSelectTableBorderStyle({
  options = DEFAULT_BORDER_STYLE_OPTIONS,
  label,
  className,
}: MenuSelectTableBorderStyleProps) {
  const editor = useRichTextEditorContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { classes, cx } = useStyles();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    anchorEl ? handleClose() : setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!editor?.isEditable) {
    return null;
  }

  const IconComponent =
    options.find(
      (option) =>
        editor.getAttributes("tableHeader").borderStyle === option.value ||
        editor.getAttributes("tableCell").borderStyle === option.value
    )?.IconComponent ?? BorderStyle;

  return (
    <>
      <MenuButton
        tooltipLabel={label ?? "Border style"}
        IconComponent={IconComponent}
        onClick={handleClick}
        selected={open}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "border-style-menu" : undefined}
      />
      <Popper
        transition
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        className={cx(classes.root, className)}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={100}>
            <div>
              <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClose}
              >
                <Paper elevation={5}>
                  <MenuControlsContainer
                    className={className}
                    direction="vertical"
                  >
                    {options.map((option) => (
                      <MenuButton
                        key={option.value}
                        tooltipLabel={option.label ?? option.value}
                        tooltipPlacement="right"
                        IconComponent={option.IconComponent}
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .setCellAttribute("borderStyle", option.value)
                            .updateAttributes("tableHeader", {
                              borderStyle: option.value,
                            })
                            .run()
                        }
                        disabled={
                          !editor
                            .can()
                            .setCellAttribute("borderStyle", option.value)
                        }
                        selected={
                          editor.getAttributes("tableHeader").borderStyle ===
                            option.value ||
                          editor.getAttributes("tableCell").borderStyle ===
                            option.value
                        }
                      />
                    ))}
                  </MenuControlsContainer>
                </Paper>
              </ClickAwayListener>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  );
}
