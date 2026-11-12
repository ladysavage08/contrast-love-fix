# Compass for Hope merge — go-live runbook (requires final approval)
1. Upload the new Pair package (the site works with today's data unchanged).
2. Run 1-backup.sql (saves CSVs of every affected row).
3. Run 2-merge.sql.
4. Add the lines in 4-htaccess-redirects.txt to .htaccess on Pair (permanent 301 redirects).
5. Check: /news shows one Compass card with the next Sunday; old links redirect.
Rollback: run 3-rollback.sql, remove the .htaccess lines, re-upload the previous package if needed.
Project Refresh – Shower @ May Park is NOT merged: its two copies have different descriptions and images, and both dates have passed.
