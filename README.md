# AssistifySteve — Portfolio

> *Simplify. Organize. Automate. Assistified.*

Personal portfolio website for **Stephen Pascua (AssistifySteve)** — IT & Administrative Virtual Assistant, Operations Architect, and TESDA Virtual Assistant Services Level III Coach / Trainer.

## Highlights

- **Global Command Palette (`⌘K` / `Ctrl+K`)** — Keyboard-first modal for instant navigation across portfolio sections, the work archive, and quick actions (copy email, open WhatsApp).
- **Featured Systems & Archive (`#/work`)** — Showcase of engineered tools and AI workflows (*TaskAdjust*, *TaskScript*, *TaskPulse*, *Data Analytics 101*, *A Script 2 Scene*) with animated category filters and a dedicated archive route.
- **Visual Playground** — GSAP `ScrollTrigger` pinned parallax showcase with keyboard-accessible lightbox previews.
- **Tools & Stack Matrix** — Interactive 14-platform proficiency grid covering Microsoft 365, Google Workspace, AI copilots, work management, and CRM ecosystems with category transitions.
- **Client-Side Solution Matcher ("Find Your Fit")** — Algorithmic recommendation engine that maps operational bottlenecks to a service tier, recommended system, and tool stack entirely in the browser with no data stored.
- **Pre-Formatted Contact Brief Builder** — Staggered scroll-reveal inquiry composer that generates ready-to-send briefs for Email, WhatsApp, or Viber alongside one-click copy and direct action channels.
- **Deliberate Navigation & Motion Craft** — Fixed pill header with synchronized scroll-spy (including active `Contact` state), thin spring-animated horizontal reading progress bar, CSS proximity scroll snapping, floating bottom-right section stepper controls, magnetic cursor, and full `prefers-reduced-motion` support.
- **SEO & Structured Data** — OpenGraph/Twitter meta tags and Schema.org `Person` + `ProfessionalService` JSON-LD embedded in `index.html`.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 (`base: './'` for subpath-safe static hosting)
- **Routing**: React Router (`HashRouter` for zero-config GitHub Pages routing)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation**: Framer Motion & GSAP (`ScrollTrigger`)
- **Icons**: Lucide React
- **Testing**: Node built-in test runner (`node:test`) via `tsx`

## Project Structure

```text
├── .github/workflows/
│   └── deploy.yml          # Automated build & deploy to GitHub Pages
├── public/
│   ├── assets/             # Static icons, portrait, logo, and background video
│   └── favicon.ico
├── src/
│   ├── assets/images/      # Bundled project showcase artwork
│   ├── components/         # Page sections, header, command palette, motion helpers
│   ├── data/               # Portfolio copy, services, tools, and visual asset map
│   ├── types/              # Shared TypeScript interfaces
│   ├── utils/              # Pure logic modules & unit tests (*.test.ts)
│   ├── App.tsx             # Route definitions and landing layout
│   ├── index.css           # Theme tokens, typography, and scroll-snap rules
│   └── main.tsx            # Application entry point (HashRouter)
├── index.html              # HTML entry, fonts, SEO meta, and JSON-LD
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- **Node.js** `20+` (matches the GitHub Actions workflow)
- **npm** `10+`

### Installation & Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

The development server runs at `http://localhost:3000`.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite development server on port `3000` |
| `npm run build` | Build the production static bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run strict TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Remove build output (`dist/`) |

### Running Unit Tests

Pure logic modules (`navigation`, `stickySection`, `commandPalette`, `recommender`, and `cursorPhysics`) are verified with Node's native test runner:

```bash
npx tsx --test src/utils/*.test.ts
```

## Deployment (GitHub Pages)

This repository is preconfigured for automated deployment via GitHub Actions (`.github/workflows/deploy.yml`):

1. Push to the `main` branch (or trigger **Actions → Deploy Vite to GitHub Pages → Run workflow** manually).
2. In your GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow installs dependencies, builds `dist/` with relative asset paths (`base: './'`), and publishes via `actions/deploy-pages`.

Because the app uses `HashRouter` and relative `./assets/...` paths, all routes (including `#/work`) and media assets load reliably on both `https://<username>.github.io/<repo>/` subpaths and custom domains.

## Contact

- **Email**: [steve@webvi.be](mailto:steve@webvi.be)
- **LinkedIn**: [linkedin.com/in/assistifysteveph](https://www.linkedin.com/in/assistifysteveph)
- **Upwork**: [Upwork Profile](https://www.upwork.com/freelancers/~010762ea62e477008c)
- **Facebook**: [facebook.com/Assistify.Steve.PH](https://www.facebook.com/Assistify.Steve.PH)
- **Instagram**: [instagram.com/assistify.steve.ph](https://www.instagram.com/assistify.steve.ph/)
