import { FormEvent, useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import WegoLayout from "@/components/wego/WegoLayout";
import { toast } from "@/hooks/use-toast";

/**
 * WeGo Contact — accessible form (labels, required indicators, error text)
 * plus reassurance messaging and a prominent call CTA.
 *
 * The form intentionally does not POST anywhere yet. To wire it up to email
 * delivery, replace the onSubmit handler with a call to your backend / form
 * service of choice.
 */
const WegoContact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setError("Please complete the required fields before sending your message.");
      form.reportValidity();
      return;
    }
    setError(null);
    setSubmitting(true);
    // Placeholder — show confirmation. Replace with real submission later.
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Message ready to send",
        description:
          "Connect this form to your email service to deliver messages. For now, please call 1-877-884-WEGO.",
      });
      (e.target as HTMLFormElement).reset();
    }, 400);
  };

  return (
    <WegoLayout breadcrumb={[{ label: "Contact" }]}>
      <div className="container py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Questions about the Mobile Health Clinic? Reach our team by phone
            or send a message and we'll respond during business hours.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <section aria-labelledby="form-heading">
            <h2 id="form-heading" className="text-2xl font-semibold">
              Send a Message
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fields marked with <span aria-hidden="true">*</span> are required.
            </p>

            <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate aria-describedby={error ? "wego-contact-error" : "wego-contact-required"}>
              <p id="wego-contact-required" className="text-sm text-muted-foreground">
                Fields marked with <span aria-hidden="true">*</span> are required.
              </p>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Full name <span aria-hidden="true" className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  aria-required="true"
                  className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-base text-foreground focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email <span aria-hidden="true" className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  aria-required="true"
                  className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-base text-foreground focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground"
                >
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-base text-foreground focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground"
                >
                  How can we help?{" "}
                  <span aria-hidden="true" className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  rows={5}
                  className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-base text-foreground focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>

              {error && (
                <p ref={errorRef} id="wego-contact-error" tabIndex={-1} role="alert" className="text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>

              <p className="text-sm text-muted-foreground">
                Please do not include sensitive medical information in this
                form. For medical questions, call us directly.
              </p>
            </form>
          </section>

          <aside aria-label="Sidebar" className="space-y-6">
            <section
              aria-labelledby="phone-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="phone-heading" className="text-xl font-semibold">
                Call Us
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Toll-free, Monday–Friday during business hours.
              </p>
              <a
                href="tel:18778849346"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                1-877-884-WEGO (9346)
              </a>
            </section>

            <section
              aria-labelledby="email-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="email-heading" className="text-xl font-semibold">
                Email
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A program email address can be added here when available.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </WegoLayout>
  );
};

export default WegoContact;
