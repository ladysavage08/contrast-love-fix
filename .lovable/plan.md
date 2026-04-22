

## Repoint third Hero slide CTA to Counties page

Keep the Immunizations messaging on slide 3 of the homepage Hero slider; only the button destination and label change so it accurately reflects where it leads.

### Change

In `src/components/HeroSlider.tsx`, slide index 2 (the Immunizations slide) `cta` field:

- `href`: `/immunizations` → `/counties`
- `label`: `Find a clinic` → `Find a clinic near you`

Rationale: "Find a clinic" still reads naturally when pointing at the county directory, since users pick a county to locate their local health department clinic. Adding "near you" makes the directory destination feel intentional without changing the immunization theme (eyebrow and title stay as-is).

### Untouched

- Slide 3 image, eyebrow ("Immunizations"), and title ("Stay protected — vaccines for every age.")
- Slides 1 and 2
- Slider behavior, autoplay, dots, play/pause, ARIA
- Routing (`/counties` route already exists)

### Files

- `src/components/HeroSlider.tsx` — single two-line edit inside the `slides` array.

