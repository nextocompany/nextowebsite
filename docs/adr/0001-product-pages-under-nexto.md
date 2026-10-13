# Product pages live under nexto.co.th, not on subdomains

Endyra had its own site at endyra.nexto.co.th (separate repo, English only, its own contact addresses). We are moving each product to a page on the main site, `nexto.co.th/endyra/` and `nexto.co.th/anvira/` (Thai under `/th/`). The old site (Worker `endyrawebsite`) was deleted on 2026-10-14 with no redirect: it was a placeholder, and the user did not want to keep its traffic or search standing.

Endyra and Anvira are sold and supported as Nexto products, not as separate brands, so one domain gathers the search standing of the company and its products, and the product pages share the main site's design, Thai copy, sitemap and contact addresses (endyra@ and anvira@nexto.co.th). A subdomain would be the right call only if a product became its own brand or company, in which case it should get its own domain (e.g. endyra.io), not a subdomain.

## Consequences

- endyra.nexto.co.th no longer resolves; its code is still in the nextocompany/endyrawebsite repo.
- The old Endyra site's claims that are not yet true (10+ hospitals, 99.9% uptime, 24/7 support, zero data loss, full compliance) do not carry over.
