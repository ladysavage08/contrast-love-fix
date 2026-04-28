import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useHeroSlides } from "@/hooks/useHeroSlides";

import communityCrowd from "@/assets/slide-community-crowd.jpg";
import mobileClinic from "@/assets/hero-mobile-clinic.jpg";
import immunization from "@/assets/slide-immunization.jpg";

type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Tailwind object-position classes, e.g. "object-center sm:object-right". Keeps focal subject visible across breakpoints. */
  focal?: string;
};

/** Fallback slides used when no admin-managed slides exist or fetch fails. */
const defaultSlides: Slide[] = [
  {
    image: mobileClinic,
    alt: "East Central Public Health District Mobile Health Clinic vehicle with DPH branding and the slogan 'We Go Where You Are!'",
    eyebrow: "Care that comes to you",
    title: "The Mobile Health Clinic brings services to your neighborhood.",
    cta: { label: "See the schedule", href: "/wego/schedule" },
    focal: "object-[60%_center] sm:object-[70%_center]",
  },
  {
    image: communityCrowd,
    alt: "Illustration of a large, diverse crowd of people representing the communities served across East Central Georgia.",
    eyebrow: "Serving 13 Counties",
    title: "Public health for every person, every community.",
    cta: { label: "Explore our programs", href: "/programs" },
    focal: "object-[center_top] sm:object-[center_30%]",
  },
  {
    image: immunization,
    alt: "A nurse administering an immunization to a patient's arm.",
    eyebrow: "Immunizations",
    title: "Stay protected — vaccines for every age.",
    cta: { label: "Find a clinic near you", href: "/counties" },
  },
];

const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { slides: dbSlides, loading } = useHeroSlides();

  // Map DB slides into the existing Slide shape so the render code below stays unchanged.
  const slides: Slide[] =
    !loading && dbSlides && dbSlides.length > 0
      ? dbSlides.map((s) => ({
          image: s.image_url || mobileClinic,
          alt: s.image_alt || "",
          eyebrow: s.eyebrow ?? "",
          title: s.title,
          subtitle: s.subtitle ?? undefined,
          cta: {
            label: s.cta_label ?? "",
            href: s.cta_href ?? "#",
          },
          secondaryCta:
            s.secondary_cta_label && s.secondary_cta_href
              ? { label: s.secondary_cta_label, href: s.secondary_cta_href }
              : undefined,
          focal: s.focal ?? undefined,
        }))
      : defaultSlides;

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured public health programs"
      className="relative overflow-hidden rounded-lg border border-border"
    >
      <Carousel
        opts={{ loop: true }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, i) => (
            <CarouselItem
              key={slide.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${slides.length}`}
            >
              {/* Editorial mobile aspect; image as background, content stacked at bottom.
                  Mobile uses min-height instead of fixed aspect so long captions/CTA never clip. */}
              <div className="relative w-full min-h-[420px] sm:min-h-0 sm:aspect-[16/9] md:aspect-[16/7]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  width={1280}
                  height={576}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover ${slide.focal ?? "object-center"}`}
                />
                {/* Stronger bottom gradient on phones for readable caption; sides on desktop. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/75 to-foreground/20 sm:bg-gradient-to-r sm:from-foreground/85 sm:via-foreground/55 sm:to-transparent"
                />
                {/* pb-20 on mobile clears the dots pill so the CTA is always fully visible. */}
                <div className="relative flex h-full w-full min-w-0 max-w-2xl flex-col justify-end gap-2.5 p-4 pb-20 text-background sm:justify-center sm:gap-3 sm:p-8 sm:pb-8 md:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-background/90 sm:text-sm">
                    {slide.eyebrow}
                  </p>
                  <h2 className="break-words text-lg font-bold leading-snug sm:text-3xl sm:leading-tight md:text-4xl">
                    {slide.title}
                  </h2>
                  <a
                    href={slide.cta.href}
                    className="mt-1 inline-flex w-fit max-w-full items-center gap-2 rounded bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background sm:mt-2 sm:py-3"
                  >
                    <span className="truncate">{slide.cta.label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Prev/Next — overridden to use brand tokens with strong contrast */}
        <CarouselPrevious
          aria-label="Previous slide"
          className="left-2 h-9 w-9 border-0 bg-brand text-brand-foreground hover:bg-brand-hover hover:text-brand-foreground sm:left-3 sm:h-11 sm:w-11"
        />
        <CarouselNext
          aria-label="Next slide"
          className="right-2 h-9 w-9 border-0 bg-brand text-brand-foreground hover:bg-brand-hover hover:text-brand-foreground sm:right-3 sm:h-11 sm:w-11"
        />
      </Carousel>

      <div className="absolute bottom-3 left-1/2 flex max-w-[calc(100%-1rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-foreground/70 px-3 py-2 backdrop-blur">
        <ul className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
          {slides.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                role="tab"
                aria-selected={current === i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`block h-2 min-h-[44px] rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background ${
                  current === i
                    ? "w-8 bg-background sm:w-11"
                    : "w-8 bg-background/60 hover:bg-background/90 sm:w-11"
                }`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSlider;
