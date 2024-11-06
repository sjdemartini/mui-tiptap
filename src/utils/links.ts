import encodeurl from "encodeurl";

/**
 * Format the `href` value for a link, when a user has finished typing.
 *
 * This function:
 *  - trims leading/trailing whitespace
 *  - ensures the value has a protocol (http://) if it doesn't already, unless
 *    it's a relative URL (starting with "/") or anchor (starting with "#")
 *  - URL-encodes the result
 *
 * @param value The value to format as an href (user-entered input value)
 * @returns The formatted value
 */

export function formatHref(value: string): string {
  // Unless the value is explicitly a relative URL (starting with "/" or "#"),
  // add a protocol if they typed in a value that doesn't include a protocol.
  // (This also includes mailto:, tel:, and sms: since they are also valid for
  // `href`
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href, and
  // Tiptap has builtin autolink support for email address conversion to
  // mailto.) This protocol-adding behavior is what Slack does, and seems
  // reasonable to ensure it's more likely a valid/expected URL (e.g. if someone
  // types "example.com", we should accept it and treat it as
  // "http://example.com", not a relative path on the current site).
  let currentHrefValue = value.trim();
  if (
    currentHrefValue &&
    !/^(https?:\/\/|mailto:|tel:|sms:|\/|#)/.test(currentHrefValue)
  ) {
    currentHrefValue = `http://${currentHrefValue}`;
  }

  // URL-encode any characters that wouldn't be valid. We use `encodeurl`
  // instead of the builtin `encodeURI` so that if there are any
  // already-encoded sequences, they're not double-encoded and thus broken.
  // (Useful for instance when a user pastes a URL into the form with complex
  // and already-encoded parameters.)
  return encodeurl(currentHrefValue);
}
