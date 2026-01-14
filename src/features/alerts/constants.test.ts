import { describe, it, expect } from "vitest";
import { ALERT_TABLE_LAYOUT } from "./constants";

describe("ALERT_TABLE_LAYOUT Constants", () => {
  it("should contain essential layout classes", () => {
    expect(ALERT_TABLE_LAYOUT.TIMESTAMP).toContain("w-[");
    expect(ALERT_TABLE_LAYOUT.SOURCE_IP).toContain("hidden sm:block");
  });

  it("should have consistent alignment classes", () => {
    Object.values(ALERT_TABLE_LAYOUT).forEach((className) => {
      expect(className).toContain("text-left");
    });
  });
});
