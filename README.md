# ListingLift — One-Click (Vercel-Only)

This is a single Next.js app with **built-in API routes**. You deploy **only on Vercel**, set one env var, and you're live.

## What it does
- `/api/health` — returns `{ ok: true }`
- `/api/copy` — POST JSON with property facts; returns listing description + bullets + captions (uses OpenAI)
- `/api/enhance` — POST multipart form-data with `image`; returns enhanced JPG (Sharp)

## Deploy (simple)
1. Create a GitHub repo (e.g., `listinglift-oneclick`) and upload **all files from this folder** to the repo **root**.
2. Go to Vercel → **Add New Project** → import your repo.
3. When asked for env vars, add: `OPENAI_API_KEY = sk-...`
4. Deploy.

## Test
- `GET /api/health` → `{ "ok": true }`
- `POST /api/copy` (JSON): 
  ```json
  {"facts": {"beds": 3, "baths": 2, "sqft": 1400, "neighborhood": "Mid-City"}, "tone": "professional"}
  ```
- `POST /api/enhance` (multipart): key `image` = a JPG/PNG file

## Local dev
```bash
npm i
npm run dev
```
Open http://localhost:3000
