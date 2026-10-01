import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDateKey } from "@/lib/eventDate";

export type FluClinic = {
  id: string;
  county_slug: string;
  name: string;
  clinic_date: string;
  start_time: string | null;
  end_time: string | null;
  street_address: string | null;
  city_state_zip: string | null;
  access_type: "walk_in" | "appointment" | "both";
  registration_url: string | null;
  special_instructions: string | null;
  contact_info: string | null;
  published: boolean;
  archived: boolean;
};

export const ACCESS_LABELS: Record<FluClinic["access_type"], string> = {
  walk_in: "Walk-ins welcome",
  appointment: "Appointment required",
  both: "Appointments and walk-ins welcome",
};

/** Today's date as YYYY-MM-DD in Eastern time. */
export const todayKeyET = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());

/** Upcoming, published clinics (today onward), soonest first. */
export function useUpcomingFluClinics() {
  return useQuery({
    queryKey: ["flu_clinics", "upcoming"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flu_clinics")
        .select("*")
        .eq("published", true)
        .eq("archived", false)
        .gte("clinic_date", todayKeyET())
        .order("clinic_date", { ascending: true })
        .order("start_time", { ascending: true });
      if (error) throw error;
      return (data ?? []) as FluClinic[];
    },
  });
}

export const formatClinicDate = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

void formatDateKey;
