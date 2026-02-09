import { describe, expect, it } from "vitest";
import {
  getUtilityClass,
  getUtilityClasses,
  getUtilityComponentName,
} from "../styles";

describe("getUtilityComponentName()", () => {
  it("returns component name with MuiTiptap prefix", () => {
    expect(getUtilityComponentName("RichTextContent")).toBe(
      "MuiTiptapRichTextContent",
    );
    expect(getUtilityComponentName("MenuButton")).toBe("MuiTiptapMenuButton");
    expect(getUtilityComponentName("ColorPicker")).toBe("MuiTiptapColorPicker");
  });
});

describe("getUtilityClass()", () => {
  it("returns utility class with component name and slot", () => {
    expect(getUtilityClass("Foo", "root")).toBe("MuiTiptapFoo-root");
    expect(getUtilityClass("RichTextField", "content")).toBe(
      "MuiTiptapRichTextField-content",
    );
  });

  it("handles special characters in component name and slot", () => {
    expect(getUtilityClass("MenuFoo", "sub-element")).toBe(
      "MuiTiptapMenuFoo-sub-element",
    );
    expect(getUtilityClass("MenuFoo", "sub_element")).toBe(
      "MuiTiptapMenuFoo-sub_element",
    );
  });
});

describe("getUtilityClasses()", () => {
  it("returns record mapping slots to utility classes", () => {
    const result = getUtilityClasses("Foo", ["root", "disabled"]);
    expect(result).toEqual({
      root: "MuiTiptapFoo-root",
      disabled: "MuiTiptapFoo-disabled",
    });
  });

  it("enforces type safety", () => {
    interface MenuFooClasses {
      root: string;
      disabled: string;
    }
    type MenuFooClassKey = keyof MenuFooClasses;

    getUtilityClasses("MenuFoo", [
      "root",
      "disabled",
      // @ts-expect-error - Type error should be thrown for invalid extra key
      "wat",
    ] satisfies MenuFooClassKey[]);

    // @ts-expect-error - Type error should be thrown for misspelled key
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _result2: MenuFooClasses = getUtilityClasses("MenuFoo", [
      "root",
      "disabledTypo",
    ]);

    // @ts-expect-error - Type error should be thrown for omitted key
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _result3: MenuFooClasses = getUtilityClasses("MenuFoo", ["root"]);
  });
});
