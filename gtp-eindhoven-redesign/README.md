# Glory Tabernacle Parish Eindhoven

Complete source code for the redesigned GTP Eindhoven website.

## Requirements

- Node.js 22.13 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Structure

- `app/`: homepage, About, Events, Gallery, Contact, ANBI and Prayer Request pages
- `public/`: church logo, photographs and social sharing image
- `worker/`: Cloudflare Worker, including the photo gallery API
- `.openai/hosting.json`: sanitized local binding configuration, without the original private Site identifier

The gallery upload feature requires a Cloudflare R2 bucket bound as `BUCKET`. GitHub Pages alone cannot run that server-side upload feature.

The previous church website remains at the root of this repository; this redesigned application is contained in the `gtp-eindhoven-redesign` folder.
