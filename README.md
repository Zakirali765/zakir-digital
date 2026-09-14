# Zakir Digital — A&E Plumbing & Gas 24/7 Preview

Private, one-page client preview for a practical AI receptionist concept. The embedded Botpress widget is the only chat interaction; the conversation shown in the hero is a static UI example.

## Run locally

```bash
npm install
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## Deploy

Netlify and Vercel can deploy this project with the default Vite settings:

- Build command: `npm run build`
- Publish directory: `dist`

The Botpress scripts are intentionally included once in `index.html`, immediately before `</body>`.
