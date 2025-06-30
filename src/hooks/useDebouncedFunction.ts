import type { DebouncedFunc, DebounceSettings } from "lodash";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
/**
 * A hook for creating a stable debounced version of the given function.
 *
 * The approach here ensures we use a `ref` for the `func`, with a stable return
 * value, somewhat similar to
 * https://www.developerway.com/posts/debouncing-in-react. It also provides
 * effectively the same API as the lodash function itself.
 *
 * @param func The function to debounce.
 * @param wait ms to wait between calls.
 * @param options lodash debounce options.
 * @returns debounced version of `func`.
 */
export default function useDebouncedFunction<T extends (...args: any) => any>(
  func: T | undefined,
  wait: number,
  options?: DebounceSettings,
): DebouncedFunc<T> {
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  const debouncedCallback = useMemo(() => {
    const funcWrapped = (...args: any) => funcRef.current?.(...args);
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */

    return debounce(funcWrapped, wait, {
      // We have to refer to each of the `options` individually in order to ensure our
      // useMemo dependencies are correctly/explicit, satisfying the rules of hooks. We
      // don't want to use the `options` object in the dependency array, since it's
      // likely to be a new object on each render.
      ...(options?.leading !== undefined && { leading: options.leading }),
      ...(options?.maxWait !== undefined && { maxWait: options.maxWait }),
      ...(options?.trailing !== undefined && { trailing: options.trailing }),
    });
  }, [wait, options?.leading, options?.maxWait, options?.trailing]);

  // When we unmount or the user changes the debouncing wait/options, we'll cancel past
  // invocations
  useEffect(
    () => () => {
      debouncedCallback.cancel();
    },
    [debouncedCallback],
  );

  return debouncedCallback;
}
