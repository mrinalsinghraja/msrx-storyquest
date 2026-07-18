# MSRX StoryQuest

Mobile-first branching STEM stories for middle-school learners. Every learner choice and simulator adjustment exists only in browser memory and is lost on refresh. The app stores no learner data, creates no cookies, and includes no analytics or telemetry.

## Design system

StoryQuest follows the MSRX house style used by the portal (`www.msrx.co.in`) and the sibling apps —
QR Studio, GraphIQ, JEE HyperLab. Light-only, no dark mode.

| Token | Value |
| --- | --- |
| Background / surface | `#ffffff` / `#f5f5f7` |
| Text | `#1d1d1f` → `#6e6e73` → `#a1a1a6` |
| Accent gradient | `#00c4df` → `#8b5cf6` |
| Typeface | Inter |

Tokens live in `app/globals.css` and mirror the portal's `:root` block, along with the shared
`msrx-gradient`, `msrx-gradient-text`, `nav-blur` and `card-hover` utilities. `components/MSRXLogo.jsx`
is a verbatim port of the portal mark — change it in the portal first, then re-port, so the brand
never drifts between apps.

The lab canvas is light too. That follows JEE HyperLab, which renders its simulations on white with
cyan/purple data ink; a dark canvas would have made StoryQuest the only MSRX app that looks different.

## How a mission works

Each of the 100 missions is built from three separate pieces.

**The equation** (`lib/models.js`) — every mission carries a real relationship with real dimensioned quantities. The slider is always 0-100 for thumb consistency, but it maps onto an actual variable (metres, ohms, µmol/L, °C), and both sides of the equation are computed and shown live. The balance point is *solved from the equation* — never picked to look plausible — and the gate that lets a learner advance is decided by the quantities agreeing within a tolerance expressed in their own unit. This is why the answer to "torque balance" is 2.4 m and not "somewhere near the middle".

**The topic** (`lib/topics/*.js`) — 100 entries, 25 per subject. Each supplies its own equation parameters and its own scenario, crisis, insight and resolution. No two missions share a scenario.

**The shape** (`lib/story-builder.js`) — three story graphs chosen by difficulty tier. They differ in length, in where the branches sit, and in how many gated commits must be cleared, so a Foundation mission is structurally a different experience from a Challenge one.

`lib/story-schema.js` validates every graph: no dangling choices, no unreachable steps, no gated choice on a step without a lab, and at least one reachable ending. `lib/curriculum.js` additionally asserts in development that every mission's answer is reachable on the slider and that no mission starts already balanced.

## Local setup

```bash
cd apps/storyquest
npm install
npm run dev
```

Open `http://localhost:3000`. Other commands:

```bash
npm run build
npm run start
npm run lint
```

## Optional generation

The app is complete without an API key. Setting one adds a "Same problem, new story" action that rewrites a mission's *narrative only*.

Copy `.env.example` to `.env.local` and set `GROQ_API_KEY` to enable it. The model is asked for a fresh scenario, crisis, insight and resolution — never for the equation, the quantities, the tolerance or the answer, all of which stay exactly as authored. A language model cannot be relied on to invent physics that is both correct and solvable on a slider, so it is not asked to; it gets the job it is good at. Invalid or unavailable responses fall back to the authored story, and a missing key returns HTTP 200 rather than an error. Request bodies and model output are never logged.

## Vercel deployment

Import this directory as the Vercel project root (`apps/storyquest`). Set the custom domain to `story.msrx.co.in`; do not change the separate `msrx.co.in` apex portal. Configure this DNS record:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `story` | `cname.vercel-dns.com` | 600 |

The canonical URL is `https://story.msrx.co.in`.
