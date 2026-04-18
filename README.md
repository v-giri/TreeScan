 TreeScan
A Cross-Platform Progressive Web App for AI-Driven Plant Species Identification & Plant Health Diagnostics.
What it does
TreeScan lets home gardeners take or upload a photo of any plant or tree and instantly receive:
Species identification (common name, scientific name, family)
Health status — Healthy, Warning, or Critical
Detected diseases, pests, or deficiencies
Step-by-step treatment recommendations
Full care profile (watering, sunlight, soil, fertilizer)
Tech Stack
Frontend — React 18, Vite 5, TypeScript, Tailwind CSS, Framer Motion
Auth — Supabase Auth (Google OAuth + Email/Password)
AI — Plant.id v3 API (species + disease detection) + Gemini 1.5 Flash (treatment + care)
Backend — Supabase Edge Functions (Deno runtime)
Database — Supabase PostgreSQL with Row-Level Security
Storage — Supabase Storage Buckets
PWA — Workbox 7, Service Worker, Web App Manifest
Hosting — Vercel       project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
