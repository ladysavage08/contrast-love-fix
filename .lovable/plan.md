# Plan: Add August 2026 Mobile Health Clinic schedule

## Approach

The WeGo Schedule page reads live from the `posts` table (category "Mobile Clinic"), same as the July batch. This is a data-only update — no code change, no repackage. It will appear immediately once the rows are inserted.

Excluded per your instructions: Maintenance dates and TBD entries.

## Weekday verification

All dates confirmed:
- Aug 4, 11, 18, 25 → Tuesday
- Aug 5, 12 → Wednesday
- Aug 6, 13, 20, 27 → Thursday
- Aug 22 → Saturday

## Rows to insert (16 events)

Format matches July: `post_type=event`, `category=Mobile Clinic`, `published=true`, slug `mobile-clinic-<county>-<date>`, title `<County> County Mobile Clinic – August D, 2026`, `event_location` as `Venue — Address`.

| Date | County | Time | Venue |
|---|---|---|---|
| 08-04 Tue | Burke | 9–12 | Sardis Police Department — 909 Charles Perry Ave., Sardis, GA |
| 08-04 Tue | Jenkins | 1–4 | B&T Fresh Market — 540 E. Winthrope Ave., Millen, GA |
| 08-05 Wed | Warren | 9–12 | Library — 10 Warren St., Warren, GA |
| 08-05 Wed | Glascock | 1–4 | Town Square near Southern Bank — 21 College St., Gibson, GA |
| 08-06 Thu | Taliaferro | 9–12 | County School — 557 Broad St., Crawfordville, GA |
| 08-06 Thu | McDuffie | 1–4 | Dearing Community Center — 4616 Augusta Hwy., Dearing, GA |
| 08-11 Tue | Emanuel | 9–12 | St. Philip Center of Hope — 231 South Racetrack St., Swainsboro, GA |
| 08-11 Tue | Jefferson | 1–4 | Jefferson County High School — 1157 Warrior Trail, Louisville, GA |
| 08-12 Wed | Richmond | 9–3 | Bernie Ward Community Center — 1941 Lumpkin Rd., Augusta, GA |
| 08-13 Thu | Columbia | 9–12 | Concerned Women's Front Building — 114 E. Robinson Ave., Grovetown, GA |
| 08-18 Tue | Wilkes | 9–12 | Ingles — 110 Ann Denard Dr., Washington, GA |
| 08-18 Tue | Lincoln | 1–4 | American Legion — 1070 Thomas Lane Post Rd., Lincolnton, GA |
| 08-20 Thu | Richmond | 9:30–3 | Augusta Housing Authority |
| 08-22 Sat | (special) | — no time — | Augusta Mall Back-to-School Event — Old Sears parking lot, Augusta Mall |
| 08-25 Tue | Richmond | 9–3 | GAP Ministries — 1240 Ellis St., Augusta, GA |
| 08-27 Thu | Screven | 9–12 | Newington Town Hall and Fire Department — 201 Church St., Newington, GA |

The Aug 22 Augusta Mall event will use category `Mobile Clinic – Special` (matches page's "special" type detection) with no `event_time` and title `Augusta Mall Back-to-School Event – August 22, 2026`.

## Not changing

No code changes. Homepage 14-day rule and existing formatting stay as-is.
