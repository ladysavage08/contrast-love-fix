import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  HandHeart,
  HeartHandshake,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  TestTube2,
  Users,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { counties } from "@/data/counties";

const CONDOM_FORM_URL = "https://forms.cloud.microsoft/g/5avd7qg7TA";
const HIV_TEST_KIT_URL = "https://sendss.state.ga.us/ords/sendss/!hivcasemanagement.pretestsurvey1";
const richmond = counties.find((county) => county.slug === "richmond");
const testingSites = (richmond?.clinicSites ?? []).filter((site) =>
  ["Laney Walker Clinic", "South Augusta Clinic"].includes(site.name),
);

const quickActions = [
  { label: "Get Tested", href: "#testing", icon: TestTube2 },
  { label: "Get FREE Condoms", href: "#condoms", icon: ShieldCheck },
  { label: "Get a FREE HIV Test Kit", href: "#self-test-kits", icon: PackageCheck },
  { label: "Learn About PrEP", href: "#prep", icon: HandHeart },
  { label: "Get Connected to Care", href: "#linkage-to-care", icon: HeartHandshake },
  { label: "Request HIV Outreach", href: "#outreach", icon: Users },
];

const preventionResources = [
  "HIV prevention education",
  "HIV testing information",
  "Condom education",
  "PrEP education",
  "Risk reduction information",
  "Referrals to additional services",
];

const requestedServices = [
  "HIV education",
  "Prevention resources",
  "Testing information",
  "Condoms",
  "PrEP education",
  "Other outreach support",
];

