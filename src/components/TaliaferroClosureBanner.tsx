import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * One-off homepage banner: Taliaferro County Health Department is closed today.
 * Auto-hides at 4:59 PM Eastern Time, and only ever shows on today's date.
 */
const CLOSURE_DATE_ET = "2026-05-19"; // today (America/New_York)
const HIDE_AFTER_HOUR_ET = 16;
const HIDE_AFTER_MINUTE_ET = 59;

function getEtParts(d: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => fmt.find((p) => p.type === t)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour: parseInt(get("hour"), 10),
    minute: parseInt(get("minute"), 10),
  };
}

function shouldShow() {
  const { date, hour, minute } = getEtParts(new Date());
  if (date !== CLOSURE_DATE_ET) return false;
  if (hour < HIDE_AFTER_HOUR_ET) return true;
  if (hour === HIDE_AFTER_HOUR_ET && minute <= HIDE_AFTER_MINUTE_ET) return true;
  return false;
}

const TaliaferroClosureBanner = () => {
  const [visible, setVisible] = useState(() => shouldShow());

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      if (!shouldShow()) setVisible(false);
    }, 30_000);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="border-b border-destructive bg-destructive text-destructive-foreground"
    >
      <div className="container flex items-start gap-2 py-2.5 text-sm sm:items-center">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" aria-hidden="true" />
        <p className="leading-snug">
          <span className="font-semibold">Notice:</span> The Taliaferro County
          Health Department is closed today.
        </p>
      </div>
    </div>
  );
};

export default TaliaferroClosureBanner;
