/**
 * Single source of truth for county data.
 *
 * Drives both the Counties landing tiles and the per-county detail page
 * (rendered by CountyPage.tsx using the Burke template layout).
 */

export type CountyStatus = "live" | "coming-soon";

export interface CountyHoursRow {
  days: string;
  time: string;
}

export interface CountyRelatedLink {
  label: string;
  href: string;
  /** Lucide icon name. Resolved in CountyPage. */
  icon: "calendar" | "barChart" | "newspaper" | "utensils";
}

export interface CountyClinicSite {
  name: string;
  contactName?: string;
  addressLines: string[];
  phone?: string;
  phoneHref?: string;
  hours?: CountyHoursRow[];
  walkInHours?: CountyHoursRow[];
  notes?: string[];
}

export interface County {
  slug: string;
  name: string;
  healthDept: string;
  status: CountyStatus;
  address?: {
    poBox?: string;
    street: string;
    cityStateZip: string;
  };
  phone?: string;
  phoneHref?: string;
  /** 1–3 short lines for the landing tile. */
  hoursSummary?: string[];
  lunchClosure?: string;
  nurseManager?: string;

  // ----- Detail-page fields (Burke template) -----
  /** Intro paragraph rendered under the H1. */
  intro?: string;
  /** Structured hours table rows for the detail page. */
  hours?: CountyHoursRow[];
  /** External services page (echd.org). */
  // servicesUrl removed: View All Services now routes to internal /programs
  servicesLabel?: string;
  /** Hero image import path under src/assets, or undefined for placeholder. */
  heroImage?: string;
  heroAlt?: string;
  relatedLinks?: CountyRelatedLink[];
  /** Optional list of additional clinic / office sites for this county. */
  clinicSites?: CountyClinicSite[];
}

const defaultRelated = (countyName: string): CountyRelatedLink[] => [
  { icon: "calendar", label: `${countyName} BOH Meetings 2026`, href: "#" },
  { icon: "barChart", label: "County Health Rankings", href: "#" },
  { icon: "newspaper", label: `${countyName} Local News`, href: "#" },
  { icon: "utensils", label: "Restaurant Inspection Scores", href: "#" },
];

const intro = (name: string, dept: string) =>
  `Welcome to the ${dept}, where our goal is to serve the citizens of ${name} by providing preventive healthcare services.`;

