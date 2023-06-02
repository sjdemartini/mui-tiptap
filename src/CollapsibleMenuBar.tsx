import { Collapse } from "@mui/material";
import type { Editor } from "@tiptap/react";
import type { Except } from "type-fest";
import MenuBar, { type MenuBarProps } from "./MenuBar";
import classNames from "./classNames";

type Props = MenuBarProps & {
  editor: Editor | null;
  /**
   * Whether to show the formatting menu bar. When changing between true/false,
   * uses collapse animation.
   */
  open: boolean;
  classes?: Partial<CollapsibleMenuBarClasses>;
};

type CollapsibleMenuBarClasses = {
  menuBarContainer?: string;
};

export function CollapsibleMenuBar({
  open,
  classes,
  ...otherMenuBarProps
}: Except<Props, "editor">) {
  const containerClassName = `${classNames.MuiTiptapMenuBarContainer} ${
    classes?.menuBarContainer ?? ""
  }`;
  return (
    <Collapse
      in={open}
      // For performance reasons, we set unmountOnExit to avoid rendering the
      // menu bar unless it's needed
      unmountOnExit
      className={containerClassName}
    >
      <MenuBar {...otherMenuBarProps} />
    </Collapse>
  );
}
