import { useEffect } from "react";
import { AlertTriangle, Phone, ExternalLink } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const hotlineItemsEn = [
  "Anonymous and confidential",
  "Available 24 hours a day, seven days a week",
  "Able to provide help, referral to services, training, and general information",
  "Accessible in 170 languages",
  "Operated by a nonprofit, nongovernmental organization",
  "Toll free",
];

const hotlineItemsEs = [
  "Es anónima y confidencial",
  "Está disponible las 24 horas del día, los 7 días de la semana",
  "Puede ofrecer asistencia, recomendación de servicios, capacitación e información general",
  "Es accesible en 170 idiomas",
  "Es operada por una organización no gubernamental, sin fines de lucro",
  "Es un número de llamada gratuita",
];

const HumanTraffickingNotice = () => {
  useEffect(() => {
    document.title = "Human Trafficking Notice | East Central Health District";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        "Human Trafficking Notice posted in compliance with O.C.G.A. § 16-5-47, including the National Human Trafficking Hotline and the Statewide Georgia Hotline for Human Trafficking.",
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main" className="container py-10 md:py-12">
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold md:text-4xl">Human Trafficking Notice</h1>
            <p className="text-base leading-relaxed text-foreground">
              This notice is provided in compliance with O.C.G.A. § 16-5-47.
            </p>
          </header>

          {/* Emergency / help section — first thing after the heading on mobile */}
          <section
            aria-labelledby="get-help-heading"
            className="rounded-lg border-2 border-destructive bg-destructive/10 p-5 md:p-6"
          >
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-destructive">
              <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span>Important: Get Help Now</span>
            </p>
            <h2 id="get-help-heading" className="mt-3 text-xl font-bold md:text-2xl">
              Are you or someone you know being sold for sex or made/forced to work for little or no
              pay and cannot leave?
            </h2>
            <p className="mt-3 text-base font-semibold text-foreground">For help, contact:</p>

            <ul className="mt-4 space-y-4">
              <li className="rounded-md border border-border bg-background p-4">
                <p className="font-semibold text-foreground">National Human Trafficking Hotline</p>
                <a
                  href="tel:18883737888"
                  aria-label="Call the National Human Trafficking Hotline at 1-888-373-7888"
                  className="mt-1 inline-flex min-h-11 items-center gap-2 text-lg font-bold text-primary underline underline-offset-4"
                >
                  <Phone aria-hidden="true" className="h-5 w-5 shrink-0" />
                  1-888-373-7888
                </a>
              </li>
              <li className="rounded-md border border-border bg-background p-4">
                <p className="font-semibold text-foreground">
                  Statewide Georgia Hotline for Human Trafficking
                </p>
                <a
                  href="tel:18663634842"
                  aria-label="Call the Statewide Georgia Hotline for Human Trafficking at 1-866-363-4842"
                  className="mt-1 inline-flex min-h-11 items-center gap-2 text-lg font-bold text-primary underline underline-offset-4"
                >
                  <Phone aria-hidden="true" className="h-5 w-5 shrink-0" />
                  1-866-ENDHTGA (1-866-363-4842)
                </a>
              </li>
            </ul>

            <p className="mt-4 text-base font-bold text-foreground">
              If someone is in immediate danger, call{" "}
              <a
                href="tel:911"
                aria-label="Call 9 1 1 for emergencies"
                className="text-primary underline underline-offset-4"
              >
                911
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="hotline-info-heading" className="space-y-3">
            <h2 id="hotline-info-heading" className="text-2xl font-semibold">
              Hotline Information
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              All victims of slavery and human trafficking have rights and are protected by
              international, federal, and state law. The hotline is:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground marker:text-primary">
              {hotlineItemsEn.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="spanish-heading" lang="es" className="space-y-3 border-t border-border pt-8">
            <h2 id="spanish-heading" className="text-2xl font-semibold">
              Aviso Sobre el Tráfico de Personas
            </h2>
            <h3 className="text-xl font-bold">
              ¿Usted o alguien a quien conoce está siendo vendido por sexo u obligado/forzado a
              trabajar por poca o ninguna paga y no puede escapar?
            </h3>
            <p className="text-base leading-relaxed text-foreground">
              Llame al Centro Nacional de Recursos Contra el Tráfico de Personas (National Human
              Trafficking Resource Center) al{" "}
              <a
                href="tel:18883737888"
                aria-label="Llame al Centro Nacional de Recursos Contra el Tráfico de Personas al 1-888-373-7888"
                className="font-bold text-primary underline underline-offset-4"
              >
                1-888-373-7888
              </a>
              , o a la Línea de Asistencia Telefónica Contra el Tráfico de Personas de Georgia
              (Georgia Hotline for Human Trafficking) al 1-866-ENDHTGA (
              <a
                href="tel:18663634842"
                aria-label="Llame a la Línea de Asistencia Telefónica Contra el Tráfico de Personas de Georgia al 1-866-363-4842"
                className="font-bold text-primary underline underline-offset-4"
              >
                1-866-363-4842
              </a>
              ) para obtener ayuda.
            </p>
            <p className="text-base leading-relaxed text-foreground">
              Todas las víctimas de la esclavitud y el tráfico de personas tienen derechos y están
              protegidas por las leyes internacionales, federales y estatales. La línea de
              asistencia telefónica:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground marker:text-primary">
              {hotlineItemsEs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-base leading-relaxed text-foreground">
              Si alguien está en peligro inmediato, llame al{" "}
              <a
                href="tel:911"
                aria-label="Llame al 9 1 1 en caso de emergencia"
                className="font-bold text-primary underline underline-offset-4"
              >
                911
              </a>
              .
            </p>
          </section>

          <section
            aria-labelledby="resources-heading"
            className="space-y-3 border-t border-border pt-8"
          >
            <h2 id="resources-heading" className="text-2xl font-semibold">
              Human Trafficking Resources
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground marker:text-primary">
              <li>
                <a
                  href="https://gbi.georgia.gov/human-trafficking-notice"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Georgia Bureau of Investigation Human Trafficking Notice (opens in a new tab, leaves the ECHD website)"
                  className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2"
                >
                  Georgia Bureau of Investigation Human Trafficking Notice
                  <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-normal text-muted-foreground">
                    (opens in a new tab)
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://law.georgia.gov/human-trafficking"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Georgia Attorney General Human Trafficking Resources (opens in a new tab, leaves the ECHD website)"
                  className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2"
                >
                  Georgia Attorney General Human Trafficking Resources
                  <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-normal text-muted-foreground">
                    (opens in a new tab)
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://humantraffickinghotline.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="National Human Trafficking Hotline website (opens in a new tab, leaves the ECHD website)"
                  className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2"
                >
                  National Human Trafficking Hotline
                  <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-normal text-muted-foreground">
                    (opens in a new tab)
                  </span>
                </a>
              </li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Links marked “opens in a new tab” take you to websites outside the East Central Health
              District website.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
};

export default HumanTraffickingNotice;
