import { Collapse } from "@mui/material";
import MenuBar, { type MenuBarProps } from "./MenuBar";
import classNames from "./classNames";

export type CollapsibleMenuBarProps = MenuBarProps & {
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

export default function CollapsibleMenuBar({
  open,
  classes,
  ...otherMenuBarProps
}: CollapsibleMenuBarProps) {
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
