# American Diabetes Month 2026 — page + timed homepage slide

## What you'll get
1. **New page at `/diabetes-awareness-month`** titled "November Is American Diabetes Month", using the site's normal header, footer and fonts. Sections in the order of your brief:
   - Hero: "Know Your Risk. Protect Your Health." with the subtitle, supporting text and a **Learn Your Diabetes Risk** button (CDC prediabetes risk resources).
   - Diabetes by the Numbers: three cards (40.1 million; more than 2 in 5 adults; about 8 in 10 don't know), with the CDC credited and linked.
   - Understanding Diabetes: expandable sections for diabetes, type 1, type 2, gestational, prediabetes. States plainly that type 1 can't be prevented right now, and type 2 can often be prevented or delayed.
   - Could You Recognize the Signs?: five warning signs with icons, a note that there may be no symptoms, and "Talk With Your Healthcare Provider About Testing".
   - Could You Have Prediabetes and Not Know It?: a callout with a **Take the 1-Minute Prediabetes Risk Test** button that goes to the CDC-promoted test. The site won't host its own quiz.
   - Small Steps Today. Healthier Tomorrows.: six tip cards, plus a note that type 2 prevention tips are not type 1 treatment.
   - Every Action Matters.: five ways to make a difference, "inspired by" the ADA. No claim of partnership, no ADA artwork, and no claim that it is the 2026 theme.
   - Trusted Resources and a Sources list (the 7 approved CDC/ADA links only).
   - Closing: "Your Health Journey Starts With One Step." with the ECPHD logo and a link to the Contact page. No promises of testing or appointments.
   - The page uses blue and light blue with warm autumn accents. Animations are gentle and turn off for people who prefer reduced motion.
2. **Homepage slide** using the same slide system as Breast Cancer Awareness. It shows "November Is American Diabetes Month" with "Know Your Risk. Protect Your Health." and a **Learn More** button to the new page. It runs Nov 1, 12:00 AM to Dec 1, 12:00 AM Eastern, then disappears on its own. The page itself stays up after that.
3. **New images:** a blue-themed slide photo of a diverse family (no text in the image) and a 1200×630 social-share image.
4. **Search and sharing:** a page title and description, a social preview card, and listings in the sitemap and site search.

## Technical details
- New `src/pages/DiabetesAwarenessMonth.tsx` is modeled on `BreastCancerAwareness.tsx` (one H1, accordion, icons with aria-hidden, sr-only "(opens in a new tab)", min-h-11 tap targets, motion-safe animations). There is a route in `App.tsx`.
- `HeroSlider.tsx`: add an optional `startsAt` to default slides and filter by it along with `expiresAt`. Add the diabetes entry with `startsAt: 2026-11-01T00:00:00-04:00` (EDT at midnight Nov 1) and `expiresAt: 2026-12-01T00:00:00-05:00`. The breast cancer entry and its logic stay the same; it has already expired. The filter is synchronous on first render, so there is no flicker. Existing rule: if any `hero_slides` DB rows exist, they replace the defaults. I'll check whether any exist, and if so tell you rather than change them.
- Add to `scripts/build-share-pages.mjs`, `scripts/generate-sitemap.ts`/`public/sitemap.xml`, and `src/lib/siteSearch.ts`. Images are optimized JPGs in `src/assets` and `public/diabetes-og.jpg`.
- External links go through the existing leave-site warning.
- Checks: the page loads on desktop and phone, the homepage slide shows today and links correctly, the slide is hidden when the clock is mocked to Dec 1, every outbound link returns OK, and the build passes. Then I'll rebuild the upload package. Pair upload is still manual.
