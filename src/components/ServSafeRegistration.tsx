import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import formAsset from "@/assets/2027-servsafe-registration-form.pdf.asset.json";

// Pair does not serve Lovable's asset endpoint; use the hosted asset origin.
const formUrl = new URL(formAsset.url, "https://contrast-love-fix.lovable.app").href;

export default function ServSafeRegistration() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  async function downloadForm() {
    setDownloading(true);
    setError("");
    try {
      const response = await fetch(formUrl);
      if (!response.ok) throw new Error("Download failed");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = "2027-servsafe-registration-form.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError("The download could not be completed. Open the printable PDF below to save a copy.");
    } finally {
      setDownloading(false);
    }
  }
  return (
    <section aria-labelledby="servsafe-form-heading">
      <h2 id="servsafe-form-heading" className="text-2xl font-semibold">2027 ServSafe Registration Form</h2>
      <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
      <h3 className="mt-5 text-xl font-semibold">2027 ServSafe Food Protection Manager Certification</h3>
      <p className="mt-3 leading-relaxed">Register for an upcoming ServSafe certification class through East Central Health District.</p>
      <dl className="mt-5 space-y-3">
        {[
          ["Class Dates", "January–November 2027"],
          ["Class Time", "9:00 AM – 4:30 PM"],
          ["Class Location", "1916 North Leg Road, Building D, Augusta, GA 30909"],
          ["Registration Location", "1916 North Leg Road, Building K, Augusta, GA 30909"],
        ].map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd>{value}</dd></div>)}
        <div><dt className="font-semibold">Phone</dt><dd><a href="tel:7066674234" className="text-primary underline underline-offset-2">(706) 667-4234</a></dd></div>
        <div><dt className="font-semibold">Email</dt><dd><a href="mailto:dph6-eh@dph.ga.gov" className="text-primary underline underline-offset-2">dph6-eh@dph.ga.gov</a></dd></div>
      </dl>
      <p className="mt-5 font-semibold">Registration is complete when your registration form and required fee have been received by our office.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onClick={downloadForm} disabled={downloading} className="h-auto min-h-11 whitespace-normal bg-brand text-brand-foreground hover:bg-brand-hover">
          <Download aria-hidden="true" />{downloading ? "Downloading…" : "Download Registration Form (PDF)"}
        </Button>
        <Button variant="outline" asChild className="h-auto min-h-11 whitespace-normal">
          <a href={formUrl} target="_blank" rel="noopener noreferrer"><Printer aria-hidden="true" />Print Registration Form<span className="sr-only"> (PDF opens in a new tab)</span></a>
        </Button>
      </div>
      {error && <p role="alert" className="mt-3 text-destructive">{error}</p>}
    </section>
  );
}