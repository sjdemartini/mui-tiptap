import { BiCodeBlock } from "react-icons/bi";
import { useRichTextEditorContext } from "../context";
import MenuButton from "./MenuButton";

export default function MenuButtonCodeBlock() {
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Code block"
      tooltipShortcutKeys={["mod", "Alt", "C"]}
      IconComponent={BiCodeBlock}
      selected={editor?.isActive("codeBlock") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleCodeBlock()}
      onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
    />
  );
}
