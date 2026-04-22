import { Phone } from "lucide-react";
import WegoLayout from "@/components/wego/WegoLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Accessible FAQ — Radix accordion handles keyboard nav and aria-expanded. */
const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What services are offered?",
    a: "Physicals, adult vaccines, blood pressure checks, cholesterol and A1C screenings, diabetes management, WIC referrals, well-child checks, sexual health services, and family planning. See the Services page for full details.",
  },
  {
    q: "Do I need insurance?",
    a: "No. Services are available regardless of insurance status. If you do have insurance, please bring your card so we can update your records.",
  },
  {
    q: "What should I bring?",
    a: "Bring a photo ID, your insurance card if you have one, and any current medication information. For well-child visits, please bring your child's immunization record if available.",
  },
  {
    q: "Is it accessible?",
    a: "Yes. The Mobile Health Clinic is wheelchair accessible. If you need any specific accommodations for your visit, please call 1-877-884-WEGO (9346) ahead of time and we'll make arrangements.",
  },
  {
    q: "How do I find the next stop?",
    a: "Visit the Schedule page for a list of upcoming community stops. You can also call 1-877-884-WEGO (9346) to confirm dates, times, and locations.",
  },
  {
    q: "Can children be seen?",
    a: "Yes. We offer well-child checks, immunizations, and other age-appropriate services for children. A parent or guardian must accompany any child under 18.",
  },
];

const WegoFaq = () => {
  return (
    <WegoLayout breadcrumb={[{ label: "FAQ" }]}>
      <div className="container py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Answers to the most common questions about the Mobile Health Clinic.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <section aria-label="FAQ list">
            <Accordion type="multiple" className="border-y border-border">
              {FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold text-primary hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-foreground/90">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <p className="mt-6 text-sm text-muted-foreground">
              Have a question that isn't answered here? Call{" "}
              <a
                href="tel:18778849346"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                1-877-884-WEGO (9346)
              </a>
              .
            </p>
          </section>

          <aside aria-label="Sidebar" className="space-y-6">
            <section
              aria-labelledby="call-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="call-heading" className="text-xl font-semibold">
                Still Have Questions?
              </h2>
              <a
                href="tel:18778849346"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                1-877-884-WEGO
              </a>
            </section>
          </aside>
        </div>
      </div>
    </WegoLayout>
  );
};

export default WegoFaq;
