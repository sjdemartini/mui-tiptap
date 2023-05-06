/** Convert a string to a URL slug. */
export default function slugify(text: string): string {
  // This is nearly a direct port of Django's slugify, minus the unicode
  // handling, since regex in JS doesn't seem to handle unicode chars as a part
  // of \w (see here https://mathiasbynens.be/notes/es6-unicode-regex for more
  // details).
  // https://docs.djangoproject.com/en/4.0/ref/utils/#django.utils.text.slugify
  // https://github.com/django/django/blob/7119f40c9881666b6f9b5cf7df09ee1d21cc8344/django/utils/text.py#L399-L417
  // Copyright (c) Django Software Foundation and individual contributors.
  // All rights reserved.
  return (
    text
      .toLowerCase()
      // Convert to nearest compatible ascii chars
      // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
      .normalize("NFKD")
      // Remove characters that aren’t alphanumerics, underscores, hyphens, or
      // whitespace
      .replace(/[^\w\s-]+/g, "")
      // Replace any whitespace or repeated dashes with single dashes
      .replace(/[-\s]+/g, "-")
      // Remove leading and trailing whitespace, dashes, and underscores
      .replace(/^[\s-_]+|[\s-_]+$/g, "")
  );
}
