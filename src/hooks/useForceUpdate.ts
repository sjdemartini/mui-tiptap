import { useReducer } from "react";

export type UseForceUpdateResult = () => void;

/**
 * A hook that returns a function to call which will perform a force re-render
 * of the given component.
 *
 * This should be used very sparingly! It's typically only needed in situations
 * where the underlying Tiptap editor has updated some state external to React
 * and there are no alternatives to update, like Tiptap's useEditor hook itself
 * does
 * https://github.com/ueberdosis/tiptap/blob/b0198eb14b98db5ca691bd9bfe698ffaddbc4ded/packages/react/src/useEditor.ts#L105-L113.
 *
 * Implementation taken from
 * https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
 */
export default function useForceUpdate(): UseForceUpdateResult {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  return forceUpdate;
}
