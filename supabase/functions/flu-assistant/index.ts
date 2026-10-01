// Public flu-shot question helper. Answers ONLY from approved ECHD flu content
// below plus live published clinic listings, and points visitors to scheduling.
import { convertToModelMessages, type UIMessage } from "npm:ai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createResponsesCall } from "../_shared/responses.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const BOOKING_URL =
  "https://bookings.cloud.microsoft/book/EmployeeFluDrive@gets.onmicrosoft.com/?ismsaljsauthenabled";

const APPROVED_CONTENT = `
APPROVED EAST CENTRAL HEALTH DISTRICT (ECHD) FLU CONTENT
- Schedule a flu shot online (Microsoft Bookings): ${BOOKING_URL}
- English flu page: /flushot   Spanish flu page: /flushot/es
- ECHD serves 13 Georgia counties: Burke, Columbia, Emanuel, Glascock, Jefferson, Jenkins, Lincoln, McDuffie, Richmond, Screven, Taliaferro, Warren, Wilkes. County health department pages: /counties
- General ECHD phone: 706-721-5800
- What is the flu: Influenza is a contagious respiratory illness caused by influenza viruses. It can cause mild to severe illness and sometimes hospitalization or serious complications. Flu viruses change over time, which is one reason vaccines are updated and recommended each year.
- Why vaccinate: lowers risk of getting sick; can reduce severity if you do get flu; helps reduce flu-related medical visits and hospitalizations; protection decreases over time and viruses change, so vaccinate every year.
- CDC currently recommends annual flu vaccination for most people 6 months of age and older, with rare exceptions.
- Flu season: flu circulates every year, often increasing in fall and winter; timing and severity vary. It takes about two weeks after vaccination to develop protection, so get vaccinated before flu spreads widely.
- Stop the spread: get vaccinated yearly; stay home when sick; cover coughs and sneezes; wash hands often; avoid touching eyes, nose and mouth with unwashed hands; clean frequently touched surfaces; follow healthcare provider guidance if you have symptoms or higher risk.
- More information: CDC flu site https://www.cdc.gov/flu/
`;

const rules = (lang: "en" | "es", clinics: string) => `You are the ECHD flu-shot page helper.
Answer ONLY using the approved content and clinic listings below. If the answer is not there, say you don't have that information and suggest calling 706-721-5800 or visiting https://www.cdc.gov/flu/.
Never give individual medical advice, diagnose, or say whether a specific person should or should not get a vaccine; tell them to talk with their healthcare provider.
Never invent clinic dates, locations, prices, insurance details, or vaccine types.
Keep answers short (under 120 words), plain language, using markdown lists when helpful.
When relevant, end by pointing the visitor to schedule: [Schedule your flu shot](${BOOKING_URL}).
If someone describes an emergency, tell them to call 911.
Reply in ${lang === "es" ? "Spanish, using the formal \"usted\" form" : "English"} unless the visitor clearly writes in another language.

${APPROVED_CONTENT}

UPCOMING PUBLISHED FLU CLINICS:
${clinics || "None currently listed. More clinics are being added throughout the season."}`;

async function loadClinics(): Promise<string> {
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
    const { data } = await sb.from("flu_clinics").select("*")
      .eq("published", true).eq("archived", false).gte("clinic_date", today)
      .order("clinic_date").limit(60);
    return (data ?? []).map((c) =>
      `- ${c.county_slug} County | ${c.name} | ${c.clinic_date} | ${[c.start_time, c.end_time].filter(Boolean).join("-")} | ${[c.street_address, c.city_state_zip].filter(Boolean).join(", ")} | ${c.access_type} | ${c.registration_url ?? ""} | ${c.special_instructions ?? ""} | ${c.contact_info ?? ""}`
    ).join("\n");
  } catch {
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "The question helper is not configured." }, { status: 500, headers: corsHeaders });
  }

  let body: { messages?: UIMessage[]; lang?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400, headers: corsHeaders });
  }
  const lang = body.lang === "es" ? "es" : "en";
  // Keep only the last 12 turns and cap text length to limit abuse.
  const ui = (body.messages ?? []).slice(-12).map((m) => ({
    ...m,
    parts: (m.parts ?? []).filter((p) => p.type === "text").map((p) => ({
      ...p,
      text: String((p as { text: string }).text).slice(0, 1000),
    })),
  })) as UIMessage[];

  const clinics = await loadClinics();
  const messages = await convertToModelMessages(ui);

  try {
    const call = createResponsesCall(req, { baseURL: GATEWAY, apiKey, model: MODEL }, messages, rules(lang, clinics));
    const res = await call.response();
    const headers = new Headers(res.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
    return new Response(res.body, { status: res.status, headers });
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode ?? 500;
    return Response.json({ error: "The helper is unavailable right now. Please call 706-721-5800." }, { status, headers: corsHeaders });
  }
});
