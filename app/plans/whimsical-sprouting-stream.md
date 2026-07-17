# NEXUS — AI Operating System for Creative Businesses

## Context

Build a premium dark-mode desktop web app called NEXUS: an AI Operating System for Creative Businesses. Inspired by Apple, Linear, Arc, Notion Calendar, and Stripe. 8 pages: Dashboard, Projects, Talent, Clients, Analytics, Core (AI chat), Notifications, Settings. The app uses React Router v7, Recharts, Motion animations, shadcn/ui components, and Lucide icons. The NEXUS emblem JPEG is already in `src/imports/NEXUS-_-EMBLEM.jpeg`.

---

## Design Tokens

| Token | Value |
|---|---|
| Background | `#0B0B0F` |
| Surface | `#15151B` |
| Surface hover | `#1E1E26` |
| Border | `rgba(255,255,255,0.06)` |
| Primary text | `#F4F4F5` |
| Secondary text | `#A1A1AA` |
| Accent cyan | `#4FD1C5` |
| Warning gold | `#FFB547` |
| Success emerald | `#22C55E` |
| Danger | `#FF6B6B` |

Font: Inter via Google Fonts. Motion import: `import { motion } from 'motion/react'`.

---

## File Structure to Create

```
src/styles/fonts.css                             # Add Inter Google Fonts import
src/styles/theme.css                             # Append NEXUS tokens to :root
src/app/App.tsx                                  # RouterProvider entrypoint
src/app/data/types.ts                            # TypeScript interfaces
src/app/data/mockData.ts                         # All static mock data
src/app/components/layout/RootLayout.tsx         # Sidebar + Outlet shell
src/app/components/layout/Sidebar.tsx            # 240px left nav
src/app/components/layout/PageShell.tsx          # Scroll + motion page wrapper
src/app/components/shared/KPICard.tsx            # Metric card with icon + trend
src/app/components/shared/RiskBadge.tsx          # Low/Medium/High badge
src/app/components/shared/AIChip.tsx             # Cyan AI recommendation chip
src/app/components/shared/HealthDot.tsx          # Pulsing status dot
src/app/components/shared/WorkloadRing.tsx       # SVG radial progress ring
src/app/components/shared/TeamAvatarStack.tsx    # Overlapping avatar group
src/app/components/charts/RevenueAreaChart.tsx   # AreaChart with gradient
src/app/components/charts/CompletionBarChart.tsx # BarChart completed vs target
src/app/components/charts/UtilizationRadialChart.tsx # RadialBarChart by dept
src/app/components/charts/SatisfactionLineChart.tsx  # LineChart with target ref
src/app/components/charts/MiniAreaChart.tsx      # Small 120px dashboard preview
src/app/components/pages/DashboardPage.tsx
src/app/components/pages/ProjectsPage.tsx
src/app/components/pages/TalentPage.tsx
src/app/components/pages/ClientsPage.tsx
src/app/components/pages/AnalyticsPage.tsx
src/app/components/pages/CorePage.tsx
src/app/components/pages/NotificationsPage.tsx
src/app/components/pages/SettingsPage.tsx
```

---

## Implementation Steps

### 1. Fonts & Theme
- `fonts.css`: Add `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap')` + set `--font-sans: 'Inter'` on body
- `theme.css`: Append NEXUS CSS custom properties to the existing `:root` block (do NOT replace shadcn tokens). Add: `--nexus-bg`, `--nexus-surface`, `--nexus-surface-hover`, `--nexus-border`, `--nexus-cyan`, `--nexus-gold`, `--nexus-emerald`, `--nexus-danger`, `--nexus-cyan-dim`, `--nexus-cyan-border`. Also override `--background: #0B0B0F` and `--card: #15151B` and `--foreground: #F4F4F5`

### 2. Data Layer
- `types.ts`: Interfaces for `Project`, `Employee`, `Client`, `Notification`, `KPI`, `ChatMessage`, `ChartDataPoint`
- `mockData.ts`: 6 projects, 6 employees, 6 clients, 8 notifications, chart arrays for revenue/completion/utilization/satisfaction, 3 pre-loaded chat messages, 4 suggested prompts

### 3. Routing
- `App.tsx`: `<RouterProvider router={router} />` using `createBrowserRouter`
- Routes: `/` = Dashboard, `/projects`, `/talent`, `/clients`, `/analytics`, `/core`, `/notifications`, `/settings`
- All nested under `RootLayout` with `<Outlet />`

### 4. Layout Shell
- `RootLayout.tsx`: `flex h-screen w-screen` — Sidebar (240px fixed) + `<main flex-1>` with `<Outlet />`
- `Sidebar.tsx`: 
  - Top: NEXUS emblem logo (import JPEG as relative path from `../../../imports/NEXUS-_-EMBLEM.jpeg`, render in 36px rounded circle) + "NEXUS" wordmark
  - Nav items with `<NavLink end>` for dashboard — active state: left border `3px solid #4FD1C5` + bg `rgba(79,209,197,0.08)` + text cyan
  - Notifications item: show unread badge (small cyan circle with `3`)
  - Bottom: Avatar circle "SC" + "Sarah Chen / Creative Director" + workspace name
  - Motion: `whileHover={{ x: 2 }}` on each nav item
- `PageShell.tsx`: Wraps each page's scrollable area with entrance animation `initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}`

### 5. Shared Components

**KPICard**: Surface card (`#15151B`, border `rgba(255,255,255,0.06)`), icon in tinted circle, large value text, change indicator with TrendingUp/Down icon. Motion: `whileHover={{ y: -2 }}`.

**RiskBadge**: `level: 'low'|'medium'|'high'` → colored pill using inline styles (no shadcn Badge to avoid color overrides).

