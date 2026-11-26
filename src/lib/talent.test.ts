import { describe, expect, it } from "vitest";
import {
  calculatePayout,
  filterTalent,
  initialTalent,
  SALARY_MIN,
  SALARY_MAX,
  TRIAL_WEEKS,
} from "./talent";
describe("Prototype rules", () => {
  it("limits salary to $1,000–$5,000", () => {
    expect(SALARY_MIN).toBe(1000);
    expect(SALARY_MAX).toBe(5000);
    expect(calculatePayout(500, "Kenya").gross).toBe(1000);
    expect(calculatePayout(6000, "Kenya").gross).toBe(5000);
  });
  it("offers two-week trials", () => {
    expect(TRIAL_WEEKS).toBe(2);
  });
  it("filters role and hub", () => {
    expect(
      filterTalent(initialTalent, "Software Engineering", "Amman", false).map((p) => p.name),
    ).toEqual(["Tariq Al-Mansoor"]);
  });
  it("excludes non-compliant profiles", () => {
    const p = initialTalent[0];
    if (!p) throw new Error("Missing fixture");
    expect(filterTalent([{ ...p, ready: false }], "All", "All", true)).toHaveLength(0);
  });
  it("calculates illustrative Kenya payout and EoR cost", () => {
    expect(calculatePayout(2000, "Kenya").net).toBe(219300);
    expect(calculatePayout(2000, "Kenya").total).toBe(2199);
  });
});
