import { Collapse } from "@mui/material";
import type { Editor } from "@tiptap/react";
import type { Except } from "type-fest";
import EditorMenuBar, { type EditorMenuBarProps } from "./EditorMenuBar";
import classNames from "./classNames";

type Props = EditorMenuBarProps & {
  editor: Editor | null;
  /**
   * Whether to show the formatting menu bar. When changing between true/false,
   * uses collapse animation.
   */
  open: boolean;
  classes?: Partial<CollapsibleEditorMenuBarClasses>;
};

type CollapsibleEditorMenuBarClasses = {
  menuBarContainer?: string;
};

export function CollapsibleEditorMenuBar({
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
      <EditorMenuBar {...otherMenuBarProps} />
    </Collapse>
  );
}
