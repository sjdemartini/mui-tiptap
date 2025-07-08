import { describe, expect, it } from "vitest";
import truncateMiddle from "../../utils/truncateMiddle";

describe("truncateMiddle()", () => {
  it("returns an ellipsis and truncates from the middle of a string", () => {
    // When the string is shorter than the truncation length, it shouldn't be truncated
    expect(truncateMiddle("short string")).toBe("short string");
    expect(truncateMiddle("short string", 5)).toBe("sh…ng");
    expect(truncateMiddle("This is a string that will be truncated!")).toBe(
      "This is a…truncated!",
    );
  });
});
