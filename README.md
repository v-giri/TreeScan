TreeScan

A Cross-Platform Progressive Web App for AI-Driven Plant Species Identification & Plant Health Diagnostics.

What it does

-TreeScan lets home gardeners take or upload a photo of any plant or tree and instantly receive:
Species identification (common name, scientific name, family)

-Health status — Healthy, Warning, or Critical
Detected diseases, pests, or deficiencies

-Step-by-step treatment recommendations

-Full care profile (watering, sunlight, soil, fertilizer)

-Tech Stack-Frontend — React 18, Vite 5, 
TypeScript, Tailwind CSS, Framer Motion

-Auth — Supabase Auth (Google OAuth + Email/Password)

-AI — Plant.id v3 API (species + disease detection) + Gemini 1.5 Flash (treatment + care)

-Backend — Supabase Edge Functions (Deno runtime)

-Database — Supabase PostgreSQL with Row-Level Security

-Storage — Supabase Storage Buckets

-PWA — Workbox 7, Service Worker, Web App Manifest

-Hosting — Vercel
