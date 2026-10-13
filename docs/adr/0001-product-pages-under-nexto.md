# Product pages live under nexto.co.th, not on subdomains

Endyra had its own site at endyra.nexto.co.th (separate repo, English only, its own contact addresses). We are moving each product to a page on the main site, `nexto.co.th/endyra/` and `nexto.co.th/anvira/` (Thai under `/th/`), and 301-redirecting endyra.nexto.co.th there with a Cloudflare redirect rule on the nexto.co.th zone.

Endyra and Anvira are sold and supported as Nexto products, not as separate brands, so one domain gathers the search standing of the company and its products, and the product pages share the main site's design, Thai copy, sitemap and contact addresses (endyra@ and anvira@nexto.co.th). A subdomain would be the right call only if a product became its own brand or company, in which case it should get its own domain (e.g. endyra.io), not a subdomain.

## Consequences

- The 301 is hard to walk back: search engines move the old site's standing to the new URL.
- The old Endyra site's claims that are not yet true (10+ hospitals, 99.9% uptime, 24/7 support, zero data loss, full compliance) do not carry over.
