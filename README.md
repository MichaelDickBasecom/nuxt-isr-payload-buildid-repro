# nuxt-isr-payload-buildid-repro

Minimal repro: **stale `_payload.json?{buildId}` on Vercel ISR** during client-side navigation.

## Bug

1. ISR pages cache HTML + `_payload.json` on Vercel (120s here).
2. Client navigation loads payload via `/_payload.json?{buildId}` with `fetch(..., { cache: 'force-cache' })`.
3. `buildId` only changes on deploy, not when ISR revalidates.
4. After revalidation, `?buildId` can return **stale** data; bare `/_payload.json` returns **fresh** data.

`payloadExtraction: 'client'` (Nuxt 4.4+) inlines payload on first load but still uses `?buildId` on client navigations.

## App

- `app/pages/index.vue` — Page A (blue), ISR
- `app/pages/b.vue` — Page B (red), ISR
- Both use `useFetch('/api/time')` so data goes into `_payload.json`
- `nuxt.config.ts` — only ISR route rules + `payloadExtraction: 'client'`

## Repro on Vercel

1. Deploy (`bun run build`).
2. Hard-reload `/`, then client-navigate **A → B → A** (warms `?buildId` cache).
3. Wait **> 2 minutes**.
4. Client-navigate **A → B** (link, not reload).
5. In DevTools → Network, compare:
   - `/b/_payload.json?{buildId}` — often stale
   - `/b/_payload.json` — fresh

## Related upstream issues

No exact duplicate found for **stale `?buildId` on Vercel ISR client nav after revalidation**. Closest related work:

### Same layer (`_payload.json` URL + cache busting)

- [nuxt/nuxt#15427](https://github.com/nuxt/nuxt/issues/15427) → [PR #26068](https://github.com/nuxt/nuxt/pull/26068) — original stale `_payload.json` reports; added `?buildId` for deploy cache busting. [@danielroe noted](https://github.com/nuxt/nuxt/issues/15427) hashes would conflict with ISR revalidation; [@pi0 noted](https://github.com/nuxt/nuxt/issues/15427) payloads should follow the same caching as the page URL.
- [nuxt/nuxt#34496](https://github.com/nuxt/nuxt/issues/34496) (open) — payload extraction drops query params on ISR/SWR routes; [PR #34751](https://github.com/nuxt/nuxt/pull/34751) moves to named `?_b=` param. Sibling URL-construction bug, different symptom (wrong payload for `?page=2`, not stale after ISR TTL).

### Stale payload on cached routes (different mechanism)

- [nuxt/nuxt#34189](https://github.com/nuxt/nuxt/issues/34189) — SWR disk cache not invalidating on 404/unpublish
- [nitrojs/nitro#4060](https://github.com/nitrojs/nitro/pull/4060) — open fix for Nitro v2 SWR invalidation
- [unjs/ocache#9](https://github.com/unjs/ocache/pull/9) — merged; same idea for Nitro v3 / ocache

### Same area, different bugs

| Issue | What it is |
|-------|------------|
| [nitro#4047](https://github.com/nitrojs/nitro/issues/4047) / [nuxt-security#678](https://github.com/Baroshem/nuxt-security/issues/678) | `_payload.json-isr` **404** (often nuxt-security), not stale |
| [nuxt#33316](https://github.com/nuxt/nuxt/issues/33316) / [nitro#3595](https://github.com/nitrojs/nitro/pull/3595) | Direct ISR nav → `/{url}-isr` **404** |
| [nuxt#34856](https://github.com/nuxt/nuxt/issues/34856) | SWR payload reviver crash when `payload.data` undefined |
| [nuxt#34961](https://github.com/nuxt/nuxt/issues/34961) | Dev-only ENOTDIR for `/` payload cache (fixed) |

## Links

- [Nuxt 4.4 payload handling](https://nuxt.com/blog/v4-4)
- [PR #34410](https://github.com/nuxt/nuxt/pull/34410) (`payloadExtraction: 'client'` — fixes first-load double-fetch, not client-nav stale cache)
- [PR #33467](https://github.com/nuxt/nuxt/pull/33467) (ISR/SWR payload extraction)
