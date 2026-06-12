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

## Related upstream (different root cause)

Adjacent stale-payload/cache work — **SWR disk cache not invalidating on 404**, not Vercel ISR + `?buildId` client nav:

- [nuxt/nuxt#34189](https://github.com/nuxt/nuxt/issues/34189) — stale HTML + payload when CMS page unpublished
- [nitrojs/nitro#4060](https://github.com/nitrojs/nitro/pull/4060) — open fix for Nitro v2 SWR invalidation
- [unjs/ocache#9](https://github.com/unjs/ocache/pull/9) — merged; same idea for Nitro v3 / ocache

## Links

- [Nuxt 4.4 payload handling](https://nuxt.com/blog/v4-4)
- [PR #34410](https://github.com/nuxt/nuxt/pull/34410) · [PR #33467](https://github.com/nuxt/nuxt/pull/33467)
