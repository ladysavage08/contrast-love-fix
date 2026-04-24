import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import community from "@/assets/slide-community.jpg";
import mobileClinic from "@/assets/hero-mobile-clinic.jpg";
import immunization from "@/assets/slide-immunization.jpg";

type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  cta: { label: string; href: string };
  /** Tailwind object-position classes, e.g. "object-center sm:object-right". Keeps focal subject visible across breakpoints. */
  focal?: string;
};

const slides: Slide[] = [
  {
    image: community,
    alt: "Families and a public health nurse at a community wellness event.",
    eyebrow: "Serving 13 Counties",
    title: "Healthy people, strong communities across East Central Georgia.",
    cta: { label: "Explore our programs", href: "/programs" },
  },
  {
    image: mobileClinic,
    alt: "East Central Public Health District Mobile Health Clinic vehicle with DPH branding and the slogan 'We Go Where You Are!'",
    eyebrow: "Care that comes to you",
    title: "The Mobile Health Clinic brings services to your neighborhood.",
    cta: { label: "See the schedule", href: "/wego/schedule" },
    // Mobile (portrait): center on the truck/DPH seal. Desktop (wide): shift right so the seal & slogan stay in view next to the caption on the left.
    focal: "object-[60%_center] sm:object-[70%_center]",
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
              {/* Shorter, editorial mobile aspect; image as background, content stacked at bottom. */}
              <div className="relative aspect-[5/4] w-full sm:aspect-[16/9] md:aspect-[16/7]">
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
                <div className="relative flex h-full max-w-2xl flex-col justify-end gap-2.5 p-4 pb-12 text-background sm:justify-center sm:gap-3 sm:p-8 sm:pb-8 md:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-background/90 sm:text-sm">
                    {slide.eyebrow}
                  </p>
                  <h2 className="text-lg font-bold leading-snug sm:text-3xl sm:leading-tight md:text-4xl">
                    {slide.title}
                  </h2>
                  <a
                    href={slide.cta.href}
                    className="mt-1 inline-flex w-fit items-center gap-2 rounded bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background sm:mt-2 sm:py-3"
                  >
                    {slide.cta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Prev/Next — overridden to use brand tokens with strong contrast */}
        <CarouselPrevious
          aria-label="Previous slide"
          className="left-3 h-11 w-11 border-0 bg-brand text-brand-foreground hover:bg-brand-hover hover:text-brand-foreground"
        />
        <CarouselNext
          aria-label="Next slide"
          className="right-3 h-11 w-11 border-0 bg-brand text-brand-foreground hover:bg-brand-hover hover:text-brand-foreground"
        />
      </Carousel>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground/70 px-3 py-2 backdrop-blur">
        <ul className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
          {slides.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                role="tab"
                aria-selected={current === i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`block min-h-[44px] rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background ${
                  current === i
                    ? "w-11 bg-background"
                    : "w-11 bg-background/60 hover:bg-background/90"
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
