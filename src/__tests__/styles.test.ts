import { describe, expect, it } from "vitest";
import {
  getComponentName,
  getUtilityClass,
  getUtilityClasses,
} from "../styles";

describe("getComponentName()", () => {
  it("returns component name with MuiTiptap prefix", () => {
    expect(getComponentName("RichTextContent")).toBe(
      "MuiTiptap-RichTextContent",
    );
    expect(getComponentName("MenuButton")).toBe("MuiTiptap-MenuButton");
    expect(getComponentName("ColorPicker")).toBe("MuiTiptap-ColorPicker");
  });
});

describe("getUtilityClass()", () => {
  it("returns utility class with component name and slot", () => {
    expect(getUtilityClass("Foo", "root")).toBe("MuiTiptap-Foo-root");
    expect(getUtilityClass("RichTextField", "content")).toBe(
      "MuiTiptap-RichTextField-content",
    );
  });

  it("handles special characters in component name and slot", () => {
    expect(getUtilityClass("MenuFoo", "sub-element")).toBe(
      "MuiTiptap-MenuFoo-sub-element",
    );
    expect(getUtilityClass("MenuFoo", "sub_element")).toBe(
      "MuiTiptap-MenuFoo-sub_element",
    );
  });
});

describe("getUtilityClasses()", () => {
  it("returns record mapping slots to utility classes", () => {
    const result = getUtilityClasses("Foo", ["root", "disabled"]);
    expect(result).toEqual({
      root: "MuiTiptap-Foo-root",
      disabled: "MuiTiptap-Foo-disabled",
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
