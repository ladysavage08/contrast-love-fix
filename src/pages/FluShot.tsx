import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck, Clock, ExternalLink, Info, Languages, Leaf, MapPin, Phone, ShieldCheck, Syringe, Users,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FluAssistant from "@/components/FluAssistant";
import { Button } from "@/components/ui/button";
import { counties } from "@/data/counties";
import { useUpcomingFluClinics, type FluClinic } from "@/hooks/useFluClinics";

/**
 * Permanent public flu page: ecphd.com/flushot (English) and /flushot/es (Spanish).
 * All copy lives in COPY below; clinic listings come from the database
 * (Admin → Flu Clinics). Never auto-redirect visitors.
 */
const BOOKING_URL =
  "https://bookings.cloud.microsoft/book/EmployeeFluDrive@gets.onmicrosoft.com/?ismsaljsauthenabled";

type Lang = "en" | "es";

const COPY = {
  en: {
    docTitle: "Beat the Flu — Flu Shots & Flu Clinics | East Central Health District",
    district: "East Central Health District",
    switchLabel: "Ver esta página en español",
    switchHref: "/flushot/es",
    switchLang: "es",
    h1: "Beat the Flu",
    sub: "Protect yourself. Protect your family. Protect your community.",
    intro: "Flu vaccination is one of the best ways to reduce your risk of influenza and its potentially serious complications.",
    schedule: "Schedule Your Flu Shot",
    scheduleSr: " (Microsoft Bookings, external website)",
    findLink: "Find a flu clinic near you",
    clinicsH: "Find a Flu Clinic Near You",
    clinicsIntro: "East Central Health District offers seasonal flu vaccination opportunities throughout our 13-county district. Check below for upcoming clinics and special flu vaccination events.",
    loading: "Loading upcoming flu clinics…",
    empty: "More flu clinics are being added throughout the season. Check back for upcoming vaccination opportunities in your county.",
    listLabel: "Upcoming flu clinics",
    county: (n: string) => `${n} County`,
    labels: { date: "Date", time: "Time", address: "Address", access: "Access", contact: "Contact" },
    access: { walk_in: "Walk-ins welcome", appointment: "Appointment required", both: "Appointments and walk-ins welcome" },
    special: "Special instructions: ",
    register: (n: string) => `Register for ${n}`,
    newTab: " (opens in a new tab)",
    locale: "en-US",
    whatH: "What Is the Flu?",
    what: [
      "Influenza, commonly called the flu, is a contagious respiratory illness caused by influenza viruses. Flu can cause mild to severe illness and, in some cases, can lead to hospitalization or serious complications.",
      "Flu viruses change over time, which is one reason flu vaccines are updated and recommended each year.",
    ],
    whyH: "Why Get Vaccinated?",
    why: [
      "Flu vaccination can reduce your risk of getting sick with influenza.",
      "Vaccination can reduce the severity of illness if you do get the flu.",
      "Flu vaccination helps reduce flu-related medical visits and hospitalizations.",
      "Annual vaccination is important because protection decreases over time and circulating flu viruses can change from year to year.",
    ],
    cdcRec: ["CDC currently recommends annual flu vaccination for most people ", "6 months of age and older", ", with rare exceptions."],
    provider: "Talk with your healthcare provider if you have questions about which flu vaccine is appropriate for you or your child.",
    seasonH: "Flu Season",
    season: [
      "Seasonal influenza circulates every year. Flu activity often increases during the fall and winter, but the timing and severity of each flu season can vary.",
      "Because it takes about two weeks after vaccination for the body to develop protection, getting vaccinated before flu is spreading widely in your community can help provide protection during the season.",
    ],
    spreadH: "Help Stop the Spread",
    spread: [
      "Get your annual flu vaccination.",
      "Stay home when you are sick.",
      "Cover coughs and sneezes.",
      "Wash your hands frequently.",
      "Avoid touching your eyes, nose and mouth with unwashed hands.",
      "Clean frequently touched surfaces.",
      "Follow healthcare provider guidance if you develop flu symptoms or are at increased risk for complications.",
    ],
    cdcH: "Learn More About Flu",
    cdc: "For additional information about influenza, vaccination, prevention, symptoms and the current flu season, visit the Centers for Disease Control and Prevention.",
    cdcBtn: "Visit CDC Flu Information",
    cdcUrl: "https://www.cdc.gov/flu/",
    cdcSr: " (cdc.gov, opens in a new tab)",
    readyH: "Ready to schedule?",
    ready: "You will continue to Microsoft Bookings to choose your appointment.",
  },
  es: {
    docTitle: "Venza la influenza — Vacunas y clínicas contra la influenza | Distrito de Salud del Centro Este",
    district: "Distrito de Salud del Centro Este (East Central Health District)",
    switchLabel: "View this page in English",
    switchHref: "/flushot",
    switchLang: "en",
    h1: "Venza la influenza",
    sub: "Protéjase. Proteja a su familia. Proteja a su comunidad.",
    intro: "La vacuna contra la influenza (gripe) es una de las mejores maneras de reducir su riesgo de contraer la influenza y sus complicaciones posiblemente graves.",
    schedule: "Programe su vacuna contra la influenza",
    scheduleSr: " (Microsoft Bookings, sitio web externo)",
    findLink: "Encuentre una clínica cerca de usted",
    clinicsH: "Encuentre una clínica de vacunación cerca de usted",
    clinicsIntro: "El Distrito de Salud del Centro Este ofrece oportunidades de vacunación contra la influenza en sus 13 condados. Consulte abajo las próximas clínicas y eventos especiales de vacunación.",
    loading: "Cargando las próximas clínicas…",
    empty: "Se están agregando más clínicas durante la temporada. Vuelva a consultar para ver las próximas oportunidades de vacunación en su condado.",
    listLabel: "Próximas clínicas de vacunación contra la influenza",
    county: (n: string) => `Condado de ${n}`,
    labels: { date: "Fecha", time: "Hora", address: "Dirección", access: "Acceso", contact: "Contacto" },
    access: { walk_in: "Se atiende sin cita", appointment: "Se requiere cita", both: "Con cita o sin cita" },
    special: "Instrucciones especiales: ",
    register: (n: string) => `Inscríbase para ${n}`,
    newTab: " (se abre en una pestaña nueva)",
    locale: "es-US",
    whatH: "¿Qué es la influenza?",
    what: [
      "La influenza, comúnmente llamada gripe, es una enfermedad respiratoria contagiosa causada por los virus de la influenza. Puede causar enfermedad de leve a grave y, en algunos casos, puede llevar a la hospitalización o a complicaciones graves.",
      "Los virus de la influenza cambian con el tiempo, y esa es una de las razones por las que las vacunas se actualizan y se recomiendan cada año.",
    ],
    whyH: "¿Por qué vacunarse?",
    why: [
      "La vacuna puede reducir su riesgo de enfermarse de influenza.",
      "La vacuna puede reducir la gravedad de la enfermedad si llega a contraer la influenza.",
      "La vacuna ayuda a reducir las consultas médicas y hospitalizaciones relacionadas con la influenza.",
      "Vacunarse cada año es importante porque la protección disminuye con el tiempo y los virus que circulan pueden cambiar de un año a otro.",
    ],
    cdcRec: ["Actualmente, los CDC recomiendan la vacuna anual contra la influenza para la mayoría de las personas ", "de 6 meses de edad en adelante", ", con raras excepciones."],
    provider: "Hable con su proveedor de atención médica si tiene preguntas sobre qué vacuna contra la influenza es la adecuada para usted o su hijo.",
    seasonH: "Temporada de influenza",
    season: [
      "La influenza estacional circula todos los años. La actividad suele aumentar durante el otoño y el invierno, pero el momento y la gravedad de cada temporada pueden variar.",
      "Como el cuerpo tarda unas dos semanas después de la vacuna en desarrollar protección, vacunarse antes de que la influenza se propague ampliamente en su comunidad puede ayudarle a estar protegido durante la temporada.",
    ],
    spreadH: "Ayude a detener la propagación",
    spread: [
      "Vacúnese contra la influenza cada año.",
      "Quédese en casa cuando esté enfermo.",
      "Cúbrase al toser y estornudar.",
      "Lávese las manos con frecuencia.",
      "Evite tocarse los ojos, la nariz y la boca con las manos sin lavar.",
      "Limpie las superficies que se tocan con frecuencia.",
      "Siga las indicaciones de su proveedor de atención médica si presenta síntomas de influenza o tiene mayor riesgo de complicaciones.",
    ],
    cdcH: "Más información sobre la influenza",
    cdc: "Para obtener más información sobre la influenza, la vacunación, la prevención, los síntomas y la temporada actual, visite los Centros para el Control y la Prevención de Enfermedades (CDC).",
    cdcBtn: "Visite la información de los CDC sobre la influenza",
    cdcUrl: "https://www.cdc.gov/flu/es/",
    cdcSr: " (cdc.gov, se abre en una pestaña nueva)",
    readyH: "¿Listo para programar su cita?",
    ready: "Continuará a Microsoft Bookings para elegir su cita. Es posible que la página de citas esté solo en inglés; si necesita ayuda, llame al 706-721-5800.",
  },
} as const;

