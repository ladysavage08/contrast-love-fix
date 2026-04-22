/**
 * Single source of truth for county data.
 *
 * Each county has either status: "live" (full content, gets a real page)
 * or status: "coming-soon" (stub — landing tile shows a friendly placeholder).
 *
 * Address/hours summaries are pre-formatted for the landing tiles. Full
 * details live on the individual county pages.
 */

export type CountyStatus = "live" | "coming-soon";

export interface County {
  slug: string;
  name: string;
  healthDept: string;
  status: CountyStatus;
  address?: {
    street: string;
    cityStateZip: string;
  };
  phone?: string;
  phoneHref?: string;
  /** 1–2 short lines for the tile. Full schedule lives on the county page. */
  hoursSummary?: string[];
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
    hoursSummary: [
      "Mon–Thu · 8:00 AM – 5:30 PM",
      "Closed Noon–1 PM daily",
    ],
    nurseManager: "Gina Richardson, RN, BSN",
  },
  { slug: "columbia", name: "Columbia County", healthDept: "Columbia County Health Department", status: "coming-soon" },
  { slug: "emanuel", name: "Emanuel County", healthDept: "Emanuel County Health Department", status: "coming-soon" },
  { slug: "glascock", name: "Glascock County", healthDept: "Glascock County Health Department", status: "coming-soon" },
  { slug: "jefferson", name: "Jefferson County", healthDept: "Jefferson County Health Department", status: "coming-soon" },
  { slug: "jenkins", name: "Jenkins County", healthDept: "Jenkins County Health Department", status: "coming-soon" },
  { slug: "lincoln", name: "Lincoln County", healthDept: "Lincoln County Health Department", status: "coming-soon" },
  { slug: "mcduffie", name: "McDuffie County", healthDept: "McDuffie County Health Department", status: "coming-soon" },
  { slug: "richmond", name: "Richmond County", healthDept: "Richmond County Health Department", status: "coming-soon" },
  { slug: "screven", name: "Screven County", healthDept: "Screven County Health Department", status: "coming-soon" },
  { slug: "taliaferro", name: "Taliaferro County", healthDept: "Taliaferro County Health Department", status: "coming-soon" },
  { slug: "warren", name: "Warren County", healthDept: "Warren County Health Department", status: "coming-soon" },
  { slug: "wilkes", name: "Wilkes County", healthDept: "Wilkes County Health Department", status: "coming-soon" },
];
