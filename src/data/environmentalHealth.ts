/**
 * Environmental Health — single source of truth for the EH section.
 *
 * Drives the /environmental-health index and /environmental-health/:slug
 * subpages. To add a new EH page, append to `ehSubpages` — the link tile and
 * detail page appear automatically. Slugs are short, lowercase, URL-safe.
 */

export interface EhResource {
  label: string;
  href?: string;
}

export interface EhSubpage {
  slug: string;
  title: string;
  /** One-line summary used on the index tile. */
  summary: string;
  /** Longer intro shown at the top of the subpage. */
  intro: string;
  /** Section heading shown above the resource list (defaults to "Resources"). */
  resourcesHeading?: string;
  resources: EhResource[];
  contact?: {
    phone?: string;
    email?: string;
    note?: string;
  };
}

/** Programs surfaced in the "Would you like information on our programs?" block. */
export const ehProgramSlugs = [
  "foodservice",
  "wastewater-management",
  "hotels-motels-campgrounds",
  "public-swimming-pools",
  "rabies-control",
  "injury-prevention",
  "tattoo-and-body-piercing",
  "well-water",
] as const;

export const ehSubpages: EhSubpage[] = [
  {
    slug: "foodservice",
    title: "Foodservice",
    summary:
      "Inspections, permitting, and food safety rules for restaurants and retail food establishments.",
    intro:
      "Our Foodservice program protects the public through routine inspections, permitting, and education for restaurants, mobile food units, and retail food establishments across the district.",
    resourcesHeading: "Rules, Regulations &amp; Resources",
    resources: [
      { label: "Foodservice Program Description" },
      { label: "Georgia Food Service Rules and Regulations" },
      { label: "Permit Application Information" },
      { label: "Plan Review for New &amp; Remodeled Establishments" },
      { label: "Mobile Food Service Units" },
      { label: "Temporary Food Service Events" },
      { label: "Food Safety Education" },
    ],
  },
  {
    slug: "wastewater-management",
    title: "Wastewater Management",
    summary:
      "On-site sewage permitting, inspections, and certified hauler information.",
    intro:
      "The Wastewater Management program oversees on-site sewage management systems, including permitting, inspections, and the list of certified septic tank pumpers/haulers serving the district.",
    resourcesHeading: "Program Information &amp; Resources",
    resources: [
      { label: "Certified Septic Tank Haulers List" },
      { label: "On-Site Sewage Permit Application" },
      { label: "Soil Evaluation Information" },
      { label: "Septic System Maintenance Tips" },
      { label: "Georgia On-Site Sewage Management Rules" },
    ],
  },
  {
    slug: "hotels-motels-campgrounds",
    title: "Hotels, Motels, and Campgrounds",
    summary:
      "Inspections and regulatory information for tourist accommodations.",
    intro:
      "We inspect hotels, motels, bed and breakfasts, and campgrounds to ensure compliance with state rules that protect guest health and safety.",
    resourcesHeading: "Rules &amp; Regulations",
    resources: [
      { label: "Tourist Accommodations Rules and Regulations" },
      { label: "Permit Application Information" },
      { label: "Inspection Process Overview" },
      { label: "Bed and Breakfast Requirements" },
      { label: "Campground Requirements" },
    ],
  },
  {
    slug: "public-swimming-pools",
    title: "Public Swimming Pools",
    summary:
      "Permitting and inspections for public pools, spas, and recreational water.",
    intro:
      "The Public Swimming Pools program permits and inspects public pools, spas, and similar recreational water facilities to prevent illness and injury.",
    resourcesHeading: "Rules &amp; Regulations",
    resources: [
      { label: "Public Swimming Pool Rules and Regulations" },
      { label: "Pool Permit Application" },
      { label: "Plan Review for New Pools" },
      { label: "Operator Responsibilities" },
      { label: "Water Quality Standards" },
    ],
  },
  {
    slug: "rabies-control",
    title: "Rabies Control",
    summary:
      "Animal bite reporting, exposure response, and the Georgia Rabies Control Manual.",
    intro:
      "Our Rabies Control program responds to animal bites and potential rabies exposures, coordinates with local animal control, and follows the Georgia Rabies Control Manual.",
    resourcesHeading: "State Manual &amp; Program Information",
    resources: [
      { label: "Georgia Rabies Control Manual" },
      { label: "Animal Bite Reporting" },
      { label: "Post-Exposure Guidance" },
      { label: "Pet Vaccination Reminders" },
      { label: "Wildlife Exposure Information" },
    ],
  },
  {
    slug: "injury-prevention",
    title: "Injury Prevention",
    summary:
      "Education and resources to prevent injuries at home, on the road, and in the community.",
    intro:
      "Injury Prevention provides education and resources to reduce preventable injuries — including bicycle safety, fire safety, fall prevention, and child passenger safety.",
    resourcesHeading: "Prevention Resources",
    resources: [
      { label: "Bicycle Safety" },
      { label: "Fire Safety" },
      { label: "Fall Prevention" },
      { label: "Child Passenger Safety" },
      { label: "Home Safety Checklist" },
      { label: "Pedestrian Safety" },
    ],
  },
  {
    slug: "tattoo-and-body-piercing",
    title: "Tattoo and Body Piercing",
    summary:
      "Permitting, inspections, and rules for body art studios.",
    intro:
      "The Tattoo and Body Piercing program permits and inspects body art studios to ensure safe practices that protect both clients and artists.",
    resourcesHeading: "Program Description, Rules &amp; Regulations",
    resources: [
      { label: "Tattoo &amp; Body Piercing Program Description" },
      { label: "Body Art Rules and Regulations" },
      { label: "Studio Permit Application" },
      { label: "Sterilization Standards" },
      { label: "Client Aftercare Information" },
    ],
  },
  {
    slug: "well-water",
    title: "Well Water",
    summary:
      "Guidance and testing information for private well owners.",
    intro:
      "Information and resources for private well owners on safe construction, regular testing, and protecting your drinking water from contamination.",
    resourcesHeading: "Well Water Guidance &amp; Resources",
    resources: [
      { label: "Private Well Owner's Guide" },
      { label: "Recommended Water Testing Schedule" },
      { label: "Bacteriological Testing Information" },
      { label: "Well Construction Standards" },
      { label: "Protecting Your Wellhead" },
    ],
  },
  {
    slug: "restaurant-scores",
    title: "Restaurant Scores",
    summary:
      "Look up inspection scores for restaurants and food establishments.",
    intro:
      "Restaurant inspection scores are public and available online through the Georgia Department of Public Health. Use the resources below to look up the most recent score for any inspected establishment.",
    resourcesHeading: "Find a Score",
    resources: [
      {
        label: "Georgia DPH Restaurant Inspection Scores (statewide lookup)",
      },
      { label: "How Inspection Scores Are Calculated" },
      { label: "Reporting a Concern About a Restaurant" },
    ],
  },
  {
    slug: "richmond-county-environmental-health",
    title: "Richmond County Environmental Health",
    summary:
      "Local Environmental Health office serving Richmond County, Georgia.",
    intro:
      "Richmond County Environmental Health delivers the district's Environmental Health programs locally, including foodservice inspections, on-site sewage permitting, pool and tourist accommodation inspections, and related services.",
    resourcesHeading: "Local Services",
    resources: [
      { label: "Richmond County Foodservice Inspections" },
      { label: "On-Site Sewage Permits — Richmond County" },
      { label: "Pool &amp; Tourist Accommodation Inspections" },
      { label: "Body Art Permits — Richmond County" },
      { label: "Office Location &amp; Hours" },
    ],
  },
  {
    slug: "state-regulations",
    title: "State Regulations / Information",
    summary:
      "Central hub for Georgia state-level Environmental Health rules and resources.",
    intro:
      "A central reference for state-level Environmental Health rules, regulations, and guidance documents that govern programs across Georgia.",
    resourcesHeading: "State Resources",
    resources: [
      { label: "Georgia Department of Public Health — Environmental Health" },
      { label: "Georgia Food Service Rules and Regulations" },
      { label: "Georgia On-Site Sewage Management Rules" },
      { label: "Tourist Accommodations Rules" },
      { label: "Public Swimming Pool Rules" },
      { label: "Body Art Rules" },
      { label: "Georgia Rabies Control Manual" },
    ],
  },
  {
    slug: "servsafe-schedule-2026",
    title: "2026 ServSafe Schedule",
    summary:
      "Upcoming ServSafe Food Protection Manager certification class dates.",
    intro:
      "The 2026 schedule for ServSafe Food Protection Manager certification classes offered through East Central Health District. Seats are limited — please register in advance.",
    resourcesHeading: "Class Information",
    resources: [
      { label: "2026 ServSafe Class Dates &amp; Locations" },
      { label: "Class Cost &amp; What's Included" },
      { label: "ServSafe Registration Form" },
      { label: "What to Bring on Class Day" },
      { label: "Recertification Information" },
    ],
  },
  {
    slug: "cpr-registration-form",
    title: "CPR Registration Form",
    summary:
      "Register for an upcoming CPR certification class.",
    intro:
      "Use the CPR registration form to reserve a seat in an upcoming CPR certification class offered through East Central Health District.",
    resourcesHeading: "Registration",
    resources: [
      { label: "CPR Registration Form (PDF)" },
      { label: "Upcoming CPR Class Dates" },
      { label: "Class Cost &amp; Payment Information" },
      { label: "Group / Workplace Class Requests" },
    ],
  },
  {
    slug: "servsafe-registration-form",
    title: "ServSafe Registration Form",
    summary:
      "Register for an upcoming ServSafe certification class.",
    intro:
      "Use the ServSafe registration form to reserve a seat in an upcoming ServSafe Food Protection Manager certification class.",
    resourcesHeading: "Registration",
    resources: [
      { label: "ServSafe Registration Form (PDF)" },
      { label: "2026 ServSafe Schedule" },
      { label: "Class Cost &amp; Payment Information" },
      { label: "Materials Provided" },
    ],
  },
];

/** Pages linked from the EH index "Related Pages / Related Resources" block. */
export const ehRelatedSlugs = [
  "restaurant-scores",
  "richmond-county-environmental-health",
  "state-regulations",
  "servsafe-schedule-2026",
  "cpr-registration-form",
  "servsafe-registration-form",
] as const;

export const getEhSubpageBySlug = (slug: string): EhSubpage | undefined =>
  ehSubpages.find((p) => p.slug === slug);

export const getEhSubpages = (
  slugs: ReadonlyArray<string>,
): EhSubpage[] =>
  slugs
    .map((s) => ehSubpages.find((p) => p.slug === s))
    .filter((p): p is EhSubpage => Boolean(p));
