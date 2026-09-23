import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { County, CountyHoursRow } from "@/data/counties";

/**
 * Live hours overrides.
 *
 * Hours of operation are editable in the database (table `county_hours`) so
 * schedule changes appear on the live site immediately, without a redeploy.
 * Rows override the static defaults in src/data/counties.ts:
 *   - site_name NULL  -> county-level hours (tile summary + detail table)
 *   - site_name set   -> matching clinic site on the county detail page
 * Any column left NULL keeps the existing static value.
 */

export interface CountyHoursOverride {
  county_slug: string;
  site_name: string | null;
  hours_summary: string[] | null;
  lunch_closure: string | null;
  hours: CountyHoursRow[] | null;
  walk_in_hours: CountyHoursRow[] | null;
  notes: string[] | null;
}

const asStrings = (value: unknown): string[] | null =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : null;

const asRows = (value: unknown): CountyHoursRow[] | null =>
  Array.isArray(value)
    ? value
        .filter(
          (v): v is CountyHoursRow =>
            !!v &&
            typeof v === "object" &&
            typeof (v as CountyHoursRow).days === "string" &&
            typeof (v as CountyHoursRow).time === "string",
        )
        .map((v) => ({ days: v.days, time: v.time }))
    : null;

export const useCountyHours = () => {
  const [overrides, setOverrides] = useState<CountyHoursOverride[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("county_hours")
        .select("county_slug, site_name, hours_summary, lunch_closure, hours, walk_in_hours, notes")
        .eq("published", true);
      if (!active || error || !data) return;
      setOverrides(
        data.map((row) => ({
          county_slug: row.county_slug,
          site_name: row.site_name,
          hours_summary: asStrings(row.hours_summary),
          lunch_closure: row.lunch_closure,
          hours: asRows(row.hours),
          walk_in_hours: asRows(row.walk_in_hours),
          notes: asStrings(row.notes),
        })),
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  return overrides;
};

const normalize = (value: string) => value.trim().toLowerCase();

/** Returns a copy of `county` with any live database hours applied. */
export const applyHoursOverrides = (
  county: County,
  overrides: CountyHoursOverride[],
): County => {
  const forCounty = overrides.filter((o) => normalize(o.county_slug) === normalize(county.slug));
  if (forCounty.length === 0) return county;

  const countyLevel = forCounty.find((o) => !o.site_name);
  const next: County = { ...county };

  if (countyLevel) {
    if (countyLevel.hours_summary) next.hoursSummary = countyLevel.hours_summary;
    if (countyLevel.lunch_closure !== null) next.lunchClosure = countyLevel.lunch_closure;
    if (countyLevel.hours) next.hours = countyLevel.hours;
  }

  if (county.clinicSites?.length) {
    next.clinicSites = county.clinicSites.map((site) => {
      const match = forCounty.find(
        (o) => o.site_name && normalize(o.site_name) === normalize(site.name),
      );
      if (!match) return site;
      return {
        ...site,
        hours: match.hours ?? site.hours,
        walkInHours: match.walk_in_hours ?? site.walkInHours,
        notes: match.notes ?? site.notes,
      };
    });
  }

  return next;
};
