import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Bot-resistant contact form.
 *
 * Anti-bot measures (invisible to real users):
 *  - Two honeypot fields (`website`, `hp_company`) hidden from sight + AT
 *  - Time-trap: the server rejects submissions that arrive < 3s after render
 *
 * Server-side validation also runs in the `submit-contact` edge function;
 * client validation here is purely UX.
 */

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address.")
    .max(254, "Email is too long."),
  phone: z.string().trim().max(40, "Phone is too long.").optional().or(z.literal("")),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(200, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Please include at least 10 characters.")
    .max(5000, "Message is too long."),
});

type FormState = z.infer<typeof ContactSchema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactForm = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const startedAtRef = useRef<number>(Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  // Reset start time on mount (covers HMR & navigation)
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.focus();
    }
  }, [status]);

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const parsed = ContactSchema.safeParse(form);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      setStatus("error");
      setErrorMsg("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");

    // Honeypot values from the form's hidden fields
    const formEl = e.currentTarget;
    const website = (formEl.elements.namedItem("website") as HTMLInputElement)?.value ?? "";
    const hp_company =
      (formEl.elements.namedItem("hp_company") as HTMLInputElement)?.value ?? "";

    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: {
          ...parsed.data,
          website,
          hp_company,
          started_at: startedAtRef.current,
        },
      });

      if (error) {
        throw new Error(error.message || "Submission failed.");
      }

      const result = data as
        | { ok: true }
        | { ok: false; error?: string; fieldErrors?: FieldErrors };

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setStatus("error");
        setErrorMsg(result.error || "Please review the form and try again.");
        return;
      }

      setStatus("success");
      setForm(initialForm);
      startedAtRef.current = Date.now();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or call 706-721-5800.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-lg border border-border bg-background p-6 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 text-primary"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-lg font-semibold">Message sent</h3>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">
              Thank you for reaching out. A member of our team will respond
              during business hours. For urgent matters, please call{" "}
              <a
                href="tel:17067215800"
                className="font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                706-721-5800
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 inline-flex items-center justify-center rounded border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full rounded border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary md:text-sm";
  const labelBase = "block text-sm font-medium text-foreground";
  const errorTextBase = "mt-1 text-sm text-destructive";

  const fieldError = (key: keyof FormState) =>
    errors[key] ? (
      <p id={`${key}-error`} className={errorTextBase}>
        {errors[key]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={errorMsg ? "form-error" : undefined}
      className="space-y-5"
    >
      {/* ===== Honeypot fields (hidden from sighted users + assistive tech) ===== */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
        <label htmlFor="hp_company">Company (leave blank)</label>
        <input
          id="hp_company"
          name="hp_company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelBase}>
            Name <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputBase}
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor="email" className={labelBase}>
            Email <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputBase}
          />
          {fieldError("email")}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelBase}>
            Phone <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputBase}
          />
          {fieldError("phone")}
        </div>

        <div>
          <label htmlFor="subject" className={labelBase}>
            Subject <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={form.subject}
            onChange={update("subject")}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            className={inputBase}
          />
          {fieldError("subject")}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelBase}>
          Message <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={update("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={inputBase}
        />
        {fieldError("message")}
      </div>

      {status === "error" && errorMsg && (
        <div
          id="form-error"
          role="alert"
          className="flex items-start gap-2 rounded border border-destructive/40 bg-background p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        By submitting this form, you agree to be contacted regarding your
        inquiry. We will not share your information.
        <span className="sr-only"> Required fields are marked with an asterisk.</span>
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