const HivPrevention = () => {
  useEffect(() => {
    document.title = "HIV Prevention | East Central Health District";
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
          <ol className="container flex flex-wrap items-center gap-1 py-3 text-sm">
            <li><Link to="/" className="text-primary underline-offset-2 hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/programs" className="text-primary underline-offset-2 hover:underline">Programs &amp; Services</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">HIV Prevention</li>
          </ol>
        </nav>

        <div className="container py-8 md:py-12">
          <header className="max-w-4xl border-b border-border pb-8">
            <div aria-hidden="true" className="mb-3 h-1 w-20 bg-accent-gold" />
            <h1 className="text-3xl font-bold md:text-4xl">HIV Prevention</h1>
            <p className="mt-3 text-xl font-semibold text-primary">Free HIV Testing, Prevention Resources &amp; Support</p>
            <div className="mt-5 space-y-3 text-base leading-relaxed text-foreground/90 md:text-lg">
              <p>The East Central Health District HIV Prevention Program works to prevent new HIV infections, increase access to testing and prevention resources, and connect individuals with care and support.</p>
              <p>Our prevention services are confidential, accessible, and available throughout the East Central Health District.</p>
            </div>
          </header>

          <nav aria-label="HIV Prevention quick actions" className="py-8">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a href={href} className="group flex h-full min-h-20 items-center gap-3 rounded-lg border border-border bg-card p-4 font-semibold text-primary hover:border-primary hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            <section id="testing" aria-labelledby="testing-heading" className="scroll-mt-6">
              <h2 id="testing-heading" className="text-2xl font-bold md:text-3xl">FREE Walk-In HIV Testing</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-foreground/90">Confidential walk-in HIV testing is available at Laney Walker Clinic and South Augusta Clinic. Please call before visiting to confirm testing availability.</p>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {testingSites.map((site) => (
                  <article key={site.name} className="rounded-lg border border-t-4 border-border border-t-accent-gold bg-card p-6">
                    <h3 className="text-xl font-semibold">{site.name}</h3>
                    <address className="mt-3 not-italic leading-relaxed">
                      {site.addressLines.map((line) => <span key={line} className="block">{line}</span>)}
                    </address>
                    <p className="mt-3"><strong>Hours beginning October 1:</strong><br />Monday–Thursday: 8:00 AM–5:00 PM<br />Friday: 8:00 AM–2:00 PM</p>
                    {site.phone && site.phoneHref && (
                      <a href={site.phoneHref} className="mt-3 inline-flex items-center gap-2 font-medium text-primary underline underline-offset-2">
                        <Phone className="h-4 w-4" aria-hidden="true" />Call {site.phone}
                      </a>
                    )}
                  </article>
                ))}
              </div>
              <Button asChild size="lg" className="mt-6"><Link to="/counties/richmond"><MapPin aria-hidden="true" />Find HIV Testing</Link></Button>
            </section>

            <section id="condoms" aria-labelledby="condoms-heading" className="scroll-mt-6 rounded-lg border border-border bg-muted/40 p-6 md:p-8">
              <h2 id="condoms-heading" className="text-2xl font-bold">FREE Condoms</h2>
              <p className="mt-3 max-w-3xl leading-relaxed">Free condoms are available at all ECHD Health Departments. If you live within the East Central Health District, you can also use our confidential form to request free condoms delivered discreetly by mail.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" variant="outline"><Link to="/counties"><MapPin aria-hidden="true" />Find a Health Department</Link></Button>
                <Button asChild size="lg"><a href={CONDOM_FORM_URL} target="_blank" rel="noopener noreferrer" aria-label="Request FREE Condoms by Mail (opens in a new tab)"><PackageCheck aria-hidden="true" />Request FREE Condoms by Mail<ExternalLink aria-hidden="true" /></a></Button>
              </div>
            </section>

            <section id="self-test-kits" aria-labelledby="kits-heading" className="scroll-mt-6">
              <h2 id="kits-heading" className="text-2xl font-bold">FREE HIV Self-Test Kits</h2>
              <p className="mt-3 max-w-3xl leading-relaxed">Free HIV self-test kits are available to eligible individuals. Test kits may be requested through the State of Georgia's HIV testing program.</p>
              <Button asChild size="lg" className="mt-5"><a href={HIV_TEST_KIT_URL} target="_blank" rel="noopener noreferrer" aria-label="Request a FREE HIV Test Kit (opens in a new tab)"><PackageCheck aria-hidden="true" />Request a FREE HIV Test Kit<ExternalLink aria-hidden="true" /></a></Button>
            </section>

            <section id="prep" aria-labelledby="prep-heading" className="scroll-mt-6">
              <h2 id="prep-heading" className="text-2xl font-bold">PrEP Education &amp; Referrals</h2>
              <div className="mt-3 max-w-3xl space-y-3 leading-relaxed">
                <p>PrEP can help prevent HIV before exposure.</p>
                <p>Our HIV Prevention team can provide education about PrEP, answer questions, and connect individuals with providers and resources.</p>
              </div>
              <Button type="button" size="lg" className="mt-5" disabled aria-describedby="prep-status">Learn About PrEP / Request a PrEP Referral</Button>
              <p id="prep-status" role="status" className="mt-3 text-sm font-medium text-muted-foreground">Online PrEP referral requests are coming soon.</p>
            </section>

            <section id="linkage-to-care" aria-labelledby="care-heading" className="scroll-mt-6 rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 id="care-heading" className="text-2xl font-bold">Linkage to Care</h2>
              <p className="mt-3 max-w-3xl leading-relaxed">Need help getting connected to HIV care?</p>
              <p className="mt-3 max-w-3xl leading-relaxed">If you have received a positive HIV test, are living with HIV and are not currently connected to medical care, or need help finding appropriate HIV services, our Linkage Coordinator can help connect you with care and available resources.</p>
              <div className="mt-5 rounded-lg border border-border bg-muted/40 p-5">
                <p className="text-lg font-semibold">Morgan Pennymon</p>
                <p className="text-sm text-muted-foreground">Linkage Coordinator</p>
                <a href="tel:7067215955" className="mt-2 inline-flex items-center gap-2 font-medium text-primary underline underline-offset-2"><Phone className="h-4 w-4" aria-hidden="true" />706-721-5955</a>
              </div>
              <p className="mt-4 max-w-3xl leading-relaxed">Project Impact Augusta provides ongoing HIV care connections, case management, housing assistance, and other support for individuals living with HIV.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg"><a href="tel:7067215955" aria-label="Call the Linkage Coordinator at 706-721-5955"><Phone aria-hidden="true" />Call the Linkage Coordinator</a></Button>
                <Button asChild size="lg" variant="outline"><Link to="/programs/project-impact-augusta"><HeartHandshake aria-hidden="true" />Get Connected to Care</Link></Button>
              </div>
            </section>

            <section aria-labelledby="education-heading">
              <h2 id="education-heading" className="text-2xl font-bold">HIV Education &amp; Prevention Resources</h2>
              <p className="mt-3 max-w-3xl leading-relaxed">Our team offers welcoming, confidential information and connections based on each person’s needs.</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {preventionResources.map((resource) => <li key={resource} className="flex items-start gap-2 rounded-lg border border-border bg-card p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>{resource}</span></li>)}
              </ul>
            </section>

            <section id="outreach" aria-labelledby="outreach-heading" className="scroll-mt-6 border-t border-border pt-10">
              <h2 id="outreach-heading" className="text-2xl font-bold md:text-3xl">Bring HIV Prevention to Your Event</h2>
              <p className="mt-3 max-w-3xl leading-relaxed">Planning a community event, health fair, resource fair, or outreach activity? The East Central Health District HIV Prevention team may be available to provide HIV education, prevention resources, testing information, condoms, and other outreach services.</p>
              <div role="status" className="mt-5 rounded-lg border border-accent-gold bg-muted/40 p-4 font-medium">Online outreach requests are coming soon. The form fields below are shown so organizations can see what information will be requested. To request outreach by phone, call <a href="tel:7067215957" className="font-semibold text-primary underline underline-offset-2">(706) 721-5957</a>.</div>

              <form aria-labelledby="outreach-form-heading" className="mt-6 rounded-lg border border-border bg-card p-6 md:p-8" onSubmit={(event) => event.preventDefault()}>
                <h3 id="outreach-form-heading" className="text-xl font-semibold">HIV Prevention Outreach Event Request Form</h3>
                <p id="required-note" className="mt-2 text-sm text-muted-foreground">All fields marked “required” must be completed when online submissions become available.</p>
                <fieldset disabled aria-describedby="required-note outreach-disabled" className="mt-6 space-y-6">
                  <legend className="sr-only">Outreach event request details</legend>
                  <div className="grid gap-5 md:grid-cols-2">
                    {[
                      ["organization", "Organization", "text"],
                      ["contact-name", "Contact name", "text"],
                      ["email", "Email", "email"],
                      ["phone", "Phone", "tel"],
                      ["event-name", "Event name", "text"],
                      ["event-date", "Event date", "date"],
                      ["start-time", "Event start time", "time"],
                      ["end-time", "Event end time", "time"],
                      ["event-location", "Event location or address", "text"],
                      ["attendance", "Estimated attendance", "number"],
                      ["audience", "Audience or community served", "text"],
                    ].map(([id, label, type]) => (
                      <div key={id} className={id === "event-location" || id === "audience" ? "md:col-span-2" : undefined}>
                        <label htmlFor={`outreach-${id}`} className="block text-sm font-medium">{label} <span className="text-destructive">(required)</span></label>
                        <Input id={`outreach-${id}`} name={id} type={type} required className="mt-2" />
                      </div>
                    ))}
                  </div>
                  <fieldset>
                    <legend className="text-sm font-medium">Services or resources being requested <span className="text-destructive">(required)</span></legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {requestedServices.map((service) => {
                        const id = `service-${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                        return <div key={service} className="flex items-center gap-3"><Checkbox id={id} name="services" value={service} /><label htmlFor={id}>{service}</label></div>;
                      })}
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="outreach-comments" className="block text-sm font-medium">Additional information or comments</label>
                    <Textarea id="outreach-comments" name="comments" rows={5} className="mt-2" />
                  </div>
                  <Button type="submit" size="lg" disabled><CalendarDays aria-hidden="true" />Request HIV Outreach</Button>
                </fieldset>
                <p id="outreach-disabled" className="mt-4 text-sm font-medium text-muted-foreground">Submissions are not yet available. A recipient address must be connected before this form can be sent.</p>
              </form>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HivPrevention;
