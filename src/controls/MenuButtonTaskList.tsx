/// <reference types="@tiptap/extension-task-list" />
import Checklist from "@mui/icons-material/Checklist";
import { useEditorState } from "@tiptap/react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonTaskListProps = Partial<MenuButtonProps>;

export default function MenuButtonTaskList(props: MenuButtonTaskListProps) {
  const editor = useRichTextEditorContext();
  const { isEditable, canToggleTaskList, isActive } = useEditorState({
    editor,
    selector: ({ editor: editorSnapshot }) => ({
      isEditable: editorSnapshot.isEditable,
      canToggleTaskList: editorSnapshot.can().toggleTaskList(),
      isActive: editorSnapshot.isActive("taskList"),
    }),
  });
  return (
    <MenuButton
      tooltipLabel="Task checklist"
      tooltipShortcutKeys={["mod", "Shift", "9"]}
      IconComponent={Checklist}
      selected={isActive}
      disabled={!isEditable || !canToggleTaskList}
      onClick={() => editor.chain().focus().toggleTaskList().run()}
      {...props}
    />
  );
}
