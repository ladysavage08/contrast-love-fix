import { describe, it, expect } from "vitest";
import { defaultSlides, isSlideActive } from "./HeroSlider";

const diabetes = defaultSlides.find((s) => s.cta.href === "/diabetes-awareness-month")!;
const breast = defaultSlides.find((s) => s.cta.href === "/breastcancer")!;
const t = (iso: string) => new Date(iso).getTime();

describe("American Diabetes Month homepage slide schedule (Eastern Time)", () => {
  it("is hidden just before Nov 1, 2026 12:00 AM ET", () => {
    expect(isSlideActive(diabetes, t("2026-10-31T23:59:59-04:00"))).toBe(false);
  });
  it("shows at Nov 1, 2026 12:00 AM ET", () => {
    expect(isSlideActive(diabetes, t("2026-11-01T00:00:00-04:00"))).toBe(true);
  });
  it("still shows Nov 30, 2026 11:59 PM ET", () => {
    expect(isSlideActive(diabetes, t("2026-11-30T23:59:00-05:00"))).toBe(true);
  });
  it("is hidden at Dec 1, 2026 12:00 AM ET", () => {
    expect(isSlideActive(diabetes, t("2026-12-01T00:00:00-05:00"))).toBe(false);
  });
  it("breast cancer slide stays hidden in November", () => {
    expect(isSlideActive(breast, t("2026-11-15T12:00:00-05:00"))).toBe(false);
  });
});
