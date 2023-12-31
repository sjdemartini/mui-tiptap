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
import MenuControlsContainer from "./MenuControlsContainer";

export type MenuSelectTableBorderStyleProps = {
  labels?: {
    borderStyle?: string;
    solid?: string;
    dashed?: string;
    dotted?: string;
    double?: string;
    groove?: string;
    ridge?: string;
    inset?: string;
    outset?: string;
    none?: string;
  };
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

export default function MenuSelectTableBorderStyle({
  labels,
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

  return (
    <>
      <MenuButton
        tooltipLabel={labels?.borderStyle ?? "Border style"}
        IconComponent={BorderStyle}
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
                    <MenuButton
                      tooltipLabel={labels?.solid ?? "Solid"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleSolid}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "solid")
                          .updateAttributes("tableHeader", {
                            borderStyle: "solid",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "solid")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "solid" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "solid"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.dashed ?? "Dashed"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleDashed}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "dashed")
                          .updateAttributes("tableHeader", {
                            borderStyle: "dashed",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "dashed")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "dashed" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "dashed"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.dotted ?? "Dotted"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleDotted}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "dotted")
                          .updateAttributes("tableHeader", {
                            borderStyle: "dotted",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "dotted")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "dotted" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "dotted"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.double ?? "Double"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleDouble}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "double")
                          .updateAttributes("tableHeader", {
                            borderStyle: "double",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "double")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "double" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "double"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.groove ?? "Groove"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleGroove}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "groove")
                          .updateAttributes("tableHeader", {
                            borderStyle: "groove",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "groove")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "groove" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "groove"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.ridge ?? "Ridge"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleRidge}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "ridge")
                          .updateAttributes("tableHeader", {
                            borderStyle: "ridge",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "ridge")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "ridge" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "ridge"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.inset ?? "Inset"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleInset}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "inset")
                          .updateAttributes("tableHeader", {
                            borderStyle: "inset",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "inset")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "inset" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "inset"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.outset ?? "Outset"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleOutset}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "outset")
                          .updateAttributes("tableHeader", {
                            borderStyle: "outset",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "outset")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "outset" ||
                        editor.getAttributes("tableCell").borderStyle ===
                          "outset"
                      }
                    />

                    <MenuButton
                      tooltipLabel={labels?.none ?? "None"}
                      tooltipPlacement="right"
                      IconComponent={BorderStyleNone}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setCellAttribute("borderStyle", "none")
                          .updateAttributes("tableHeader", {
                            borderStyle: "none",
                          })
                          .run()
                      }
                      disabled={
                        !editor.can().setCellAttribute("borderStyle", "none")
                      }
                      selected={
                        editor.getAttributes("tableHeader").borderStyle ===
                          "none" ||
                        editor.getAttributes("tableCell").borderStyle === "none"
                      }
                    />
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