type Copy = (typeof COPY)[Lang];

const countyName = (slug: string) => counties.find((c) => c.slug === slug)?.name ?? slug;

const formatDate = (key: string, locale: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
};

const ScheduleButton = ({ id, c }: { id: string; c: Copy }) => (
  <Button asChild size="lg" className="h-auto min-h-14 whitespace-normal px-8 py-3 text-lg font-semibold">
    <a href={BOOKING_URL} id={id}>
      <CalendarCheck aria-hidden="true" className="mr-2 h-5 w-5 shrink-0" />
      {c.schedule}
      <span className="sr-only">{c.scheduleSr}</span>
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

const Row = ({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: React.ReactNode }) => (
  <div className="flex gap-2">
    <dt><Icon aria-hidden="true" className="mt-0.5 h-4 w-4" /><span className="sr-only">{label}</span></dt>
    <dd>{children}</dd>
  </div>
);

const ClinicCard = ({ cl, c }: { cl: FluClinic; c: Copy }) => (
  <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
    <p className="text-sm font-bold uppercase tracking-wide">{c.county(countyName(cl.county_slug))}</p>
    <h3 className="mt-1 text-xl font-semibold">{cl.name}</h3>
    <dl className="mt-3 space-y-2 text-foreground/90">
      <Row icon={CalendarCheck} label={c.labels.date}>{formatDate(cl.clinic_date, c.locale)}</Row>
      {(cl.start_time || cl.end_time) && (
        <Row icon={Clock} label={c.labels.time}>{[cl.start_time, cl.end_time].filter(Boolean).join(" – ")}</Row>
      )}
      {(cl.street_address || cl.city_state_zip) && (
        <Row icon={MapPin} label={c.labels.address}>
          {cl.street_address}
          {cl.street_address && cl.city_state_zip && <br />}
          {cl.city_state_zip}
        </Row>
      )}
      <Row icon={Info} label={c.labels.access}><span className="font-semibold">{c.access[cl.access_type]}</span></Row>
      {cl.contact_info && <Row icon={Phone} label={c.labels.contact}>{cl.contact_info}</Row>}
    </dl>
    {cl.special_instructions && (
      <p className="mt-3 rounded bg-muted p-3 text-sm">
        <span className="font-semibold">{c.special}</span>{cl.special_instructions}
      </p>
    )}
    {cl.registration_url && (
      <div className="mt-4 pt-1">
        <Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal">
          <a href={cl.registration_url} target="_blank" rel="noopener noreferrer">
            {c.register(cl.name)}
            <ExternalLink aria-hidden="true" className="ml-2 h-4 w-4" />
            <span className="sr-only">{c.newTab}</span>
          </a>
        </Button>
      </div>
    )}
  </article>
);

const ClinicList = ({ c }: { c: Copy }) => {
  const { data, isLoading, isError } = useUpcomingFluClinics();
  if (isLoading) return <p role="status">{c.loading}</p>;
  if (isError || !data || data.length === 0) {
    return <p role="status" className="rounded-lg border border-border bg-card p-5 font-medium">{c.empty}</p>;
  }
  return (
    <ul className="grid gap-5 md:grid-cols-2" aria-label={c.listLabel}>
      {data.map((cl) => <li key={cl.id}><ClinicCard cl={cl} c={c} /></li>)}
    </ul>
  );
};

const FluShot = ({ lang = "en" }: { lang?: Lang }) => {
  const c = COPY[lang];

  useEffect(() => {
    document.title = c.docTitle;
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => { document.documentElement.lang = prev || "en"; };
  }, [c, lang]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border bg-secondary/40">
          <div className="container flex justify-end pt-4">
            <Link to={c.switchHref} lang={c.switchLang} className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4">
              <Languages aria-hidden="true" className="h-4 w-4" />{c.switchLabel}
            </Link>
          </div>
          <div className="container flex flex-col items-center pb-16 pt-8 text-center sm:pb-20">
            <div aria-hidden="true" className="mb-6 flex items-center gap-3">
              <Leaf className="h-6 w-6 -rotate-12 text-primary" />
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Syringe className="h-10 w-10" />
              </span>
              <Leaf className="h-6 w-6 rotate-12 text-primary" />
            </div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide">{c.district}</p>
            <h1 className="text-4xl font-bold sm:text-5xl">{c.h1}</h1>
            <p className="mt-5 max-w-2xl text-xl font-medium">{c.sub}</p>
            <p className="mt-3 max-w-2xl text-lg text-foreground/90">{c.intro}</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <ScheduleButton id="schedule-top" c={c} />
              <a href="#clinics-heading" className="font-semibold text-primary underline underline-offset-4">{c.findLink}</a>
            </div>
          </div>
        </section>

        <Section id="clinics-heading" title={c.clinicsH}>
          <p className="mb-6 text-lg">{c.clinicsIntro}</p>
          <ClinicList c={c} />
        </Section>

        <Section id="what-heading" title={c.whatH} tinted>
          <div className="space-y-4 text-lg">{c.what.map((t) => <p key={t}>{t}</p>)}</div>
        </Section>

        <Section id="why-heading" title={c.whyH}>
          <ul className="space-y-3 text-lg">
            {c.why.map((t) => (
              <li key={t} className="flex gap-3">
                <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-lg">{c.cdcRec[0]}<strong>{c.cdcRec[1]}</strong>{c.cdcRec[2]}</p>
          <p className="mt-3 rounded-lg border border-border bg-card p-4 font-medium">{c.provider}</p>
        </Section>

        <Section id="season-heading" title={c.seasonH} tinted>
          <div className="space-y-4 text-lg">{c.season.map((t) => <p key={t}>{t}</p>)}</div>
        </Section>

        <Section id="spread-heading" title={c.spreadH}>
          <ul className="grid gap-3 text-lg sm:grid-cols-2">
            {c.spread.map((t) => (
              <li key={t} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <Users aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        <FluAssistant key={lang} lang={lang} />

        <Section id="cdc-heading" title={c.cdcH}>
          <p className="mb-5 text-lg">{c.cdc}</p>
          <Button asChild variant="outline" size="lg" className="h-auto min-h-12 whitespace-normal py-3">
            <a href={c.cdcUrl} target="_blank" rel="noopener noreferrer">
              {c.cdcBtn}
              <ExternalLink aria-hidden="true" className="ml-2 h-4 w-4" />
              <span className="sr-only">{c.cdcSr}</span>
            </a>
          </Button>
        </Section>

        <section aria-labelledby="ready-heading" className="border-t border-border bg-secondary/40">
          <div className="container flex flex-col items-center py-14 text-center">
            <h2 id="ready-heading" className="text-2xl font-bold sm:text-3xl">{c.readyH}</h2>
            <p className="mt-3 max-w-xl text-foreground/90">{c.ready}</p>
            <div className="mt-6"><ScheduleButton id="schedule-bottom" c={c} /></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export const FluShotEs = () => <FluShot lang="es" />;

export default FluShot;
