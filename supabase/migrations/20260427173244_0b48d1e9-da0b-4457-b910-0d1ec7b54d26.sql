
DELETE FROM public.staff_directory;

INSERT INTO public.staff_directory (full_name, last_name, job_title, department, county, phone, email, office_location, notes, photo_url, published) VALUES
-- District Offices
('Accounting', 'Accounting', NULL, 'District Office', 'Augusta HQ', '(706) 667-4329', NULL, 'Bldg. G · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4332', NULL, true),
('Administration', 'Administration', NULL, 'District Office', 'Augusta HQ', '(706) 667-4329', NULL, 'Bldg. F · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4332', NULL, true),
('Babies Can''t Wait', 'Babies Cant Wait', NULL, 'District Office', 'Augusta HQ', '(706) 667-4280', NULL, 'Bldg. C · 1916 North Leg Road, Augusta, GA 30909', 'Toll-free: 1-800-653-2229 · Fax: (706) 667-2478', NULL, true),
('Billing Department', 'Billing Department', NULL, 'District Office', 'Augusta HQ', '(706) 667-4265', NULL, 'Bldg. D · 1916 North Leg Road, Augusta, GA 30909', 'Toll-free: 1-888-667-4317 · Fax: (706) 667-4301', NULL, true),
('Breastfeeding', 'Breastfeeding', NULL, 'District Office', 'Augusta HQ', '1-888-992-9708', NULL, 'Bldg. D · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4667', NULL, true),
('Child Health', 'Child Health', NULL, 'District Office', 'Augusta HQ', '(706) 667-4400', NULL, 'Bldg. C · 1916 North Leg Road, Augusta, GA 30909', 'Toll-free: 1-888-307-6365 · Fax: (706) 667-4555', NULL, true),
('Chronic Disease', 'Chronic Disease', NULL, 'District Office', 'Augusta HQ', '(706) 792-2055', NULL, 'Bldg. D · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4301', NULL, true),
('Chronic Disease - Youth', 'Chronic Disease Youth', NULL, 'District Office', 'Augusta HQ', '(706) 667-4283', NULL, 'Bldg. D · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4301', NULL, true),
('District Nursing', 'District Nursing', NULL, 'District Office', 'Augusta HQ', '(706) 667-4255', NULL, 'Bldg. A · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4365', NULL, true),
('Emergency Preparedness Office', 'Emergency Preparedness', NULL, 'District Office', 'Augusta HQ', '(706) 729-2190', NULL, 'Bldg. J · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 729-2197', NULL, true),
('EMS Region 6', 'EMS Region 6', NULL, 'District Office', 'Augusta HQ', '(706) 667-4336', NULL, 'Bldg. I · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4594', NULL, true),
('Environmental Health', 'Environmental Health', NULL, 'District Office', 'Augusta HQ', '(706) 667-4234', NULL, 'Bldg. K · 1916 North Leg Road, Augusta, GA 30909', 'Alt: (706) 667-4346 · Fax: (706) 667-4248', NULL, true),
('Epidemiology & Planning', 'Epidemiology Planning', NULL, 'District Office', 'Augusta HQ', '(706) 667-4260', NULL, 'Bldg. B · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4792', NULL, true),
('Medical Reserve Corps (MRC)', 'Medical Reserve Corps', NULL, 'District Office', 'Augusta HQ', '(706) 667-4276', NULL, 'Bldg. I · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 729-2197', NULL, true),
('MIS / IT', 'MIS IT', NULL, 'District Office', 'Augusta HQ', '(706) 667-4267', NULL, 'Bldg. B · 1916 North Leg Road, Augusta, GA 30909', 'Toll-free: 1-888-667-4317 · Fax: (706) 667-4792', NULL, true),
('Nutrition Services / WIC', 'Nutrition Services WIC', NULL, 'District Office', 'Augusta HQ', '(706) 667-4287', NULL, 'Bldg. D · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4667', NULL, true),
('Personnel & Courier', 'Personnel Courier', NULL, 'District Office', 'Augusta HQ', '(706) 667-4327', NULL, 'Bldg. F · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4332', NULL, true),
('Projects / AIDS', 'Projects AIDS', NULL, 'District Office', 'Augusta HQ', '(706) 667-4342', NULL, 'Bldg. H · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4728', NULL, true),
('Purchasing', 'Purchasing', NULL, 'District Office', 'Augusta HQ', '(706) 667-4329', NULL, 'Bldg. K · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4332', NULL, true),
('Vital Records (Birth/Death Certificates)', 'Vital Records', NULL, 'District Office', 'Augusta HQ', '(706) 667-4335', NULL, 'Bldg. E · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4333', NULL, true),
('Women''s Health / Family Planning', 'Womens Health Family Planning', NULL, 'District Office', 'Augusta HQ', '(706) 667-4284', NULL, 'Bldg. C · 1916 North Leg Road, Augusta, GA 30909', 'Fax: (706) 667-4607', NULL, true),

