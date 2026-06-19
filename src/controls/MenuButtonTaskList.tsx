/// <reference types="@tiptap/extension-task-list" />
import Checklist from "@mui/icons-material/Checklist";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";
import { isEditorActive } from "./isEditorActive";

export type MenuButtonTaskListProps = Partial<MenuButtonProps>;

export default function MenuButtonTaskList(props: MenuButtonTaskListProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Task checklist"
      tooltipShortcutKeys={["mod", "Shift", "9"]}
      IconComponent={Checklist}
      selected={editor?.isActive("taskList") ?? false}
      disabled={!isEditorActive(editor) || !editor.can().toggleTaskList()}
      onClick={() => editor?.chain().focus().toggleTaskList().run()}
      {...props}
    />
  );
}