export const counties: County[] = [
  {
    slug: "burke",
    name: "Burke County",
    healthDept: "Burke County Health Department",
    status: "live",
    address: { street: "114 Dogwood Drive", cityStateZip: "Waynesboro, GA 30830" },
    phone: "(706) 554-3456",
    phoneHref: "tel:7065543456",
    hoursSummary: ["Mon–Thu · 8:00 AM – 5:30 PM"],
    lunchClosure: "Closed Noon–1 PM daily",
    nurseManager: "Gina Richardson, RN, BSN",
    intro: intro("Burke County", "Burke County Health Department"),
    hours: [
      { days: "Monday – Thursday", time: "8:00 AM – 5:30 PM" },
      { days: "Friday", time: "Closed every other Friday — call for dates" },
      { days: "Daily", time: "Closed Noon – 1:00 PM" },
    ],
    heroImage: "county-burke.jpg",
    heroAlt: "Burke County courthouse and surrounding landscape",
    relatedLinks: defaultRelated("Burke County"),
  },
  {
    slug: "columbia",
    name: "Columbia County",
    healthDept: "Columbia County Health Department",
    status: "live",
    address: { street: "1930 William Few Parkway", cityStateZip: "Grovetown, GA 30813" },
    phone: "(706) 868-3330",
    phoneHref: "tel:7068683330",
    hoursSummary: ["Mon–Fri · 8:00 AM – 5:00 PM"],
    nurseManager: "LeAnna Niki Crawford, MSN, APRN, FNP-c",
    intro: intro("Columbia County", "Columbia County Health Department"),
    hours: [{ days: "Monday – Friday", time: "8:00 AM – 5:00 PM" }],
    relatedLinks: defaultRelated("Columbia County"),
  },
  {
    slug: "emanuel",
    name: "Emanuel County",
    healthDept: "Emanuel County Health Department",
    status: "live",
    address: {
      poBox: "P.O. Box 436",
      street: "50 Highway 56 North",
      cityStateZip: "Swainsboro, GA 30401",
    },
    phone: "(478) 237-7501",
    phoneHref: "tel:4782377501",
    hoursSummary: [
      "Mon/Wed/Thu · 8:00 AM – 4:30 PM",
      "Tue · 8:00 AM – 6:30 PM",
      "Fri · 8:00 AM – 2:00 PM",
    ],
    nurseManager: "Jennifer Harrison, RN, BSN, APRN, FNP-C, CCP",
    intro: intro("Emanuel County", "Emanuel County Health Department"),
    hours: [
      { days: "Monday, Wednesday, Thursday", time: "8:00 AM – 4:30 PM" },
      { days: "Tuesday", time: "8:00 AM – 6:30 PM" },
      { days: "Friday", time: "8:00 AM – 2:00 PM" },
    ],
    relatedLinks: defaultRelated("Emanuel County"),
  },
  {
    slug: "glascock",
    name: "Glascock County",
    healthDept: "Glascock County Health Department",
    status: "live",
    address: { street: "668 West Main Street", cityStateZip: "Gibson, GA 30810" },
    phone: "(706) 598-2061",
    phoneHref: "tel:7065982061",
    hoursSummary: [
      "Mon/Wed/Thu · 8:00 AM – 4:30 PM",
      "Tue · 8:00 AM – 6:30 PM",
      "Fri · 8:00 AM – 2:30 PM",
    ],
    lunchClosure: "Closed for lunch · 12:00 PM – 12:30 PM",
    nurseManager: "Doriann Dye, RN",
    intro: intro("Glascock County", "Glascock County Health Department"),
    hours: [
      { days: "Monday, Wednesday, Thursday", time: "8:00 AM – 4:30 PM" },
      { days: "Tuesday", time: "8:00 AM – 6:30 PM" },
      { days: "Friday", time: "8:00 AM – 2:30 PM" },
      { days: "Daily", time: "Closed 12:00 – 12:30 PM" },
    ],
    relatedLinks: defaultRelated("Glascock County"),
  },
  {
    slug: "jefferson",
    name: "Jefferson County",
    healthDept: "Jefferson County Health Department",
    status: "live",
    address: {
      poBox: "P.O. Box 306",
      street: "2501 Highway #1, North",
      cityStateZip: "Louisville, GA 30434",
    },
    phone: "(478) 625-3716",
    phoneHref: "tel:4786253716",
    hoursSummary: [
      "Mon/Tue/Thu · 8:00 AM – 4:30 PM",
      "Wed · 8:00 AM – 6:30 PM",
      "Fri · 8:00 AM – 2:30 PM",
    ],
    lunchClosure: "Open during lunch",
    nurseManager: "Leigh Davis, RN, ADN, CCP",
    intro: intro("Jefferson County", "Jefferson County Health Department"),
    hours: [
      { days: "Monday, Tuesday, Thursday", time: "8:00 AM – 4:30 PM" },
      { days: "Wednesday", time: "8:00 AM – 6:30 PM" },
      { days: "Friday", time: "8:00 AM – 2:30 PM" },
    ],
    relatedLinks: defaultRelated("Jefferson County"),
  },
  {
    slug: "jenkins",
    name: "Jenkins County",
    healthDept: "Jenkins County Health Department",
    status: "live",
    address: {
      poBox: "P.O. Box 627",
      street: "709 Virginia Avenue",
      cityStateZip: "Millen, GA 30442",
    },
    phone: "(478) 982-2811",
    phoneHref: "tel:4789822811",
    hoursSummary: ["Mon–Thu · 7:30 AM – 6:00 PM", "Closed Fri/Sat/Sun"],
    lunchClosure: "Lunch · 12:00 PM – 12:30 PM",
    nurseManager: "Clarissa Young, RN, BSN",
    intro: intro("Jenkins County", "Jenkins County Health Department"),
    hours: [
      { days: "Monday – Thursday", time: "7:30 AM – 6:00 PM" },
      { days: "Friday – Sunday", time: "Closed" },
      { days: "Daily", time: "Lunch 12:00 – 12:30 PM" },
    ],
    relatedLinks: defaultRelated("Jenkins County"),
  },
  {
    slug: "lincoln",
    name: "Lincoln County",
    healthDept: "Lincoln County Health Department",
    status: "live",
    address: {
      poBox: "P.O. Box 65",
      street: "176 North Peachtree Street",
      cityStateZip: "Lincolnton, GA 30817",
    },
    phone: "(706) 359-3154",
    phoneHref: "tel:7063593154",
    hoursSummary: [
      "Mon/Wed/Thu · 8:00 AM – 4:30 PM",
      "Tue · 8:00 AM – 6:30 PM",
      "Fri · 8:00 AM – 2:30 PM",
    ],
    nurseManager: "Joy R. Langley, RN, BSN",
    intro: intro("Lincoln County", "Lincoln County Health Department"),
    hours: [
      { days: "Monday, Wednesday, Thursday", time: "8:00 AM – 4:30 PM" },
      { days: "Tuesday", time: "8:00 AM – 6:30 PM" },
      { days: "Friday", time: "8:00 AM – 2:30 PM" },
    ],
    relatedLinks: defaultRelated("Lincoln County"),
  },
  {
    slug: "mcduffie",
    name: "McDuffie County",
    healthDept: "McDuffie County Health Department",
    status: "live",
    address: {
      poBox: "P.O. Box 266",
      street: "307 Greenway Street",
      cityStateZip: "Thomson, GA 30824",
    },
    phone: "(706) 595-1740",
    phoneHref: "tel:7065951740",
    hoursSummary: [
      "Mon/Wed/Thu · 8:00 AM – 5:00 PM",
      "Tue · 8:00 AM – 7:00 PM",
      "Fri · 8:00 AM – 2:00 PM",
    ],
    lunchClosure: "Closed for lunch · 12:30 PM – 1:30 PM",
    nurseManager: "Katy Cunningham, MSN, FNP-C, BSN, RN",
    intro: intro("McDuffie County", "McDuffie County Health Department"),
    hours: [
      { days: "Monday, Wednesday, Thursday", time: "8:00 AM – 5:00 PM" },
      { days: "Tuesday", time: "8:00 AM – 7:00 PM" },
      { days: "Friday", time: "8:00 AM – 2:00 PM" },
      { days: "Daily", time: "Closed 12:30 – 1:30 PM" },
    ],
    relatedLinks: defaultRelated("McDuffie County"),
  },
  {
    slug: "richmond",
    name: "Richmond County",
    healthDept: "Richmond County Health Department",
    status: "live",
    address: { street: "950 Laney-Walker Blvd.", cityStateZip: "Augusta, GA 30901" },
    phone: "(706) 721-5800",
    phoneHref: "tel:7067215800",
    hoursSummary: ["Mon–Fri · 8:00 AM – 5:00 PM"],
    lunchClosure: "Closed for lunch · 12:00 PM – 1:00 PM (Laney Walker)",
    nurseManager: "Makacha C. White, RN, MBA, DNP",
    intro: intro("Richmond County", "Richmond County Health Department"),
    hours: [
      { days: "Monday – Friday", time: "8:00 AM – 5:00 PM" },
      { days: "Daily (Laney Walker)", time: "Closed 12:00 – 1:00 PM" },
    ],
    relatedLinks: defaultRelated("Richmond County"),
    clinicSites: [
      {
        name: "Environmental Health",
        contactName: "Jasmine Anderson",
        addressLines: ["1916 North Leg Road", "Building L", "Augusta, GA 30909"],
        phone: "(706) 667-4234",
        phoneHref: "tel:7066674234",
        hours: [{ days: "Monday – Friday", time: "8:00 AM – 5:00 PM" }],
        notes: ["Please call to check for any schedule changes."],
      },
      {
        name: "Laney Walker Clinic",
        addressLines: ["950 Laney-Walker Blvd.", "Augusta, Georgia 30901"],
        phone: "(706) 721-5900",
        phoneHref: "tel:7067215900",
        hours: [
          { days: "Monday – Friday", time: "8:00 AM – 5:00 PM" },
          { days: "Daily", time: "Closed for Lunch 12:00 PM – 1:00 PM" },
        ],
        notes: [
          "Check-in times vary; please call for more information.",
          "Please call to check for any schedule changes.",
        ],
      },
      {
        name: "South Augusta Clinic",
        addressLines: ["2420 Windsor Spring Road", "Augusta, Georgia 30906"],
        phone: "(706) 721-5800",
        phoneHref: "tel:7067215800",
        hours: [
          { days: "Monday & Wednesday", time: "8:00 AM – 5:00 PM" },
          { days: "Tuesday & Thursday", time: "8:00 AM – 6:00 PM" },
          { days: "Friday", time: "8:00 AM – 3:00 PM" },
        ],
        walkInHours: [
          { days: "Monday", time: "8–11 AM & 1–4 PM" },
          { days: "Tuesday", time: "8–11 AM & 1–5 PM" },
          { days: "Wednesday", time: "8–11 AM & 1–4 PM" },
          { days: "Thursday", time: "8–11 AM & 1–5 PM" },
          { days: "Friday", time: "8–11 AM & 1–2 PM" },
        ],
        notes: ["Please call to check for any schedule changes."],
      },
      {
        name: "TB Control Clinic",
        addressLines: ["950 Laney Walker Blvd.", "Augusta, GA 30901"],
        phone: "(706) 721-5840",
        phoneHref: "tel:7067215840",
        hours: [
          { days: "Monday – Friday", time: "8:00 AM – 11:00 AM / 1:00 PM – 4:00 PM" },
        ],
        notes: [
          "For chest X-rays, please call TB Control for schedule adjustments during scheduled holiday closings.",
        ],
      },
    ],
  },
  {
    slug: "screven",
    name: "Screven County",
    healthDept: "Screven County Health Department",
    status: "live",
    address: { street: "416 Pine Street", cityStateZip: "Sylvania, GA 30467" },
    phone: "(912) 564-2182",
    phoneHref: "tel:9125642182",
    hoursSummary: ["Mon–Fri · 8:00 AM – 4:00 PM"],
    lunchClosure: "Open during lunch",
    nurseManager: "Tiffany Rollins, RN, BSN",
    intro: intro("Screven County", "Screven County Health Department"),
    hours: [{ days: "Monday – Friday", time: "8:00 AM – 4:00 PM" }],
    relatedLinks: defaultRelated("Screven County"),
  },
  {
    slug: "taliaferro",
    name: "Taliaferro County",
    healthDept: "Taliaferro County Health Department",
    status: "live",
    address: {
      poBox: "P.O. Box 184",
      street: "109 Commerce Street NW",
      cityStateZip: "Crawfordville, GA 30631",
    },
    phone: "(706) 456-2316",
    phoneHref: "tel:7064562316",
    hoursSummary: [
      "Mon–Thu · 8:00 AM – 4:30 PM",
      "Fri · 8:00 AM – 1:00 PM (call for appt.)",
    ],
    lunchClosure: "Open during lunch",
    nurseManager: "Kenya Smith, RN, BSN",
    intro: intro("Taliaferro County", "Taliaferro County Health Department"),
    hours: [
      { days: "Monday – Thursday", time: "8:00 AM – 4:30 PM" },
      { days: "Friday", time: "Closed" },
    ],
    relatedLinks: defaultRelated("Taliaferro County"),
  },
  {
    slug: "warren",
    name: "Warren County",
    healthDept: "Warren County Health Department",
    status: "live",
    address: {
      poBox: "P.O. Box 322",
      street: "565 Legion Drive",
      cityStateZip: "Warrenton, GA 30828",
    },
    phone: "(706) 465-2252",
    phoneHref: "tel:7064652252",
    hoursSummary: ["Mon–Thu · 8:00 AM – 4:30 PM", "Closed Friday"],
    lunchClosure: "Open during lunch",
    nurseManager: "Joy R. Langley, RN, BSN",
    intro: intro("Warren County", "Warren County Health Department"),
    hours: [
      { days: "Monday – Thursday", time: "8:00 AM – 4:30 PM" },
      { days: "Friday", time: "Closed" },
    ],
    relatedLinks: defaultRelated("Warren County"),
  },
  {
    slug: "wilkes",
    name: "Wilkes County",
    healthDept: "Wilkes County Health Department",
    status: "live",
    address: { street: "204 Gordon Street", cityStateZip: "Washington, GA 30673" },
    phone: "(706) 678-2622",
    phoneHref: "tel:7066782622",
    hoursSummary: ["Mon–Thu · 7:30 AM – 4:30 PM", "Fri · 7:30 AM – 1:30 PM"],
    lunchClosure: "Open during lunch",
    nurseManager: "Jennifer W. Jackson, MSN, FNP-C",
    intro: intro("Wilkes County", "Wilkes County Health Department"),
    hours: [
      { days: "Monday – Thursday", time: "7:30 AM – 4:30 PM" },
      { days: "Friday", time: "7:30 AM – 1:30 PM" },
    ],
    relatedLinks: defaultRelated("Wilkes County"),
  },
];
