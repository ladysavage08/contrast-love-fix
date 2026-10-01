import { useEffect } from "react";
import { CalendarCheck, ShieldCheck, Syringe, Users } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

/**
 * Public short URL: ecphd.com/flushot. Change only BOOKING_URL to point
 * printed QR codes/flyers at a new destination. Never auto-redirect.
 */
const BOOKING_URL =
  "https://bookings.cloud.microsoft/book/EmployeeFluDrive@gets.onmicrosoft.com/?ismsaljsauthenabled";

const ScheduleButton = ({ id }: { id: string }) => (
  <Button asChild size="lg" className="min-h-14 px-8 text-lg font-semibold">
    <a href={BOOKING_URL} id={id}>
      <CalendarCheck aria-hidden="true" className="mr-2 h-5 w-5" />
      Schedule Your Flu Shot
      <span className="sr-only"> (Microsoft Bookings, external website)</span>
    </a>
  </Button>
);

const FluShot = () => {
  useEffect(() => {
    document.title = "Beat the Flu — Schedule Your Flu Shot | East Central Health District";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border bg-secondary/40">
          <div className="container flex flex-col items-center py-16 text-center sm:py-20">
            <span
              aria-hidden="true"
              className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Syringe className="h-10 w-10" />
            </span>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
              East Central Health District
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">Beat the Flu</h1>
            <p className="mt-5 max-w-2xl text-xl font-medium">
              Protect yourself. Protect your family. Protect your coworkers.
            </p>
            <p className="mt-3 max-w-2xl text-lg text-foreground/90">
              Make getting your flu shot easy. Use the button below to schedule your flu
              vaccination appointment.
            </p>
            <div className="mt-8">
              <ScheduleButton id="schedule-top" />
            </div>
          </div>
        </section>

        <section aria-labelledby="why-heading" className="container py-14">
          <h2 id="why-heading" className="mb-8 text-center text-2xl font-bold">
            Why get a flu shot?
          </h2>
          <ul className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Protect yourself", text: "Lower your chance of getting sick with the flu." },
              { icon: Users, title: "Protect others", text: "Help keep your family and coworkers healthy." },
              { icon: CalendarCheck, title: "Quick and easy", text: "Pick a time that works for you online." },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-lg border border-border bg-card p-6 text-center">
                <Icon aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-foreground/90">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ready-heading" className="border-t border-border bg-secondary/40">
          <div className="container flex flex-col items-center py-14 text-center">
            <h2 id="ready-heading" className="text-2xl font-bold">Ready to schedule?</h2>
            <p className="mt-3 max-w-xl text-foreground/90">
              You will continue to Microsoft Bookings to choose your appointment.
            </p>
            <div className="mt-6">
              <ScheduleButton id="schedule-bottom" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default FluShot;