**AIChip**: Cyan pill `rgba(79,209,197,0.08)` bg, `rgba(79,209,197,0.2)` border, ✦ prefix icon.

**HealthDot**: 8px circle + pulsing ring via `motion animate={{ scale: [1,1.4,1], opacity: [1,0,1] }} transition={{ repeat: Infinity }}`.

**WorkloadRing**: SVG circle with `strokeDasharray` for radial fill. `#4FD1C5` stroke on `rgba(255,255,255,0.06)` track. Center label.

**TeamAvatarStack**: Overlapping Avatar circles (each -8px margin), max 3 shown then `+N` remainder.

### 6. Chart Components

All use `ResponsiveContainer width="100%" height={280}`. Custom dark tooltip component in each chart file.

- **RevenueAreaChart**: `AreaChart` with two areas (`revenue` solid cyan, `forecast` dashed 40% opacity). `<linearGradient>` for fill fade.
- **CompletionBarChart**: `BarChart` — `completed` cyan bars, `target` dim bars. `radius={[4,4,0,0]}`.
- **UtilizationRadialChart**: `RadialBarChart` for 6 departments. Colors: `['#4FD1C5','#22C55E','#FFB547','#FF6B6B','#A78BFA','#60A5FA']`.
- **SatisfactionLineChart**: `LineChart` single cyan line. `ReferenceLine` at y=4.5 gold dashed "target".
- **MiniAreaChart**: 120px height, no axes/grid. Silhouette preview only.

### 7. Pages

**DashboardPage**:
- Header: "Good Morning, Sarah." (text-3xl semibold) + "Everything is running smoothly." (secondary) + date chip
- 4 KPI cards in `grid-cols-4` with staggered entrance animation
- Two-column row: "Core Intelligence" panel (60%) + mini chart card (40%)
- Core Intelligence: 3 insight items with colored dots + "Apply Recommendation" cyan-bordered button
- Project timeline list: 4 projects with Progress component + deadline + % label

**ProjectsPage**:
- Filter bar: Search Input + Sort Select + status filter pills + "New Project" cyan button
- `grid-cols-3` of project cards: name, client, RiskBadge, Progress bar, TeamAvatarStack, deadline, AIChip
- `whileHover={{ borderColor: 'rgba(79,209,197,0.2)' }}` on each card

**TalentPage**:
- `grid-cols-3` employee cards: colored initials avatar, name/role, availability badge, WorkloadRing, skills chips, performance star rating, burnout progress bar, AI compatibility score

**ClientsPage**:
- `grid-cols-2` client cards: colored initials circle, name, HealthDot, 4-metric grid, AIChip follow-up suggestion
- Search + filter tabs at top

**AnalyticsPage**:
- Top KPI bar: 4 compact metric chips in a surface strip
- Prediction card: revenue forecast `+18.5%` in emerald, 90-day label
- Charts grid: RevenueAreaChart (col-span-2), CompletionBarChart | SatisfactionLineChart, UtilizationRadialChart (col-span-2)

**CorePage** (AI Chat):
- Full-height flex column
- Chat history area with ScrollArea: 3 pre-loaded message pairs (user right-aligned, Core left with cyan left-border card + structured bullets)
- Suggested prompts chips above input (fade out when user starts typing)
- Sticky bottom input: large rounded dark input, Send button, `⌘ Enter` hint
- Motion: each message `initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}` with stagger

**NotificationsPage**:
- Header + unread count badge + "Mark all read" button
- shadcn Tabs: All / Projects / Deadlines / Clients / Invoices / Risks
- Notification rows: colored icon circle (category-specific), title (bold if unread), message, timestamp, action link, unread dot

**SettingsPage**:
- Vertical shadcn Tabs (or top-tabs): Profile, Organization, Integrations, Security, AI Preferences, Theme
- Profile: avatar placeholder + Input fields + Select for role/timezone + Save button
- AI Preferences: Switch toggles for all AI features + Slider for confidence threshold
- Theme: accent color swatches (cyan selected) + dark/light toggle

### 8. Color Application Pattern
- Tailwind arbitrary values for static colors: `bg-[#0B0B0F]`, `text-[#4FD1C5]`, `text-[#A1A1AA]`
- Inline `style` prop for rgba and dynamic values: `style={{ background: 'rgba(79,209,197,0.08)' }}`
- CSS vars from theme.css: `style={{ borderColor: 'var(--nexus-cyan)' }}`
- Never override shadcn component internal class chains — apply colors to wrapper divs instead

---

## Key Implementation Notes

- **NEXUS emblem**: Import as `import nexusEmblem from '../../../imports/NEXUS-_-EMBLEM.jpeg'` (relative path from Sidebar). Render with `<ImageWithFallback>`.
- **NavLink active state**: Use `end` prop on Dashboard link. Apply active styles via `className` callback: `({ isActive }) => ...`
- **Motion import**: Always `import { motion } from 'motion/react'` (NOT `framer-motion`)
- **Recharts tooltips**: Custom dark tooltip component via `content={<CustomTooltip />}` on each chart
- **shadcn Tabs active state in dark**: Override via `data-[state=active]:bg-[#1E1E26] data-[state=active]:text-[#4FD1C5]` on `TabsTrigger`
- **No BrowserRouter** — use `createBrowserRouter` from `react-router` (v7 Data mode)

---

## Verification

1. All 8 nav items route correctly with active sidebar state
2. Dashboard loads with KPI cards, Core Intelligence panel, timeline, mini chart
3. Analytics page renders all 4 Recharts charts without errors
4. Core page shows chat history and input, suggested prompts chips
5. Settings tabs all render their forms
6. All cards/rows show hover states with motion transitions
7. NEXUS emblem renders in sidebar (or falls back gracefully)
8. Dark background `#0B0B0F` visible throughout, no white flash
