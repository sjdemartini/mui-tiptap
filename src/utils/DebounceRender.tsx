import type { DebounceSettings, DebouncedFunc } from "lodash";
import debounce from "lodash/debounce";
import { Component } from "react";

export type DebounceRenderProps = {
  /**
   * The wait in ms for debouncing. Any changes to this prop after initial
   * render are ignored.
   */
  wait?: number;
  /**
   * Options to use for lodash's debounce call. Any changes to this prop after
   * initial render are ignored.
   */
  options?: DebounceSettings;
  /** Content to render at debounced intervals as props change */
  children: React.ReactNode;
};

/**
 * This component debounces the rendering of its children.
 *
 * WARNING: Use with caution! This component should *only* be used when there
 * are updates triggered via "force-update" (like via Tiptap's `useEditor` hook
 * which updates upon ProseMirror editor changes to the selection, content,
 * etc.). For ordinary React components, traditional memoization techniques
 * around props and state (like useCallback, useMemo, memo, etc.) should be used
 * instead.
 *
 * This component is provided for a very narrow use-case: with our menu
 * controls, without debouncing the controls would re-render per editor state
 * change (e.g. for every character typed or for caret movement), which can bog
 * things down a bit, like when holding down backspace or typing very quickly.
 * (This is due to the way that Tiptap's useEditor re-renders upon changes in
 * the ProseMirror state, which is to force-update
 * https://github.com/ueberdosis/tiptap/blob/b0198eb14b98db5ca691bd9bfe698ffaddbc4ded/packages/react/src/useEditor.ts#L105-L113,
 * rather than in response to prop changes. Because of the force re-render, and
 * since we *do* want to watch editor updates, we have to debounce rendering a
 * bit less conventionally, rather than using callbacks, memo, etc.). We do
 * want/need the menu controls to update very frequently, since we need them to
 * reflect the state of the current cursor position and editor nodes/marks,
 * etc., but we want rendering to stay performant, so the `wait` and `options`
 * defaults below are a reasonable enough balance.
 */
export default class DebounceRender extends Component<DebounceRenderProps> {
  // Similar to the approach from
  // https://github.com/podefr/react-debounce-render, except as a component
  // instead of an HOC.
  public updateDebounced: DebouncedFunc<() => void>;

  constructor(props: DebounceRenderProps) {
    super(props);
    this.updateDebounced = debounce(
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.forceUpdate,
      props.wait ?? 170,
      props.options ?? {
        leading: true,
        trailing: true,
        maxWait: 300,
      },
    );
  }

  shouldComponentUpdate() {
    this.updateDebounced();
    return false;
  }

  componentWillUnmount() {
    this.updateDebounced.cancel();
  }

  render() {
    return this.props.children;
  }
}
