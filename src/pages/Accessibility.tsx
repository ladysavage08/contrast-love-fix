import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const Accessibility = () => {
  useEffect(() => {
    document.title = "Accessibility Statement | East Central Health District";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main" className="container py-10 md:py-12">
        <article className="mx-auto max-w-4xl space-y-6">
          <header className="space-y-3 border-b border-border pb-6">
            <h1 className="text-3xl font-bold md:text-4xl">Accessibility Statement</h1>
            <p className="text-base leading-relaxed text-foreground">
              East Central Health District (ECPHD) is committed to providing access to our programs, services, and activities, including through our website, in accordance with applicable federal and state laws, including the Americans with Disabilities Act (ADA).
            </p>
          </header>

          <section aria-labelledby="accessibility-standards-heading" className="space-y-3">
            <h2 id="accessibility-standards-heading" className="text-2xl font-semibold">
              Accessibility Standards
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              We are actively working to ensure our website aligns with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, which are recognized accessibility standards for digital content. While we strive to adhere to these guidelines, accessibility is an ongoing process, and some areas of the website may not yet fully conform.
            </p>
          </section>

          <section aria-labelledby="ongoing-efforts-heading" className="space-y-3">
            <h2 id="ongoing-efforts-heading" className="text-2xl font-semibold">
              Ongoing Accessibility Efforts
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              ECPHD is engaged in continuous efforts to evaluate and improve the accessibility of our website. These efforts include, but are not limited to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground marker:text-primary">
              <li>Conducting accessibility audits and reviews</li>
              <li>Implementing design and development updates to improve usability</li>
              <li>Enhancing keyboard navigation and focus visibility</li>
              <li>Improving color contrast and readability</li>
              <li>Ensuring forms and interactive elements are accessible</li>
              <li>Providing alternative text for images and non-text content</li>
            </ul>
          </section>

          <section aria-labelledby="third-party-content-heading" className="space-y-3">
            <h2 id="third-party-content-heading" className="text-2xl font-semibold">
              Third-Party Content
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              Our website may include links to third-party websites or integrate third-party tools and content. East Central Health District does not control the accessibility of third-party content and cannot guarantee its compliance with accessibility standards.
            </p>
          </section>

          <section aria-labelledby="alternative-access-heading" className="space-y-3">
            <h2 id="alternative-access-heading" className="text-2xl font-semibold">
              Alternative Access
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              If you experience difficulty accessing any content on our website, or if you need assistance with any of our services, we will provide reasonable accommodations and alternative methods of access upon request.
            </p>
            <p className="text-base leading-relaxed text-foreground">
              <strong>Accessibility Contact:</strong>
              <br />
              Phone:{" "}
              <a
                href="tel:17066674595"
                className="inline-flex items-center font-semibold text-primary underline underline-offset-2 hover:underline focus-visible:underline"
                aria-label="Call Accessibility Contact at 706-667-4595"
              >
                706-667-4595
              </a>
            </p>
            <p className="text-base leading-relaxed text-foreground">
              When contacting us, please provide a description of the issue you encountered, including the web page or feature involved. This will help us respond more effectively.
            </p>
          </section>

          <section aria-labelledby="response-commitment-heading" className="space-y-3">
            <h2 id="response-commitment-heading" className="text-2xl font-semibold">
              Response Commitment
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              East Central Health District will make reasonable efforts to respond to accessibility-related requests in a timely manner and to provide the requested information or service through an accessible communication method.
            </p>
          </section>

          <section aria-labelledby="ongoing-improvements-heading" className="space-y-3">
            <h2 id="ongoing-improvements-heading" className="text-2xl font-semibold">
              Ongoing Improvements
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              We recognize that accessibility is an ongoing effort and are committed to continually improving the accessibility of our digital content. Updates and improvements will be made as part of our regular website maintenance and enhancement process.
            </p>
          </section>

          <section aria-labelledby="feedback-heading" className="space-y-3">
            <h2 id="feedback-heading" className="text-2xl font-semibold">
              Feedback
            </h2>
            <p className="text-base leading-relaxed text-foreground">
              We welcome feedback from users regarding accessibility barriers and will consider all input as part of our ongoing efforts to improve access for all individuals.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Accessibility;