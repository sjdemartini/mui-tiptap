// We'll cache the result of isMac() and isTouchDevice(), since they shouldn't
// change during a session. That way repeated calls don't require any logic and
// are rapid.
let isMacResult: boolean | undefined;
let isTouchDeviceResult: boolean | undefined;

/**
 * Return true if the user is using a Mac (as opposed to Windows, etc.) device.
 */
export function isMac(): boolean {
  if (isMacResult === undefined) {
    isMacResult = navigator.platform.includes("Mac");
  }
  return isMacResult;
}

/**
 * Return a human-readable version of which modifier key should be used for
 * keyboard shortcuts depending on Mac vs non-Mac platforms. Useful for visually
 * indicating which key to press.
 */
export function getModShortcutKey(): string {
  return isMac() ? "⌘" : "Ctrl";
}

/** Return true if the user is using a touch-based device. */
export function isTouchDevice(): boolean {
  if (isTouchDeviceResult === undefined) {
    // This technique is taken from
    // https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
    // (and https://stackoverflow.com/a/4819886/4543977)
    isTouchDeviceResult =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (window && "ontouchstart" in window) ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error: msMaxTouchPoints is IE-specific, so needs to be ignored
      navigator.msMaxTouchPoints > 0;
  }

  return isTouchDeviceResult;
}
