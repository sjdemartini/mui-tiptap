import BorderStyle from "@mui/icons-material/BorderStyle";
import * as React from "react";
import ControlledBubbleMenu from "../ControlledBubbleMenu";
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

export default function MenuSelectTableBorderStyle({
  labels,
  className,
}: MenuSelectTableBorderStyleProps) {
  const editor = useRichTextEditorContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
      <ControlledBubbleMenu
        editor={editor}
        anchorEl={anchorEl}
        open={open}
        placement="bottom-start"
        onMouseLeave={handleClose}
      >
        <MenuControlsContainer className={className} direction="vertical">
          <MenuButton
            tooltipLabel={labels?.solid ?? "Solid"}
            IconComponent={BorderStyleSolid}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "solid")
                .updateAttributes("tableHeader", { borderStyle: "solid" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "solid")}
          />

          <MenuButton
            tooltipLabel={labels?.dashed ?? "Dashed"}
            IconComponent={BorderStyleDashed}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "dashed")
                .updateAttributes("tableHeader", { borderStyle: "dashed" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "dashed")}
          />

          <MenuButton
            tooltipLabel={labels?.dotted ?? "Dotted"}
            IconComponent={BorderStyleDotted}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "dotted")
                .updateAttributes("tableHeader", { borderStyle: "dotted" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "dotted")}
          />

          <MenuButton
            tooltipLabel={labels?.double ?? "Double"}
            IconComponent={BorderStyleDouble}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "double")
                .updateAttributes("tableHeader", { borderStyle: "double" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "double")}
          />

          <MenuButton
            tooltipLabel={labels?.groove ?? "Groove"}
            IconComponent={BorderStyleGroove}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "groove")
                .updateAttributes("tableHeader", { borderStyle: "groove" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "groove")}
          />

          <MenuButton
            tooltipLabel={labels?.ridge ?? "Ridge"}
            IconComponent={BorderStyleRidge}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "ridge")
                .updateAttributes("tableHeader", { borderStyle: "ridge" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "ridge")}
          />

          <MenuButton
            tooltipLabel={labels?.inset ?? "Inset"}
            IconComponent={BorderStyleInset}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "inset")
                .updateAttributes("tableHeader", { borderStyle: "inset" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "inset")}
          />

          <MenuButton
            tooltipLabel={labels?.outset ?? "Outset"}
            IconComponent={BorderStyleOutset}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "outset")
                .updateAttributes("tableHeader", { borderStyle: "outset" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "outset")}
          />

          <MenuButton
            tooltipLabel={labels?.none ?? "None"}
            IconComponent={BorderStyleNone}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute("borderStyle", "none")
                .updateAttributes("tableHeader", { borderStyle: "none" })
                .run()
            }
            disabled={!editor.can().setCellAttribute("borderStyle", "none")}
          />
        </MenuControlsContainer>
      </ControlledBubbleMenu>
    </>
  );
}
