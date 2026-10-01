import { useEffect } from "react";
import {
  CalendarCheck, Clock, ExternalLink, Info, Leaf, MapPin, Phone, ShieldCheck, Syringe, Users,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { counties } from "@/data/counties";
import { ACCESS_LABELS, formatClinicDate, useUpcomingFluClinics } from "@/hooks/useFluClinics";

/**
 * Permanent public flu page: ecphd.com/flushot. Educational copy lives in the
 * constants below; clinic listings come from the database (Admin → Flu Clinics).
 * Never auto-redirect visitors.
 */
const BOOKING_URL =
  "https://bookings.cloud.microsoft/book/EmployeeFluDrive@gets.onmicrosoft.com/?ismsaljsauthenabled";
const CDC_FLU_URL = "https://www.cdc.gov/flu/";

const WHY_VACCINATE = [
  "Flu vaccination can reduce your risk of getting sick with influenza.",
  "Vaccination can reduce the severity of illness if you do get the flu.",
  "Flu vaccination helps reduce flu-related medical visits and hospitalizations.",
  "Annual vaccination is important because protection decreases over time and circulating flu viruses can change from year to year.",
];

const FLU_SEASON = [
  "Seasonal influenza circulates every year. Flu activity often increases during the fall and winter, but the timing and severity of each flu season can vary.",
  "Because it takes about two weeks after vaccination for the body to develop protection, getting vaccinated before flu is spreading widely in your community can help provide protection during the season.",
];

const STOP_SPREAD = [
  "Get your annual flu vaccination.",
  "Stay home when you are sick.",
  "Cover coughs and sneezes.",
  "Wash your hands frequently.",
  "Avoid touching your eyes, nose and mouth with unwashed hands.",
  "Clean frequently touched surfaces.",
  "Follow healthcare provider guidance if you develop flu symptoms or are at increased risk for complications.",
];

const countyName = (slug: string) =>
  counties.find((c) => c.slug === slug)?.name ?? slug;

const ScheduleButton = ({ id }: { id: string }) => (
  <Button asChild size="lg" className="min-h-14 px-8 text-lg font-semibold">
    <a href={BOOKING_URL} id={id}>
      <CalendarCheck aria-hidden="true" className="mr-2 h-5 w-5" />
      Schedule Your Flu Shot
      <span className="sr-only"> (Microsoft Bookings, external website)</span>
    </a>
  </Button>
);

const Section = ({
  id, title, children, tinted,
}: { id: string; title: string; children: React.ReactNode; tinted?: boolean }) => (
  <section aria-labelledby={id} className={tinted ? "border-y border-border bg-secondary/40" : ""}>
    <div className="container max-w-4xl py-12">
      <h2 id={id} className="mb-5 text-2xl font-bold sm:text-3xl">{title}</h2>
      {children}
    </div>
  </section>
);

const ClinicList = () => {
  const { data, isLoading, isError } = useUpcomingFluClinics();

  if (isLoading) return <p role="status">Loading upcoming flu clinics…</p>;
  if (isError || !data || data.length === 0) {
    return (
      <p role="status" className="rounded-lg border border-border bg-card p-5 font-medium">
        More flu clinics are being added throughout the season. Check back for upcoming
        vaccination opportunities in your county.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2" aria-label="Upcoming flu clinics">
      {data.map((c) => (
        <li key={c.id}>
          <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-bold uppercase tracking-wide">
              {countyName(c.county_slug)} County
            </p>
            <h3 className="mt-1 text-xl font-semibold">{c.name}</h3>
            <dl className="mt-3 space-y-2 text-foreground/90">
              <div className="flex gap-2">
                <dt><CalendarCheck aria-hidden="true" className="mt-0.5 h-4 w-4" /><span className="sr-only">Date</span></dt>
                <dd>{formatClinicDate(c.clinic_date)}</dd>
              </div>
              {(c.start_time || c.end_time) && (
                <div className="flex gap-2">
                  <dt><Clock aria-hidden="true" className="mt-0.5 h-4 w-4" /><span className="sr-only">Time</span></dt>
                  <dd>{[c.start_time, c.end_time].filter(Boolean).join(" – ")}</dd>
                </div>
              )}
              {(c.street_address || c.city_state_zip) && (
                <div className="flex gap-2">
                  <dt><MapPin aria-hidden="true" className="mt-0.5 h-4 w-4" /><span className="sr-only">Address</span></dt>
                  <dd>
                    {c.street_address}
                    {c.street_address && c.city_state_zip && <br />}
                    {c.city_state_zip}
                  </dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt><Info aria-hidden="true" className="mt-0.5 h-4 w-4" /><span className="sr-only">Access</span></dt>
                <dd className="font-semibold">{ACCESS_LABELS[c.access_type]}</dd>
              </div>
              {c.contact_info && (
                <div className="flex gap-2">
                  <dt><Phone aria-hidden="true" className="mt-0.5 h-4 w-4" /><span className="sr-only">Contact</span></dt>
                  <dd>{c.contact_info}</dd>
                </div>
              )}
            </dl>
            {c.special_instructions && (
              <p className="mt-3 rounded bg-muted p-3 text-sm">
                <span className="font-semibold">Special instructions: </span>
                {c.special_instructions}
              </p>
            )}
            {c.registration_url && (
              <div className="mt-4 pt-1">
                <Button asChild variant="outline" className="min-h-11">
                  <a href={c.registration_url} target="_blank" rel="noopener noreferrer">
                    Register for {c.name}
                    <ExternalLink aria-hidden="true" className="ml-2 h-4 w-4" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Button>
              </div>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
};

const FluShot = () => {
  useEffect(() => {
    document.title = "Beat the Flu — Flu Shots & Flu Clinics | East Central Health District";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border bg-secondary/40">
          <div className="container flex flex-col items-center py-16 text-center sm:py-20">
            <div aria-hidden="true" className="mb-6 flex items-center gap-3">
              <Leaf className="h-6 w-6 -rotate-12 text-accent" />
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Syringe className="h-10 w-10" />
              </span>
              <Leaf className="h-6 w-6 rotate-12 text-accent" />
            </div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide">East Central Health District</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Beat the Flu</h1>
            <p className="mt-5 max-w-2xl text-xl font-medium">
              Protect yourself. Protect your family. Protect your community.
            </p>
            <p className="mt-3 max-w-2xl text-lg text-foreground/90">
              Flu vaccination is one of the best ways to reduce your risk of influenza and its
              potentially serious complications.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <ScheduleButton id="schedule-top" />
              <a href="#clinics-heading" className="font-semibold text-primary underline underline-offset-4">
                Find a flu clinic near you
              </a>
            </div>
          </div>
        </section>

        <Section id="clinics-heading" title="Find a Flu Clinic Near You">
          <p className="mb-6 text-lg">
            East Central Health District offers seasonal flu vaccination opportunities throughout
            our 13-county district. Check below for upcoming clinics and special flu vaccination
            events.
          </p>
          <ClinicList />
        </Section>

        <Section id="what-heading" title="What Is the Flu?" tinted>
          <div className="space-y-4 text-lg">
            <p>
              Influenza, commonly called the flu, is a contagious respiratory illness caused by
              influenza viruses. Flu can cause mild to severe illness and, in some cases, can lead
              to hospitalization or serious complications.
            </p>
            <p>
              Flu viruses change over time, which is one reason flu vaccines are updated and
              recommended each year.
            </p>
          </div>
        </Section>

        <Section id="why-heading" title="Why Get Vaccinated?">
          <ul className="space-y-3 text-lg">
            {WHY_VACCINATE.map((t) => (
              <li key={t} className="flex gap-3">
                <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-lg">
            CDC currently recommends annual flu vaccination for most people{" "}
            <strong>6 months of age and older</strong>, with rare exceptions.
          </p>
          <p className="mt-3 rounded-lg border border-border bg-card p-4 font-medium">
            Talk with your healthcare provider if you have questions about which flu vaccine is
            appropriate for you or your child.
          </p>
        </Section>

        <Section id="season-heading" title="Flu Season" tinted>
          <div className="space-y-4 text-lg">
            {FLU_SEASON.map((t) => <p key={t}>{t}</p>)}
          </div>
        </Section>

        <Section id="spread-heading" title="Help Stop the Spread">
          <ul className="grid gap-3 text-lg sm:grid-cols-2">
            {STOP_SPREAD.map((t) => (
              <li key={t} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <Users aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="cdc-heading" title="Learn More About Flu" tinted>
          <p className="mb-5 text-lg">
            For additional information about influenza, vaccination, prevention, symptoms and the
            current flu season, visit the Centers for Disease Control and Prevention.
          </p>
          <Button asChild variant="outline" size="lg" className="min-h-12">
            <a href={CDC_FLU_URL} target="_blank" rel="noopener noreferrer">
              Visit CDC Flu Information
              <ExternalLink aria-hidden="true" className="ml-2 h-4 w-4" />
              <span className="sr-only"> (cdc.gov, opens in a new tab)</span>
            </a>
          </Button>
        </Section>

        <section aria-labelledby="ready-heading">
          <div className="container flex flex-col items-center py-14 text-center">
            <h2 id="ready-heading" className="text-2xl font-bold sm:text-3xl">Ready to schedule?</h2>
            <p className="mt-3 max-w-xl text-foreground/90">
              You will continue to Microsoft Bookings to choose your appointment.
            </p>
            <div className="mt-6"><ScheduleButton id="schedule-bottom" /></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default FluShot;
