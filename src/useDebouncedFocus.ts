import type { Editor } from "@tiptap/core";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

interface UseDebouncedFocusOptions {
  editor: Editor | null;
}

/**
 * A hook for getting the Tiptap editor focused state, but debounced to prevent
 * "flashing" for brief blur/refocus moments, like when interacting with the menu bar
 * buttons.
 *
 * This is useful for showing the focus state visually, as with the `focused`
 * prop of <OutlinedField />.
 */
export default function useDebouncedFocus({
  editor,
}: UseDebouncedFocusOptions): boolean {
  const [isFocusedDebounced, setIsFocusedDebounced] = useState(
    !!editor?.isFocused
  );

  const setIsOutlinedFieldFocusedDebounced = useMemo(
    () => debounce((focused: boolean) => setIsFocusedDebounced(focused), 250),
    []
  );

  useEffect(() => {
    const isFocused = !!editor?.isFocused;
    setIsOutlinedFieldFocusedDebounced(isFocused);

    // We'll immediately "flush" to update the focused state of the outlined field when
    // the editor *becomes* focused (e.g. when a user first clicks into it), but we'll
    // debounce otherwise, since the editor can lose focus as a user interacts with the
    // menu bar, for instance. It feels fine to have a visual delay losing the focus
    // outline, but awkward to have delay in gaining the focus outline.
    if (isFocused) {
      setIsOutlinedFieldFocusedDebounced.flush();
    }

    return () => {
      setIsOutlinedFieldFocusedDebounced.cancel();
    };
  }, [editor?.isFocused, setIsOutlinedFieldFocusedDebounced]);

  return isFocusedDebounced;
}
