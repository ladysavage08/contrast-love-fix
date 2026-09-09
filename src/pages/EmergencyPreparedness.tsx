import { ArrowRight, ExternalLink, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import imgSwabTruck from "@/assets/ep/img_5660.jpg";
import imgSwabCar from "@/assets/ep/7e9a2788.jpg";
import imgSiteSign from "@/assets/ep/7e9a2036.jpg";
import imgShelterPeople from "@/assets/ep/dsc_0119.jpg";
import imgShelterCots from "@/assets/ep/dsc_0141.jpg";
import imgShelterCotsBlue from "@/assets/ep/image33.jpg";
import imgBus from "@/assets/ep/dsc_0150.jpg";
import imgBriefing from "@/assets/ep/dsc_0125.jpg";
import imgStaffGroup from "@/assets/ep/staff_group.jpg";
import imgPpeDriveThrough from "@/assets/ep/ppe_drive_through.jpg";
import imgResponseSite from "@/assets/ep/response_site_vehicles.jpg";
import imgNursesDriveThrough from "@/assets/ep/nurses_drive_through.jpg";
import imgPlanningExercise from "@/assets/ep/planning_exercise.jpg";
import imgKitSupplies from "@/assets/ep/kit_supplies_table.jpg";
import imgPreparednessMaterials from "@/assets/ep/preparedness_materials.jpg";

/**
 * Emergency Preparedness — dedicated program page.
 * Layout mirrors the shared ProgramPage template (breadcrumb, H1 + gold rule,
 * main column + sidebar) so it fits alongside the other program pages.
 */

const galleryImages = [
  {
    src: imgSwabTruck,
    alt: "A public health nurse in a gown, N95 mask, face shield and gloves works at an outdoor drive-through testing site beside a pickup truck.",
    caption: "Public health emergency response and disease control",
  },
  {
    src: imgSwabCar,
    alt: "A masked and gowned nurse collects a nasal swab sample from a driver seated in a vehicle.",
    caption: "Drive-through specimen collection",
  },
  {
    src: imgSiteSign,
    alt: "Vehicles line up under a large white tent at the Richmond County Board of Health, next to a Georgia Department of Public Health East Central Health District sign.",
    caption: "Public health emergency operations site",
  },
  {
    src: imgShelterCots,
    alt: "Rows of empty green cots with folded blankets set up across a high school gymnasium floor before shelter residents arrive.",
    caption: "Shelter set-up before arrivals",
  },
  {
    src: imgShelterPeople,
    alt: "Families rest on cots and gather with volunteers inside a gymnasium being used as an emergency shelter.",
    caption: "Mass care operations in an emergency shelter",
  },
  {
    src: imgShelterCotsBlue,
    alt: "Numbered medical screening stations line the wall of a gymnasium filled with rows of blue cots and pillows.",
    caption: "Medical needs shelter with screening stations",
  },
  {
    src: imgBus,
    alt: "Evacuees carrying bags board a chartered motor coach in a parking lot while school buses and staff assist nearby.",
    caption: "Transportation and evacuation support",
  },
  {
    src: imgBriefing,
    alt: "Public health staff in high-visibility safety vests sit in a classroom for a shelter operations briefing.",
    caption: "Preparedness coordination and staff training",
  },
];

const questions = [
  "How will I receive emergency alerts and warnings?",
  "What is my shelter plan?",
  "What is my evacuation route?",
  "What is our family communications plan?",
  "Do I need to update my emergency preparedness kit?",
  "Have I considered the specific needs of everyone in my household, including children, older adults, people with disabilities and pets?",
];

const kitItems = [
  "Store at least one gallon of water per person per day for several days for drinking and sanitation. A three-day supply equals at least three gallons per person. Store additional water for pets, medical needs, extreme heat, pregnancy, or illness. Water stored in a bathtub should be treated as non-drinking water unless it is kept in a food-safe emergency water-storage container.",
  "Maintain at least a three-day supply of nonperishable food, with a longer supply when possible.",
  "A manual can opener and eating utensils.",
  "Battery-powered or solar-powered flashlights and lanterns. Avoid candles when possible because they can create a fire hazard.",
  "Extra batteries and a portable phone charger or power bank.",
  "A battery-powered, hand-crank or solar NOAA weather radio.",
  "A first aid kit.",
  "Prescription medications and commonly used over-the-counter medications appropriate for your household. Follow label directions and speak with a healthcare professional about individual medical needs.",
  "Personal hygiene items, moist towelettes, garbage bags and plastic ties for sanitation.",
  "Cash in small bills, since electronic payment systems and ATMs may not work during a power outage.",
  "Copies of important documents in a waterproof container, such as identification, insurance policies and medical information.",
  "Blankets or sleeping bags, a change of clothing and sturdy shoes.",
  "Supplies for infants, older adults, people with disabilities and pets.",
];

const alertSystems = [
  {
    name: "CodeRED",
    counties: "Burke, Glascock, Jenkins, McDuffie, Taliaferro and Wilkes counties",
  },
  { name: "Everbridge", counties: "Richmond County" },
  { name: "Hyper-Reach", counties: "Columbia County" },
  { name: "myAlerts", counties: "Emanuel County" },
  { name: "Swift911", counties: "Screven County" },
];

const resources = [
  {
    label: "Ready.gov — build a plan and an emergency kit",
    href: "https://www.ready.gov/",
  },
  {
    label: "Georgia Emergency Management and Homeland Security Agency (GEMA/HS)",
    href: "https://gema.georgia.gov/",
  },
  {
    label: "Georgia Department of Public Health — Emergency Preparedness",
    href: "https://dph.georgia.gov/epidemiology/epidemiology-emergency-preparedness",
  },
  {
    label: "FEMA Integrated Public Alert and Warning System (IPAWS)",
    href: "https://www.fema.gov/emergency-managers/practitioners/integrated-public-alert-warning-system",
  },
  {
    label: "CDC Emergency Preparedness and Response",
    href: "https://emergency.cdc.gov/",
  },
  {
    label: "National Weather Service — Weather Alerts and Forecasts",
    href: "https://www.weather.gov/",
  },
  {
    label: "American Red Cross — Disaster Preparedness",
    href: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html",
  },
];

const externalLinkClass =
  "inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const EmergencyPreparedness = () => {
  const phone = "706-721-5800";
  const phoneHref = `tel:${phone.replace(/[^0-9]/g, "")}`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
          <div className="container py-3 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link
                  to="/"
                  className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to="/programs"
                  className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Programs and Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                Emergency Preparedness
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-6 md:py-10">
          <header className="mb-6 max-w-3xl md:mb-8">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Emergency Preparedness
            </h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 md:text-lg">
              Emergencies and disasters can happen with little or no warning. Planning
              ahead helps you, your family and your community stay safe, healthy and
              connected before, during and after an event.
            </p>
          </header>

          <div className="grid gap-8 md:gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              <section aria-labelledby="role-public-health">
                <h2 id="role-public-health" className="text-2xl font-semibold">
                  The Role of Public Health
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Public health protects the health and safety of the whole community
                  during an emergency. That work includes monitoring and investigating
                  disease, sharing accurate health information, supporting medical
                  needs shelters, coordinating mass vaccination or medication
                  distribution, and helping ensure that food, water and sanitation
                  remain safe. Public health also works to protect people who are most
                  at risk, including children, older adults, people with disabilities
                  and people with chronic health conditions.
                </p>
                <figure className="mt-5">
                  <img
                    src={imgSwabTruck}
                    alt={galleryImages[0].alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full rounded-lg border border-border object-cover"
                  />
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    Public health staff provide testing and disease control services
                    during an emergency response.
                  </figcaption>
                </figure>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <figure>
                    <img
                      src={imgPpeDriveThrough}
                      alt="Public health worker wearing protective equipment assists a community member at a drive-through response site."
                      loading="lazy"
                      decoding="async"
                      width={1400}
                      height={933}
                      className="h-auto w-full rounded-lg border border-border"
                    />
                    <figcaption className="mt-2 text-sm text-muted-foreground">
                      Protecting staff and residents during an infectious disease
                      response.
                    </figcaption>
                  </figure>
                  <figure>
                    <img
                      src={imgResponseSite}
                      alt="Public health staff coordinate vehicles at an emergency response site."
                      loading="lazy"
                      decoding="async"
                      width={1400}
                      height={933}
                      className="h-auto w-full rounded-lg border border-border"
                    />
                    <figcaption className="mt-2 text-sm text-muted-foreground">
                      Traffic flow and site coordination during response operations.
                    </figcaption>
                  </figure>
                </div>
              </section>

              <section aria-labelledby="echd-role">
                <h2 id="echd-role" className="text-2xl font-semibold">
                  East Central Health District&rsquo;s Role
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  The East Central Health District plans, trains and responds alongside
                  county emergency management agencies, GEMA/HS, hospitals, schools,
                  first responders and community partners across our 13 counties. Our
                  preparedness team:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground/90">
                  <li>
                    Maintains and exercises district and county emergency response
                    plans.
                  </li>
                  <li>
                    Trains staff and volunteers, including the Medical Reserve Corps
                    (MRC).
                  </li>
                  <li>
                    Staffs medical needs shelters and supports general population
                    shelters with public health services.
                  </li>
                  <li>
                    Coordinates disease surveillance, epidemiology and outbreak
                    investigation.
                  </li>
                  <li>
                    Supports mass dispensing of vaccines or medications when needed.
                  </li>
                  <li>
                    Shares timely, accurate health and safety information with the
                    public.
                  </li>
                </ul>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <figure>
                    <img
                      src={imgStaffGroup}
                      alt="Public health personnel participate in an emergency preparedness training session."
                      loading="lazy"
                      decoding="async"
                      width={1050}
                      height={1400}
                      className="h-auto w-full rounded-lg border border-border"
                    />
                    <figcaption className="mt-2 text-sm text-muted-foreground">
                      District preparedness staff during a training session.
                    </figcaption>
                  </figure>
                  <figure>
                    <img
                      src={imgPlanningExercise}
                      alt="Emergency preparedness team members participate in a planning exercise."
                      loading="lazy"
                      decoding="async"
                      width={1400}
                      height={1050}
                      className="h-auto w-full rounded-lg border border-border"
                    />
                    <figcaption className="mt-2 text-sm text-muted-foreground">
                      Planning and coordination with community partners.
                    </figcaption>
                  </figure>
                </div>
              </section>

              <section aria-labelledby="community-personal">
                <h2 id="community-personal" className="text-2xl font-semibold">
                  Community and Personal Preparedness
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Preparedness begins at home. Individuals and families who plan ahead
                  recover faster and place less strain on emergency responders. Talk
                  with everyone in your household before an emergency or disaster
                  strikes so each person knows what to do, where to go and how to reach
                  one another.
                </p>
                <div className="mt-5 grid items-start gap-5 sm:grid-cols-2">
                  <figure>
                    <img
                      src={imgNursesDriveThrough}
                      alt="Public health nurses assist a community member during a drive-through response operation."
                      loading="lazy"
                      decoding="async"
                      width={1050}
                      height={1400}
                      className="h-auto w-full rounded-lg border border-border"
                    />
                    <figcaption className="mt-2 text-sm text-muted-foreground">
                      Nurses support residents at a drive-through response site.
                    </figcaption>
                  </figure>
                  <p className="text-base leading-relaxed text-foreground/90">
                    A coordinated community response depends on neighbors, schools,
                    faith communities, employers and local agencies working together
                    with public health. When a mass care or mass casualty event
                    happens, district staff join county partners to shelter residents,
                    meet medical needs and keep the public informed.
                  </p>
                </div>
                <figure className="mt-5">
                  <img
                    src={imgBriefing}
                    alt={galleryImages[7].alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full rounded-lg border border-border object-cover"
                  />
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    District staff take part in shelter operations training.
                  </figcaption>
                </figure>
              </section>

              <section aria-labelledby="questions">
                <h2 id="questions" className="text-2xl font-semibold">
                  Questions to Help You Prepare
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-relaxed text-foreground/90">
                  {questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="kit">
                <h2 id="kit" className="text-2xl font-semibold">
                  Create Your Emergency Kit
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Keep supplies in an easy-to-carry container so your household can
                  shelter in place or evacuate quickly. Check your kit twice a year and
                  replace expired items.
                </p>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-relaxed text-foreground/90">
                  {kitItems.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
                <figure className="mt-6">
                  <img
                    src={imgKitSupplies}
                    alt="Emergency preparedness supplies and educational materials displayed at a community event."
                    loading="lazy"
                    decoding="async"
                    width={1400}
                    height={1050}
                    className="h-auto w-full rounded-lg border border-border"
                  />
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    Sample emergency kit supplies and family preparedness materials.
                  </figcaption>
                </figure>
              </section>

              <section aria-labelledby="stay-informed">
                <h2 id="stay-informed" className="text-2xl font-semibold">
                  Stay Informed if You Lose Power
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Power outages can cut off television, internet and cell service. Plan
                  for more than one way to receive information:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground/90">
                  <li>A battery-powered, hand-crank or solar NOAA weather radio.</li>
                  <li>A car radio, using the vehicle safely and outdoors only.</li>
                  <li>
                    Wireless Emergency Alerts on your mobile phone, kept charged with a
                    power bank.
                  </li>
                  <li>Your county emergency alert system.</li>
                  <li>Text messages, which often work when calls will not.</li>
                </ul>
              </section>

              <section aria-labelledby="county-alerts">
                <h2 id="county-alerts" className="text-2xl font-semibold">
                  County Emergency Alert Systems
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Counties in the East Central Health District use these alert systems.
                  Contact your county emergency management agency to sign up.
                </p>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {alertSystems.map((a) => (
                    <li key={a.name} className="py-3">
                      <span className="font-semibold">{a.name}:</span>{" "}
                      <span className="text-foreground/90">{a.counties}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-base leading-relaxed text-foreground/90">
                  During a power outage, do not rely on only one method to receive
                  emergency notifications. Use multiple reliable sources to help meet
                  the needs of you and your loved ones.
                </p>
              </section>

              <section aria-labelledby="resources">
                <h2 id="resources" className="text-2xl font-semibold">
                  Emergency Preparedness Resources
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {resources.map((r) => (
                    <li key={r.href} className="py-1">
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={externalLinkClass}
                      >
                        {r.label}
                        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <figure className="mt-6">
                  <img
                    src={imgPreparednessMaterials}
                    alt="Emergency preparedness guides, first-aid supplies and severe-weather safety materials displayed at an outreach event."
                    loading="lazy"
                    decoding="async"
                    width={1050}
                    height={1400}
                    className="mx-auto h-auto w-full max-w-md rounded-lg border border-border"
                  />
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    Preparedness guides and supplies shared at a community outreach
                    event.
                  </figcaption>
                </figure>
              </section>

              <section aria-labelledby="gallery">
                <h2 id="gallery" className="text-2xl font-semibold">
                  Emergency Response in Our District
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {galleryImages.slice(1, 7).map((img) => (
                    <li key={img.src}>
                      <figure>
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          decoding="async"
                          className="aspect-video w-full rounded-lg border border-border object-cover"
                        />
                        <figcaption className="mt-2 text-sm text-muted-foreground">
                          {img.caption}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>

              {/* CTA band */}
              <section
                aria-labelledby="cta-heading"
                className="rounded-lg border border-border bg-muted/40 p-6"
              >
                <h2 id="cta-heading" className="text-xl font-semibold">
                  Need help or have a question?
                </h2>
                <p className="mt-2 text-base leading-relaxed text-foreground/90">
                  Our team can answer questions about emergency preparedness, connect
                  you with services, or refer you to the right county health
                  department.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex min-h-11 items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Contact Us
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/counties"
                    className="inline-flex min-h-11 items-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Find a County Office
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>

            <aside aria-label="Sidebar" className="space-y-6">
              <section
                aria-labelledby="contact-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2 id="contact-heading" className="text-xl font-semibold">
                  Contact
                </h2>
                <p className="mt-3 text-sm text-foreground/90">
                  Call the East Central Health District main line and ask to be
                  connected to Emergency Preparedness.
                </p>
                <a
                  href={phoneHref}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {phone}
                </a>
                <p className="mt-4 text-sm text-foreground/90">
                  In a life-threatening emergency, call 911.
                </p>
              </section>

              <section
                aria-labelledby="onthispage"
                className="rounded-lg border border-border p-5"
              >
                <h2 id="onthispage" className="text-xl font-semibold">
                  On This Page
                </h2>
                <ul className="mt-3 space-y-1 text-sm">
                  {[
                    ["The Role of Public Health", "role-public-health"],
                    ["East Central Health District's Role", "echd-role"],
                    ["Community and Personal Preparedness", "community-personal"],
                    ["Questions to Help You Prepare", "questions"],
                    ["Create Your Emergency Kit", "kit"],
                    ["Stay Informed if You Lose Power", "stay-informed"],
                    ["County Emergency Alert Systems", "county-alerts"],
                    ["National Weather Service Alerts", "nws-alerts"],
                    ["Emergency Preparedness Resources", "resources"],
                  ].map(([label, id]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="more-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2 id="more-heading" className="text-xl font-semibold">
                  Browse Programs
                </h2>
                <p className="mt-2 text-sm text-foreground/90">
                  Explore the full list of programs and services offered across the
                  district.
                </p>
                <Link
                  to="/programs"
                  className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  View all programs
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default EmergencyPreparedness;
