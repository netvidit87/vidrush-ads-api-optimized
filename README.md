# VidRush

Free and simple video hosting (React + Vite + Cloudflare Pages).

## Fitur

- Upload video via proxy ke videy.co
- **Video src otomatis** pakai domain Cloudflare kamu  
  Contoh: `https://cdn.vidrush-cdn-h.pages.dev/bs1c1rXf1.mp4`
- **Iklan load dari API sendiri** (`/api/ad_type`) – format sama seperti videy.co
  - Hanya 3 iklan yang dikonfigurasi di `functions/api/ad_type.js`
  - Rotasi berdasarkan `ad_group` (1-100)

## Setup

```bash
npm install
npm run dev
```

## Build & Deploy (Pages)

```bash
npm run build
npx wrangler pages deploy dist --project-name=vidrush-cdn-h
```

## Setup CDN subdomain (penting)

Agar `https://cdn.vidrush-cdn-h.pages.dev/xxx.mp4` bekerja:

1. Deploy worker CDN:
   ```bash
   cd worker
   npx wrangler deploy
   ```

2. Di Cloudflare Dashboard → Workers & Pages → worker `vidrush-cdn`  
   → Settings → Domains & Routes → Add Custom Domain / Route:
   - `cdn.vidrush-cdn-h.pages.dev`

   Atau kalau pakai custom domain sendiri, set `cdn.yourdomain.com` ke worker yang sama.

Setelah itu video player akan otomatis request ke:
```
https://cdn.<hostname-pages-dev-kamu>/<id>.mp4
```

## Structure

- `src/pages/` — Home, VideoPlayer, Terms, Privacy, Report
- `src/config.js` — logic dynamic CDN berdasarkan hostname
- `functions/api/upload.js` — proxy upload ke Videy
- `functions/api/ad_type.js` — ads API (3 iklan saja, format exo + banner_300x250)
- `worker/video-proxy.js` — Worker proxy CDN + upload
- `public/favicon.ico`
