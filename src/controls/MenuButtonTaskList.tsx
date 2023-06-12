import { Checklist } from "@mui/icons-material";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonTaskList() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Task checklist"
      tooltipShortcutKeys={["mod", "Shift", "9"]}
      IconComponent={Checklist}
      selected={editor?.isActive("taskList") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleTaskList()}
      onClick={() => editor?.chain().focus().toggleTaskList().run()}
    />
  );
}
