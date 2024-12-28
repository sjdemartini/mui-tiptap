/// <reference types="@tiptap/extension-strike" />
import StrikethroughS from "@mui/icons-material/StrikethroughS";
import { getExtensionField, type AnyConfig } from "@tiptap/core";
import { useMemo } from "react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export type MenuButtonStrikethroughProps = Partial<MenuButtonProps>;

// "mod+Shift+S" is used as the shortcut for strike in Tiptap 2.1.0+
// (https://github.com/ueberdosis/tiptap/releases/tag/v2.1.0), whereas in
// earlier versions, the shortcut was "mod+Shift+X".
const DEFAULT_SHORTCUT_KEYS = ["mod", "Shift", "S"];

export default function MenuButtonStrikethrough(
  props: MenuButtonStrikethroughProps
) {
  const editor = useRichTextEditorContext();

  // Determine the correct shortcut keys to display based on the
  // installed/configured strike extension, for backwards compatibility with
  // versions of `@tiptap/extension-strike` prior to 2.1.0 that used
  // "mod+Shift+X".
  const shortcutKeys: string[] = useMemo(() => {
    const strikeExtension = editor?.extensionManager.extensions.find(
      (extension) => extension.name == "strike"
    );
    if (!strikeExtension) {
      return DEFAULT_SHORTCUT_KEYS;
    }
    const addKeyboardShortcuts = getExtensionField<
      AnyConfig["addKeyboardShortcuts"]
    >(strikeExtension, "addKeyboardShortcuts");
    if (!addKeyboardShortcuts) {
      return DEFAULT_SHORTCUT_KEYS;
    }

    const configuredKeyboardShortcuts = addKeyboardShortcuts();
    return "Mod-Shift-x" in configuredKeyboardShortcuts
      ? ["mod", "Shift", "X"]
      : DEFAULT_SHORTCUT_KEYS;
  }, [editor]);

  return (
    <MenuButton
      tooltipLabel="Strikethrough"
      tooltipShortcutKeys={shortcutKeys}
      IconComponent={StrikethroughS}
      selected={editor?.isActive("strike") ?? false}
      disabled={!editor?.isEditable || !editor.can().toggleStrike()}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
      {...props}
    />
  );
}
