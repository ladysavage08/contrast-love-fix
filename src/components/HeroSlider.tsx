import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Pause, Play } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import community from "@/assets/slide-community.jpg";
import mobileClinic from "@/assets/slide-mobile-clinic.jpg";
import immunization from "@/assets/slide-immunization.jpg";

type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  cta: { label: string; href: string };
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
    alt: "ECHD Mobile Health Clinic van parked at a community location.",
    eyebrow: "Care that comes to you",
    title: "The Mobile Health Clinic brings services to your neighborhood.",
    cta: { label: "See the schedule", href: "/mobile-health-clinic" },
  },
  {
    image: immunization,
    alt: "A nurse administering an immunization to a patient's arm.",
    eyebrow: "Immunizations",
    title: "Stay protected — vaccines for every age.",
    cta: { label: "Find a clinic", href: "/immunizations" },
  },
];

const HeroSlider = () => {
  const autoplay = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const togglePlay = () => {
    const ap = autoplay.current;
    if (isPlaying) {
      ap.stop();
      setIsPlaying(false);
    } else {
      ap.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured public health programs"
      className="relative overflow-hidden rounded-lg border border-border"
    >
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
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
              <div className="relative aspect-[16/7] w-full">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  width={1280}
                  height={576}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Dark gradient ensures ≥4.5:1 contrast for white caption text */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-transparent"
                />
                <div className="relative flex h-full max-w-2xl flex-col justify-center gap-3 p-6 text-background sm:p-10">
                  <p className="text-sm font-semibold uppercase tracking-wide text-background/90">
                    {slide.eyebrow}
                  </p>
                  <h2 className="text-2xl font-bold leading-tight sm:text-4xl">
                    {slide.title}
                  </h2>
                  <a
                    href={slide.cta.href}
                    className="mt-2 inline-flex w-fit items-center gap-2 rounded bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
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
          className="left-3 h-10 w-10 border-0 bg-brand text-brand-foreground hover:bg-brand-hover hover:text-brand-foreground"
        />
        <CarouselNext
          aria-label="Next slide"
          className="right-3 h-10 w-10 border-0 bg-brand text-brand-foreground hover:bg-brand-hover hover:text-brand-foreground"
        />
      </Carousel>

      {/* Controls bar: dots + play/pause */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground/70 px-3 py-1.5 backdrop-blur">
        <ul className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
          {slides.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                role="tab"
                aria-selected={current === i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`block h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background ${
                  current === i
                    ? "w-6 bg-background"
                    : "w-2.5 bg-background/60 hover:bg-background/90"
                }`}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          aria-pressed={!isPlaying}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground hover:bg-background/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
