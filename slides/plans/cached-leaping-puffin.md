# NEXUS Keynote Presentation — Implementation Plan

## Context

Build a 16-slide premium keynote presentation for NEXUS, an AI Operating System for Creative Enterprises. The brief demands Apple-launch sophistication: dark ground (#0B0B0F), teal accent (#4FD1C5), Geist typeface, large type, ample whitespace, subtle motion, and a cinematic narrative arc. The NEXUS emblem is a geometric four-pointed star mark (white on black) — displayed large on opening/closing slides, small lower-right on content slides.

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/App.tsx` | Full implementation — all 16 slides, navigation, animations |
| `src/styles/fonts.css` | Google Fonts import for Geist |
| `src/styles/theme.css` | Update tokens to NEXUS dark palette |

---

## Design Tokens (theme.css updates)

Override `:root` only — the `.dark` block and `@theme inline` mappings stay intact.

```css
--background: #0B0B0F;
--foreground: #F4F4F5;
--card: #15151B;
--card-foreground: #F4F4F5;
--primary: #4FD1C5;
--primary-foreground: #0B0B0F;
--secondary: #1E1E26;
--secondary-foreground: #A1A1AA;
--muted: #1E1E26;
--muted-foreground: #A1A1AA;
--accent: #4FD1C5;
--accent-foreground: #0B0B0F;
--border: rgba(255,255,255,0.08);
--ring: #4FD1C5;
--radius: 0.75rem;
```

---

## Font (fonts.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap');
```

Apply globally: `font-family: 'Geist', 'Inter', sans-serif` on `:root`.

---

## Architecture: App.tsx

### State
```ts
const [current, setCurrent] = useState(0)     // 0–15
const [direction, setDirection] = useState(1)  // 1=forward, -1=backward
```

### Navigation
- `←` / `→` keyboard events on `window`
- `<` `>` arrow buttons (visible on hover at viewport edges)
- Slide dots at bottom center (16 dots)
- Slide counter `"05 / 16"` bottom-center above dots

### Transitions (motion/react)
- `AnimatePresence` wrapping active slide with `mode="wait"`
- `initial={{ opacity: 0, x: direction * 60 }}`
- `animate={{ opacity: 1, x: 0 }}`  
- `exit={{ opacity: 0, x: direction * -60 }}`
- `transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}`
- Within each slide: staggered `motion.div` children with increasing `delay`

### Persistent Shell
```
<div class="w-screen h-screen overflow-hidden bg-[#0B0B0F]">
  <AnimatePresence>  →  active slide
  </AnimatePresence>
  <nav: dots + counter>
  <arrow buttons>
</div>
```

### Emblem usage
```tsx
import nexusEmblem from "@/imports/NEXUS-_-EMBLEM.jpeg"
// Large slides (0, 15): <ImageWithFallback src={nexusEmblem} className="w-48 h-48 object-contain" />
// Content slides (1–14): <ImageWithFallback src={nexusEmblem} className="w-8 h-8 object-contain absolute bottom-8 right-10" />
```

---

## Slide Designs

### Slide 01 — Opening
- Full `#0B0B0F` background
- Center column: emblem 192×192, wordmark "NEXUS" in tracking-widest uppercase below
- Main headline: `text-[80px] font-light leading-tight` — "The Operating System Behind Every Creative Enterprise."
- No emblem in corner (it's the hero)

### Slide 02 — The Problem
- Label: "THE PROBLEM" in accent teal, small caps
- 4 pain cards in 2×2 grid: "17 tools, zero context" / "Knowledge lives in inboxes" / "Talent invisible until burnout" / "Decisions made on gut, not data"
- Each card: `bg-[#15151B]` surface, left border in `#4FD1C5/30`, single-line stat + descriptor

### Slide 03 — Why Existing Software Falls Short
- Left half: label + headline "Built for tasks. Not for intelligence."
- Right half: vertical comparison list — 5 rows of "What tools do / What you need", split by hairline

### Slide 04 — Introducing NEXUS
- Center: "NEXUS" at 120px, subtitle "The Intelligence Layer"
- Below: 5 orbital nodes in a horizontal row connected by `border-t` hairlines
  - People · Projects · Clients · Knowledge · Operations
  - Each node: circle with lucide icon + label beneath

### Slide 05 — Mission Control
- Headline top-left: "Mission Control"
- Dashboard mockup: 3 KPI cards (Active Projects: 47, Revenue at Risk: $2.1M, Team Utilization: 84%), recharts AreaChart for pipeline, small recharts BarChart for capacity

### Slide 06 — Core Intelligence
- Left: "Core" in 96px, "The AI Engine at the Heart of Everything"
- Right: Animated recommendation cards sliding in (3 items): "Aria Chen is approaching capacity — redistribute 2 tasks", "Client Meridian Group last contacted 14 days ago — follow up recommended", "Project Aurora is 12 days behind trajectory"

### Slide 07 — Projects
- Headline: "Projects" + "Intelligent from kickoff to close"
- Mockup: project timeline with phase bars, status chips (On Track / At Risk), AI insight strip at bottom

### Slide 08 — People
- Headline: "People" + "See your team clearly"
- 4 team member cards with utilization bars (0–100%), burnout risk indicator dots, role tags

### Slide 09 — Clients
- Headline: "Clients" + "Relationships, not just records"
- 3 client rows: logo placeholder circle, last contact date, relationship health score (%), open items count

### Slide 10 — Knowledge
- Headline: "Knowledge" + "Your organization never forgets"
- Search bar mockup with semantic query "What did we learn from the Apex rebranding project?" and 3 result cards below with source + excerpt

### Slide 11 — Automation
- Headline: "Automation" + "Intelligence in motion"
- Flow diagram: 4 nodes connected by animated dashed arrows: Trigger → Condition → Action → Outcome
- 3 example workflow cards below

### Slide 12 — Architecture
- Headline: "Architecture" + "Built for enterprise scale"
- 4-layer stack diagram (horizontal bands): Presentation Layer / Intelligence Layer / Data Layer / Infrastructure Layer
- Each band: label left, tech names right, subtle left-border in accent

### Slide 13 — Technology
- Headline: "Technology" + "The stack behind NEXUS"
- 4-column grid: Frontend / Backend / AI / Infrastructure
- Each column: header + 4-5 tech pills (`bg-[#1E1E26]`, mono font)

### Slide 14 — Business Impact
- 4 large metric cards in 2×2 grid
- Each: giant number in accent teal (`text-[96px] font-bold`), label below
  - +47% On-time delivery / −31% Client churn / 3.2× Knowledge reuse / 18hrs saved per manager/week

### Slide 15 — Vision
- Single centered block
- "The Future" label in accent
- One paragraph (3 sentences) vision copy
- Ambient: very subtle radial glow behind text using `box-shadow` or a positioned div with blur

### Slide 16 — Closing
- Mirror of slide 1: large emblem, no corner badge
- "One Platform. Infinite Possibilities." at 80px
- Subheadline: "The Operating System for Creative Enterprises." in muted gray
- Small "nexus.ai" hint at very bottom

---

## Implementation Notes

- **No router needed** — single-page with state
- **Slide aspect ratio**: slides are `w-screen h-screen` but content is constrained inside a `max-w-[1440px] mx-auto px-24 py-20` container to preserve the 1920×1080 composition feel
- **Recharts** for slides 5 (AreaChart + BarChart) — use `#4FD1C5` for fill with 20% opacity area
- **No lorem ipsum** — all copy is real, contextual, NEXUS-branded
- **motion/react** for slide transitions and staggered reveals; CSS transitions for micro-interactions (hover states on cards, nav dots)
- **Emblem**: never recolored, rotated, distorted — always `object-contain`, white on black, displayed at native proportions

---

## Verification

1. App renders without errors on `npm run dev`
2. Arrow keys and click navigation cycle through all 16 slides
3. Transitions are smooth (no jank, no flash)
4. Emblem appears large on slides 1 + 16, small bottom-right on slides 2–15
5. Recharts render on slide 5 (Mission Control) with meaningful data
6. All text passes AA contrast against dark backgrounds
