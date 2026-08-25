import { describe, expect, it } from "vitest";
import { calculateTimeDiff, formatForInput } from "../src/utils/dateHelpers";

describe("date helpers", () => {
  it("formats a date for a datetime-local input", () => {
    expect(formatForInput("2026-06-18T12:05:00")).toBe("2026-06-18T12:05");
  });

  it("reports whole days remaining", () => {
    const current = new Date("2026-06-01T00:00:00");
    expect(calculateTimeDiff("2026-06-04T00:00:00", current)).toEqual({
      value: 3,
      unit: "days",
      suffix: "left",
    });
  });
});