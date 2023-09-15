/// <reference types="@tiptap/extension-task-list" />
import Checklist from "@mui/icons-material/Checklist";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonTaskListProps = Partial<MenuButtonProps>;

export default function MenuButtonTaskList(props: MenuButtonTaskListProps) {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Task checklist"
      tooltipShortcutKeys={["mod", "Shift", "9"]}
      IconComponent={Checklist}
      selected={editor?.isActive("taskList") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleTaskList()}
      onClick={() => editor?.chain().focus().toggleTaskList().run()}
      {...props}
    />
  );
}
