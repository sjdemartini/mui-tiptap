import { Collapse } from "@mui/material";
import type { Editor } from "@tiptap/react";
import type { Except } from "type-fest";
import EditorMenuBar, { type EditorMenuBarProps } from "./EditorMenuBar";

type Props = EditorMenuBarProps & {
  editor: Editor | null;
  /**
   * Whether to show the formatting menu bar. When changing between true/false,
   * uses collapse animation.
   */
  showFormattingMenuBar: boolean;
  classes?: Partial<EditableToolingClasses>;
};

type EditableToolingClasses = {
  menuBarContainer?: string;
};

export function CollapsableEditorMenuBar({
  showFormattingMenuBar,
  classes,
  ...otherMenuBarProps
}: Except<Props, "editor">) {
  return (
    <Collapse
      in={showFormattingMenuBar}
      // For performance reasons, we set unmountOnExit to avoid rendering the
      // menu bar unless it's needed
      unmountOnExit
      className={classes?.menuBarContainer}
    >
      <EditorMenuBar {...otherMenuBarProps} />
    </Collapse>
  );
}
