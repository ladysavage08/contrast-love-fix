/**
 * Programs and Services — single source of truth.
 *
 * Drives the /programs index and the dynamic /programs/:slug pages.
 * To add a new program, append an entry here — the index tile and detail
 * page will appear automatically. Slugs are kept short, lowercase, and
 * URL-safe. Subtopic `href` is optional (placeholder for future deep-links).
 */

export interface ProgramSubtopic {
  label: string;
  href?: string;
}

export interface Program {
  slug: string;
  title: string;
  /** One-line summary used on the index tile. */
  summary: string;
  /** Longer intro shown at the top of the program page. */
  intro: string;
  subtopics: ProgramSubtopic[];
  /**
   * Optional override that points the index tile to a custom section route
   * (e.g. Environmental Health has its own dedicated section).
   */
  href?: string;
  /** Optional contact override; falls back to the district main line. */
  contact?: {
    phone?: string;
    email?: string;
    note?: string;
  };
}

export const programs: Program[] = [
  {
    slug: "birth-death-certificates",
    title: "Birth/Death Certificates",
    summary:
      "Request certified copies of Georgia birth and death certificates.",
    intro:
      "Vital records services for Georgia birth and death certificates. Eligible family members and legal representatives may request certified copies for school, travel, employment, and estate purposes.",
    subtopics: [
      { label: "Birth Certificate Information" },
      { label: "Death Certificate Information" },
    ],
  },
  {
    slug: "breastfeeding",
    title: "Breastfeeding",
    summary:
      "Education, peer support, and workplace resources for nursing families.",
    intro:
      "We promote breastfeeding as the healthiest start for babies and offer education, peer support, and resources for families and employers across the district.",
    subtopics: [
      { label: "Breastfeeding Promotion" },
      { label: "Breastfeeding Coalition" },
      { label: "BF Employer Information" },
      { label: "BF Mother Friendly Employers" },
      { label: "Are You Hungry?" },
      { label: "Fad diets" },
    ],
  },
  {
    slug: "child-adolescent-health",
    title: "Child/Adolescent Health",
    summary:
      "Well-child care, screenings, and support for infants through adolescents.",
    intro:
      "Programs and services that support healthy growth, development, and safety for infants, children, and adolescents — including specialized services for children with special health care needs.",
    subtopics: [
      { label: "Childhood Safety" },
      { label: "Children's Medical Services (CMS)" },
      { label: "Hearing Screening for Infants" },
      { label: "Children 1st" },
      { label: "Babies Can't Wait (BCW)" },
      { label: "Infants at High Risk" },
      { label: "SIDS Info" },
    ],
  },
  {
    slug: "chronic-disease-prevention",
    title: "Chronic Disease Prevention",
    summary:
      "Screenings, education, and management for long-term health conditions.",
    intro:
      "Resources and clinical services to help residents prevent and manage chronic diseases that affect quality of life and health outcomes across the district.",
    subtopics: [
      { label: "Arthritis" },
      { label: "Asthma" },
      { label: "Cancer" },
      { label: "Diabetes" },
      { label: "Heart Cardiovascular Disease" },
      { label: "Hypertension Management" },
    ],
  },
  {
    slug: "communicable-disease",
    title: "Communicable Disease",
    summary:
      "Surveillance, testing, and education for infectious diseases.",
    intro:
      "We monitor, investigate, and respond to communicable disease in the community, and offer testing, treatment, and education for residents and providers.",
    subtopics: [
      { label: "Diseases Notification Form" },
      { label: "HIV/AIDS Info" },
      { label: "Sexually Transmitted Disease (STD) Info" },
      { label: "Tuberculosis (TB) Info" },
    ],
  },
  {
    slug: "dental",
    title: "Dental",
    summary:
      "Oral health information, forms, and frequently asked questions.",
    intro:
      "Information and resources on oral health, including links, FAQs, and downloadable forms used by district dental services.",
    subtopics: [
      { label: "Dental Facts & Links" },
      { label: "Dental FAQ" },
      { label: "Dental Forms" },
    ],
  },
  {
    slug: "emergency-medical-services",
    title: "Emergency Medical Services",
    summary:
      "Pre-hospital emergency care coordination across the district.",
    intro:
      "Emergency Medical Services (EMS) supports pre-hospital emergency response, licensure, and coordination with local providers across our 13-county service area.",
    subtopics: [],
  },
  {
    slug: "emergency-preparedness",
    title: "Emergency Preparedness",
    summary:
      "Plan, prepare, and respond to public health emergencies.",
    intro:
      "Tools and information to help families, providers, and communities prepare for and respond to public health emergencies — from severe weather to disease outbreaks.",
    subtopics: [
      { label: "Are You Ready?" },
      { label: "Bio-terrorism agents/Diseases" },
      { label: "MRC" },
    ],
  },
  {
    slug: "environmental-health",
    title: "Environmental Health",
    summary:
      "Inspections and permitting that protect public safety.",
    intro:
      "Environmental Health protects public safety through restaurant and pool inspections, on-site sewage permitting, rabies control, and a range of other regulatory programs.",
    subtopics: [
      { label: "Mosquito Control" },
      { label: "Restaurant Scores" },
      { label: "Food Services" },
      { label: "Wastewater Management" },
      { label: "Hotels, Motels and Campgrounds" },
      { label: "Public swimming pools" },
      { label: "Rabies Control program" },
      { label: "Injury Prevention Program" },
      { label: "Tattoo/Body Piercing program" },
      { label: "Well Water" },
    ],
  },
  {
    slug: "epidemiology",
    title: "Epidemiology",
    summary:
      "Disease tracking and public health investigation.",
    intro:
      "Our epidemiology team tracks disease trends, investigates outbreaks, and serves as a liaison between providers, partners, and the public.",
    subtopics: [{ label: "Public Health Liaison" }],
  },
  {
    slug: "immunizations",
    title: "Immunizations",
    summary:
      "Vaccines for children, adolescents, and adults.",
    intro:
      "Routine and travel vaccines for all ages, plus seasonal flu information and Georgia immunization requirements for school and child care.",
    subtopics: [
      { label: "Immunization Resources" },
      { label: "Flu Information" },
    ],
  },
  {
    slug: "mosquito-control",
    title: "Mosquito Control",
    summary:
      "Surveillance, education, and integrated mosquito management.",
    intro:
      "An integrated mosquito management program serving residents through surveillance, education, inspections, and response to community requests.",
    subtopics: [
      { label: "Education & Outreach" },
      { label: "Mosquito and Tick Surveillance" },
      { label: "Integrated Mosquito Management" },
      { label: "Detention & Retention Pond Inspections" },
      { label: "311 Customer Requests for Mosquito Assessments" },
      { label: "Tire Clean-Up & Property Inspections" },
      { label: "Neglected Swimming Pool Inspections" },
    ],
  },
  {
    slug: "nutrition-and-wic",
    title: "Nutrition and WIC",
    summary:
      "Supplemental nutrition and education for women, infants, and children.",
    intro:
      "The Women, Infants, and Children (WIC) Supplemental Nutrition Program provides nutritious foods, education, and breastfeeding support to eligible families, alongside community-based nutrition services.",
    subtopics: [
      {
        label:
          "The Women, Infants, and Children (WIC) Supplemental Nutrition Program",
      },
      { label: "Qualifying for WIC" },
      { label: "Population-Based Nutrition Services" },
      { label: "Community Activities" },
      { label: "WIC-Approved Food List" },
    ],
  },
  {
    slug: "teen-pregnancy-prevention",
    title: "Teen Pregnancy Prevention",
    summary:
      "Education, services, and resources for adolescents and providers.",
    intro:
      "Teen pregnancy prevention services include education, clinical care, training for adolescent health professionals, and links to trusted resources for teens and families.",
    subtopics: [
      { label: "Prevention Services" },
      { label: "Teen Links" },
      { label: "Adolescent Health Training" },
      { label: "Reproductive Health Care" },
      { label: "Stats" },
      { label: "Fact Sheets" },
    ],
  },
  {
    slug: "tobacco-use-prevention",
    title: "Tobacco Use Prevention",
    summary:
      "Education and resources to prevent and reduce tobacco use.",
    intro:
      "Education, cessation resources, and policy support to prevent tobacco use and protect community members from secondhand smoke.",
    subtopics: [],
  },
  {
    slug: "womens-health",
    title: "Women's Health",
    summary:
      "Preventive care and screenings for women — and resources for men.",
    intro:
      "Preventive services and screenings that support women's health across the lifespan, including breast and cervical cancer prevention, preconception health, and related resources for men.",
    subtopics: [
      { label: "Men's Health" },
      { label: "Colon Cancer" },
      { label: "Breast and Cervical Cancer Prevention (BCCP)" },
      { label: "Preconception Health" },
    ],
  },
];

export const getProgramBySlug = (slug: string): Program | undefined =>
  programs.find((p) => p.slug === slug);
