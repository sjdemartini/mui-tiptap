/**
 * Truncate the middle of the given text, if it's longer than the given length.
 */
export default function truncateMiddle(text: string, length = 20): string {
  if (text.length <= length) {
    return text;
  }

  const half = Math.floor(length / 2);
  return `${text.slice(0, half).trim()}…${text.slice(-half).trim()}`;
}
