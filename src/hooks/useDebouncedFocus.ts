import type { Editor } from "@tiptap/core";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";

export type UseDebouncedFocusOptions = {
  editor: Editor | null;
  /**
   * The debounce wait timeout in ms for updating focused state. By default 250.
   */
  wait?: number;
};

/**
 * A hook for getting the Tiptap editor focused state, but debounced to prevent
 * "flashing" for brief blur/refocus moments, like when interacting with the
 * menu bar buttons.
 *
 * This is useful for showing the focus state visually, as with the `focused`
 * prop of <FieldContainer />.
 */
export default function useDebouncedFocus({
  editor,
  wait = 250,
}: UseDebouncedFocusOptions): boolean {
  const [isFocusedDebounced, setIsFocusedDebounced] = useState(
    !!editor?.isFocused,
  );

  const updateIsFocusedDebounced = useMemo(
    () =>
      debounce((focused: boolean) => {
        setIsFocusedDebounced(focused);
      }, wait),
    [wait],
  );

  useEffect(() => {
    const isFocused = !!editor?.isFocused;
    updateIsFocusedDebounced(isFocused);

    // We'll immediately "flush" to update the focused state of the outlined field when
    // the editor *becomes* focused (e.g. when a user first clicks into it), but we'll
    // debounce otherwise, since the editor can lose focus as a user interacts with the
    // menu bar, for instance. It feels fine to have a visual delay losing the focus
    // outline, but awkward to have delay in gaining the focus outline.
    if (isFocused) {
      updateIsFocusedDebounced.flush();
    }

    return () => {
      updateIsFocusedDebounced.cancel();
    };
  }, [editor?.isFocused, updateIsFocusedDebounced]);

  return isFocusedDebounced;
}
