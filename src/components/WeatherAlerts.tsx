import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ExternalLink, Info, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Alert = {
  id: string;
  event: string;
  severity: string;
  urgency: string;
  certainty: string;
  counties: string[];
  areaDesc: string;
  effective: string | null;
  expires: string | null;
  headline: string;
  description: string;
  instruction: string;
  url: string;
};

type Payload = { alerts: Alert[]; updatedAt: string; stale: boolean };

const easternFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  dateStyle: "medium",
  timeStyle: "short",
});

function formatEastern(value: string | null): string {
  if (!value) return "Not provided";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Not provided";
  return `${easternFormatter.format(d)} ET`;
}

/** Severity is conveyed by text and icon, never by color alone. */
function severityIcon(severity: string) {
  if (severity === "Extreme" || severity === "Severe") {
    return <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />;
  }
  if (severity === "Moderate") {
    return <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />;
  }
  return <Info className="h-5 w-5 shrink-0" aria-hidden="true" />;
}

const WeatherAlerts = () => {
  const [data, setData] = useState<Payload | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const lastGood = useRef<Payload | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke<Payload>(
          "nws-alerts",
        );
        if (error || !result || !Array.isArray(result.alerts)) {
          throw error ?? new Error("Unexpected response");
        }
        if (!active) return;
        lastGood.current = result;
        setData(result);
        setStatus("ready");
      } catch {
        if (!active) return;
        if (lastGood.current) {
          setData({ ...lastGood.current, stale: true });
          setStatus("ready");
        } else {
          setStatus("error");
        }
      }
    };

    load();
    const timer = window.setInterval(load, 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const alerts = data?.alerts ?? [];

  return (
    <section aria-labelledby="nws-alerts">
      <h2 id="nws-alerts" className="text-2xl font-semibold">
        National Weather Service Alerts
      </h2>
      <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />

      <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
        {status === "loading" && "Loading current National Weather Service alerts."}
        {status === "error" &&
          "National Weather Service alerts could not be loaded right now. Check weather.gov for current conditions."}
        {status === "ready" &&
          (alerts.length === 0
            ? "No active National Weather Service alerts for the East Central Health District."
            : `${alerts.length} active National Weather Service alert${
                alerts.length === 1 ? "" : "s"
              } for the East Central Health District.`)}
      </p>

      {data?.stale && (
        <p className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground/90">
          These results may be out of date. The National Weather Service feed
          could not be reached during the most recent check.
        </p>
      )}

      {status === "ready" && alerts.length > 0 && (
        <ul className="mt-5 space-y-5">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="rounded-lg border border-border bg-muted/30 p-5"
            >
              <h3 className="flex items-start gap-2 text-lg font-semibold">
                {severityIcon(alert.severity)}
                <span>{alert.event}</span>
              </h3>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold">Severity</dt>
                  <dd className="text-foreground/90">{alert.severity}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Urgency</dt>
                  <dd className="text-foreground/90">{alert.urgency}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Affected district counties</dt>
                  <dd className="text-foreground/90">
                    {alert.counties.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Full alert area</dt>
                  <dd className="text-foreground/90">{alert.areaDesc}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Effective</dt>
                  <dd className="text-foreground/90">
                    {formatEastern(alert.effective)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Expires</dt>
                  <dd className="text-foreground/90">
                    {formatEastern(alert.expires)}
                  </dd>
                </div>
              </dl>

              {alert.description && (
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-foreground/90">
                  {alert.description}
                </p>
              )}

              {alert.instruction && (
                <>
                  <h4 className="mt-4 text-base font-semibold">
                    Safety instructions
                  </h4>
                  <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-foreground/90">
                    {alert.instruction}
                  </p>
                </>
              )}

              <a
                href={alert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Read the full {alert.event} on Weather.gov
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {data?.updatedAt && (
        <p className="mt-4 text-sm text-muted-foreground">
          Last successful update: {formatEastern(data.updatedAt)}
        </p>
      )}

      <p className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-base leading-relaxed text-foreground/90">
        Weather information is provided by the National Weather Service. Do not
        rely on this webpage as your only source of emergency information. Follow
        instructions from local emergency officials and use multiple alert
        sources.
      </p>
    </section>
  );
};

export default WeatherAlerts;
