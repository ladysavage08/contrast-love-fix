/**
 * Women's Health — single source of truth.
 *
 * Drives the /womens-health index and /womens-health/:slug subpages.
 * To add a new page, append to `whSubpages` — index tile and detail page
 * appear automatically. Slugs are short, lowercase, URL-safe.
 */

export interface WhResource {
  label: string;
  href?: string;
}

export interface WhSubpage {
  slug: string;
  title: string;
  /** One-line summary used on the index tile. */
  summary: string;
  /** Longer intro shown at the top of the subpage. */
  intro: string;
  /** Topics / services offered through this program. */
  services: string[];
  /** Optional eligibility / "who it's for" copy. */
  eligibility?: string;
  /** Related links and resources. */
  resources: WhResource[];
  contact?: {
    phone?: string;
    email?: string;
    note?: string;
  };
}

/** Programs & Services tiles on the Women's Health index. */
export const whProgramSlugs = [
  "bccp",
  "family-planning",
  "preconception-health",
  "breast-health",
  "cervical-health",
  "cancer-screening-services",
] as const;

/** Related services surfaced from the Women's Health index. */
export const whRelatedSlugs = ["mens-health"] as const;

export const whSubpages: WhSubpage[] = [
  {
    slug: "bccp",
    title: "Breast and Cervical Cancer Prevention (BCCP)",
    summary:
      "Free and low-cost breast and cervical cancer screenings for eligible women.",
    intro:
      "The Breast and Cervical Cancer Prevention (BCCP) program provides free and low-cost screenings, diagnostic services, and case management for eligible women — with a focus on early detection, when treatment is most effective.",
    services: [
      "Clinical breast exams",
      "Screening mammograms",
      "Pap tests and pelvic exams",
      "HPV testing when indicated",
      "Diagnostic follow-up after an abnormal screening",
      "Patient navigation and case management",
    ],
    eligibility:
      "Generally available to women age 40 and older who are uninsured or underinsured and meet program income guidelines. Some screenings may be available for younger women based on risk. Call to confirm eligibility.",
    resources: [
      { label: "About BCCP" },
      { label: "Eligibility &amp; Income Guidelines" },
      { label: "What to Expect at Your Screening" },
      { label: "Mammogram FAQ" },
      { label: "Pap Test FAQ" },
    ],
  },
  {
    slug: "family-planning",
    title: "Family Planning / Reproductive Health",
    summary:
      "Confidential birth control, reproductive care, education, and counseling.",
    intro:
      "Confidential family planning and reproductive health services that help women and couples plan if and when to have children, while supporting overall reproductive wellness.",
    services: [
      "Birth control counseling and prescriptions",
      "Long-acting reversible contraception (LARC) information",
      "Annual well-woman exams",
      "Pregnancy testing and options counseling",
      "STI testing and treatment",
      "Reproductive health education",
    ],
    eligibility:
      "Available to women of reproductive age regardless of insurance status. Fees are based on a sliding scale.",
    resources: [
      { label: "Birth Control Method Comparison" },
      { label: "Well-Woman Exam: What to Expect" },
      { label: "Reproductive Health Education" },
      { label: "STI Testing Information" },
    ],
  },
  {
    slug: "preconception-health",
    title: "Preconception Health",
    summary:
      "Optimize your health before pregnancy for the best possible outcomes.",
    intro:
      "Preconception health focuses on your physical and mental wellness before pregnancy. Even if pregnancy isn't planned soon, healthy habits today support better outcomes for you and any future children.",
    services: [
      "Preconception counseling",
      "Folic acid &amp; nutrition guidance",
      "Chronic condition management review (diabetes, hypertension, thyroid)",
      "Medication safety review",
      "Vaccination review (rubella, Tdap, flu, COVID-19)",
      "Tobacco, alcohol, and substance use support",
    ],
    eligibility:
      "Recommended for any woman who is or may become pregnant. Services are available regardless of current insurance status.",
    resources: [
      { label: "Preconception Health Checklist" },
      { label: "Folic Acid &amp; Nutrition" },
      { label: "Healthy Weight Before Pregnancy" },
      { label: "Managing Chronic Conditions" },
    ],
  },
  {
    slug: "breast-health",
    title: "Breast Health",
    summary:
      "Education, awareness, and screenings to detect breast cancer early.",
    intro:
      "Breast health information, awareness resources, and clinical screenings that help women understand their bodies and catch problems early — when treatment is most effective.",
    services: [
      "Clinical breast exams",
      "Screening mammogram referrals",
      "Breast self-awareness education",
      "Risk assessment &amp; family history review",
      "Referrals for diagnostic imaging when indicated",
    ],
    eligibility:
      "Available to women of all ages. Screening recommendations vary by age and personal risk — talk with a provider about what's right for you.",
    resources: [
      { label: "Breast Self-Awareness Guide" },
      { label: "When to Start Mammograms" },
      { label: "Understanding Breast Density" },
      { label: "Breast Cancer Risk Factors" },
    ],
  },
  {
    slug: "cervical-health",
    title: "Cervical Health",
    summary:
      "Pap tests, HPV awareness, and cervical cancer prevention.",
    intro:
      "Cervical health services help prevent and detect cervical cancer through Pap tests, HPV testing, and HPV vaccination — one of the most preventable cancers when caught early.",
    services: [
      "Pap tests",
      "HPV testing when indicated",
      "HPV vaccination information",
      "Follow-up for abnormal Pap results",
      "Cervical cancer prevention education",
    ],
    eligibility:
      "Routine cervical screening is generally recommended for women starting at age 21. HPV vaccination is recommended starting at age 9 and is most effective before exposure.",
    resources: [
      { label: "Cervical Cancer Screening Guidelines" },
      { label: "Understanding HPV" },
      { label: "HPV Vaccine Information" },
      { label: "What an Abnormal Pap Means" },
    ],
  },
  {
    slug: "cancer-screening-services",
    title: "Cancer Screening Services",
    summary:
      "Overview of cancer screenings available through the health district.",
    intro:
      "An overview of the cancer screenings offered through East Central Health District — including breast, cervical, and colon cancer screenings, plus referrals for additional services.",
    services: [
      "Clinical breast exams &amp; mammogram referrals",
      "Pap tests and HPV testing",
      "Colon cancer screening information &amp; referrals",
      "Skin cancer education",
      "Patient navigation for follow-up care",
    ],
    eligibility:
      "Eligibility varies by screening. Many services are free or low-cost for uninsured or underinsured residents — call to confirm.",
    resources: [
      { label: "Recommended Screening Schedule by Age" },
      { label: "Breast &amp; Cervical Cancer Prevention (BCCP)" },
      { label: "Colon Cancer Screening Information" },
      { label: "Reducing Your Cancer Risk" },
    ],
  },
  {
    slug: "mens-health",
    title: "Men's Health",
    summary:
      "Preventive care, screenings, and resources for men.",
    intro:
      "Preventive health services and resources for men — included alongside Women's Health because many programs and screenings serve the whole family.",
    services: [
      "Annual physicals and well-man exams",
      "Blood pressure and cholesterol screenings",
      "Diabetes screening (A1C)",
      "Colon cancer screening information",
      "STI testing and treatment",
      "Tobacco cessation support",
    ],
    eligibility:
      "Available to men of all ages. Some screenings begin at specific ages — talk with a provider about what's right for you.",
    resources: [
      { label: "Recommended Screenings for Men" },
      { label: "Heart Health Basics" },
      { label: "Colon Cancer Screening" },
      { label: "Tobacco Cessation Resources" },
    ],
  },
];

export const getWhSubpageBySlug = (slug: string): WhSubpage | undefined =>
  whSubpages.find((p) => p.slug === slug);

export const getWhSubpages = (slugs: ReadonlyArray<string>): WhSubpage[] =>
  slugs
    .map((s) => whSubpages.find((p) => p.slug === s))
    .filter((p): p is WhSubpage => Boolean(p));
