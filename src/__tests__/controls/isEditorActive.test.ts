import type { Editor } from "@tiptap/core";
import { describe, expect, it } from "vitest";
import { isEditorActive } from "../../controls/isEditorActive";

function makeEditor(overrides: Partial<Editor>): Editor {
  return {
    isEditable: true,
    isDestroyed: false,
    ...overrides,
  } as Editor;
}

describe("isEditorActive()", () => {
  it("returns false when the editor is null", () => {
    expect(isEditorActive(null)).toBe(false);
  });

  it("returns false when the editor is not editable", () => {
    expect(isEditorActive(makeEditor({ isEditable: false }))).toBe(false);
  });

  it("returns false when the editor is destroyed", () => {
    expect(isEditorActive(makeEditor({ isDestroyed: true }))).toBe(false);
  });

  it("returns true when the editor is editable and not destroyed", () => {
    expect(isEditorActive(makeEditor({}))).toBe(true);
  });
});
