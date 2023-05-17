/* cSpell:disable */
import { describe, expect, it } from "vitest";
import slugify from "../../utils/slugify";

describe("slugify()", () => {
  // Test cases are modeled after Django's slugify, modified based on unicode
  // regex not being supported equivalently in JS
  // https://github.com/django/django/blob/7119f40c9881666b6f9b5cf7df09ee1d21cc8344/tests/utils_tests/test_text.py#L225
  // Copyright (c) Django Software Foundation and individual contributors.
  // All rights reserved.
  const items: [string, string][] = [
    // given, expected, allowUnicode
    ["Hello, World!", "hello-world"],
    ["spam & eggs", "spam-eggs"],
    [" multiple---dash and  space ", "multiple-dash-and-space"],
    ["\t whitespace-in-value \n", "whitespace-in-value"],
    ["underscore_in-value", "underscore_in-value"],
    ["__strip__underscore-value___", "strip__underscore-value"],
    ["--strip-dash-value---", "strip-dash-value"],
    ["__strip-mixed-value---", "strip-mixed-value"],
    ["_ -strip-mixed-value _-", "strip-mixed-value"],
    ["spam & ıçüş", "spam-cus"],
    ["foo ıç bar", "foo-c-bar"],
    ["    foo ıç bar", "foo-c-bar"],
    ["yes-你好", "yes"],
    ["İstanbul", "istanbul"],
  ];

  items.forEach(([given, expected]) => {
    it(`handles ${given}`, () => {
      expect(slugify(given)).toBe(expected);
    });
  });
});