-- County Health Departments
('Burke County Health Department', 'Burke', NULL, 'County Health Department', 'Burke', '(706) 554-3456', NULL, '114 Dogwood Dr., Waynesboro, GA 30830', 'Fax: (706) 554-2944', NULL, true),
('Columbia County Health Department', 'Columbia', NULL, 'County Health Department', 'Columbia', '(706) 868-3330', NULL, '1930 William Few Pkwy., Grovetown, GA 30813', 'Fax: (706) 868-3336', NULL, true),
('Emanuel County Health Department', 'Emanuel', NULL, 'County Health Department', 'Emanuel', '(478) 237-7501', NULL, '50 Hwy 56 North, Swainsboro, GA 30401', 'Fax: (478) 289-2501', NULL, true),
('Glascock County Health Department', 'Glascock', NULL, 'County Health Department', 'Glascock', '(706) 598-2061', NULL, '668 W Main St., Gibson, GA', 'Fax: (706) 598-2442', NULL, true),
('Jefferson County Health Department', 'Jefferson', NULL, 'County Health Department', 'Jefferson', '(478) 625-3716', NULL, '2501 #1-North, Louisville, GA 30434', 'Fax: (478) 625-8201', NULL, true),
('Jenkins County Health Department', 'Jenkins', NULL, 'County Health Department', 'Jenkins', '(478) 982-2811', NULL, '709 Virginia Ave., Millen, GA 30442', 'Fax: (478) 982-1589', NULL, true),
('Lincoln County Health Department', 'Lincoln', NULL, 'County Health Department', 'Lincoln', '(706) 359-3154', NULL, '176 N Peachtree St., Lincolnton, GA 30817', 'Fax: (706) 359-1939', NULL, true),
('McDuffie County Health Department', 'McDuffie', NULL, 'County Health Department', 'McDuffie', '(706) 595-1740', NULL, '307 Greenway St., Thomson, GA 30824', 'Fax: (706) 595-8503', NULL, true),
('Richmond County Health Department (Laney Walker)', 'Richmond Laney Walker', NULL, 'County Health Department', 'Richmond', '(706) 721-5900', NULL, '950 Laney Walker Blvd., Augusta, GA 30901', 'Fax: (706) 721-5903', NULL, true),
('Richmond County Health Department (South Augusta)', 'Richmond South Augusta', NULL, 'County Health Department', 'Richmond', '(706) 790-0661', NULL, '2420 Windsor Spring Rd., Augusta, GA 30906', 'Fax: (706) 793-5669', NULL, true),
('Screven County Health Department', 'Screven', NULL, 'County Health Department', 'Screven', '(912) 564-2182', NULL, '416 Pine St., Sylvania, GA 30467', 'Fax: (912) 564-7887', NULL, true),
('Taliaferro County Health Department', 'Taliaferro', NULL, 'County Health Department', 'Taliaferro', '(706) 456-2316', NULL, '109 Commerce St., Crawfordville, GA 30631', 'Fax: (706) 456-2334', NULL, true),
('Warren County Health Department', 'Warren', NULL, 'County Health Department', 'Warren', '(706) 465-2252', NULL, '501 Legion Dr., Warrenton, GA 30828', 'Fax: (706) 465-1410', NULL, true),
('Wilkes County Health Department', 'Wilkes', NULL, 'County Health Department', 'Wilkes', '(706) 678-2622', NULL, '204 Gordon St., Washington, GA 30673', 'Fax: (706) 678-3115', NULL, true);
