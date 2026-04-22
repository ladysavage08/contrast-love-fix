/**
 * Single source of truth for county data.
 *
 * Each county has either status: "live" (full content, gets a real page)
 * or status: "coming-soon" (stub — landing tile shows a friendly placeholder).
 *
 * Address/hours summaries are pre-formatted for the landing tiles. Full
 * details live on the individual county pages.
 *
 * Source of truth for content: each county's page on ecphd.com
 * (e.g. https://ecphd.com/counties/burke-county-health-department/).
 */

export type CountyStatus = "live" | "coming-soon";

export interface County {
  slug: string;
  name: string;
  healthDept: string;
  status: CountyStatus;
  address?: {
    /** Optional PO box line, rendered above the street. */
    poBox?: string;
    street: string;
    cityStateZip: string;
  };
  phone?: string;
  phoneHref?: string;
  /** 1–3 short lines for the tile. Full schedule lives on the county page. */
  hoursSummary?: string[];
  /** Lunch closure or special-hours note, e.g. "Closed Noon–1 PM daily". */
  lunchClosure?: string;
  nurseManager?: string;
}

export const counties: County[] = [
  {
    slug: "burke",
    name: "Burke County",
    healthDept: "Burke County Health Department",
    status: "live",
    address: {
      street: "114 Dogwood Drive",
      cityStateZip: "Waynesboro, GA 30830",
    },
    phone: "(706) 554-3456",
    phoneHref: "tel:7065543456",
    hoursSummary: ["Mon–Thu · 8:00 AM – 5:30 PM"],
    lunchClosure: "Closed Noon–1 PM daily",
    nurseManager: "Gina Richardson, RN, BSN",
  },
  {
    slug: "columbia",
    name: "Columbia County",
    healthDept: "Columbia County Health Department",
    status: "live",
    address: {
      street: "1930 William Few Parkway",
      cityStateZip: "Grovetown, GA 30813",
    },
    phone: "(706) 868-3330",
    phoneHref: "tel:7068683330",
    hoursSummary: ["Mon–Fri · 8:00 AM – 5:00 PM"],
    nurseManager: "LeAnna Niki Crawford, MSN, APRN, FNP-c",
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
  },
  {
    slug: "glascock",
    name: "Glascock County",
    healthDept: "Glascock County Health Department",
    status: "live",
    address: {
      street: "668 West Main Street",
      cityStateZip: "Gibson, GA 30810",
    },
    phone: "(706) 598-2061",
    phoneHref: "tel:7065982061",
    hoursSummary: [
      "Mon/Wed/Thu · 8:00 AM – 4:30 PM",
      "Tue · 8:00 AM – 6:30 PM",
      "Fri · 8:00 AM – 2:30 PM",
    ],
    lunchClosure: "Closed for lunch · 12:00 PM – 12:30 PM",
    nurseManager: "Doriann Dye, RN",
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
    hoursSummary: [
      "Mon–Thu · 7:30 AM – 6:00 PM",
      "Closed Fri/Sat/Sun",
    ],
    lunchClosure: "Lunch · 12:00 PM – 12:30 PM",
    nurseManager: "Clarissa Young, RN, BSN",
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
  },
  {
    slug: "richmond",
    name: "Richmond County",
    healthDept: "Richmond County Health Department",
    status: "live",
    address: {
      street: "950 Laney-Walker Blvd.",
      cityStateZip: "Augusta, GA 30901",
    },
    phone: "(706) 721-5800",
    phoneHref: "tel:7067215800",
    hoursSummary: ["Mon–Fri · 8:00 AM – 5:00 PM"],
    lunchClosure: "Closed for lunch · 12:00 PM – 1:00 PM (Laney Walker)",
    nurseManager: "Makacha C. White, RN, MBA, DNP",
  },
  {
    slug: "screven",
    name: "Screven County",
    healthDept: "Screven County Health Department",
    status: "live",
    address: {
      street: "416 Pine Street",
      cityStateZip: "Sylvania, GA 30467",
    },
    phone: "(912) 564-2182",
    phoneHref: "tel:9125642182",
    hoursSummary: ["Mon–Fri · 8:00 AM – 4:00 PM"],
    lunchClosure: "Open during lunch",
    nurseManager: "Tiffany Rollins, RN, BSN",
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
    hoursSummary: [
      "Mon–Thu · 8:00 AM – 4:30 PM",
      "Closed Friday",
    ],
    lunchClosure: "Open during lunch",
    nurseManager: "Joy R. Langley, RN, BSN",
  },
  {
    slug: "wilkes",
    name: "Wilkes County",
    healthDept: "Wilkes County Health Department",
    status: "live",
    address: {
      street: "204 Gordon Street",
      cityStateZip: "Washington, GA 30673",
    },
    phone: "(706) 678-2622",
    phoneHref: "tel:7066782622",
    hoursSummary: [
      "Mon–Thu · 7:30 AM – 4:30 PM",
      "Fri · 7:30 AM – 1:30 PM",
    ],
    lunchClosure: "Open during lunch",
    nurseManager: "Jennifer W. Jackson, MSN, FNP-C",
  },
];
