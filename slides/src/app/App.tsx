import { useState, useEffect, useCallback, useContext, createContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, FolderKanban, Building2, BookOpen, Zap, Brain,
  ChevronLeft, ChevronRight, AlertTriangle, TrendingUp,
  BarChart3, Search, ArrowRight, Cpu, Globe,
  Shield, Database, Network, ExternalLink,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import nexusEmblem from "@/imports/NEXUS-_-EMBLEM.jpeg";

// ─── Theme ────────────────────────────────────────────────────────────────────

type Theme = {
  name: string;
  bg: string; surf: string; surf2: string;
  accent: string; text: string; dim: string; muted: string;
  hair: string; tooltipBg: string;
  a08: string; a12: string; a20: string; a30: string; a40: string;
};

const THEMES: Record<string, Theme> = {
  black: {
    name: "Black",
    bg: "#0B0B0F", surf: "#15151B", surf2: "#1E1E26",
    accent: "#4FD1C5", text: "#F4F4F5", dim: "#A1A1AA", muted: "#52525b",
    hair: "rgba(255,255,255,0.07)", tooltipBg: "#1E1E26",
    a08: "rgba(79,209,197,0.08)", a12: "rgba(79,209,197,0.12)",
    a20: "rgba(79,209,197,0.20)", a30: "rgba(79,209,197,0.30)", a40: "rgba(79,209,197,0.40)",
  },
  orange: {
    name: "Orange",
    bg: "#0C0906", surf: "#1A1209", surf2: "#231A0E",
    accent: "#FF6B2B", text: "#F4F4F5", dim: "#B0977A", muted: "#6B5040",
    hair: "rgba(255,255,255,0.07)", tooltipBg: "#231A0E",
    a08: "rgba(255,107,43,0.08)", a12: "rgba(255,107,43,0.12)",
    a20: "rgba(255,107,43,0.20)", a30: "rgba(255,107,43,0.30)", a40: "rgba(255,107,43,0.40)",
  },
  white: {
    name: "White",
    bg: "#F5F5FA", surf: "#EAEAF0", surf2: "#DCDCE8",
    accent: "#1A1A2E", text: "#1A1A2E", dim: "#5C5C80", muted: "#9090AA",
    hair: "rgba(0,0,0,0.07)", tooltipBg: "#EAEAF0",
    a08: "rgba(26,26,46,0.06)", a12: "rgba(26,26,46,0.10)",
    a20: "rgba(26,26,46,0.14)", a30: "rgba(26,26,46,0.20)", a40: "rgba(26,26,46,0.28)",
  },
};

const THEME_CYCLE: Array<keyof typeof THEMES> = ["black", "orange", "white"];

const ThemeCtx = createContext<Theme>(THEMES.black);
const useT = () => useContext(ThemeCtx);

// ─── Data ────────────────────────────────────────────────────────────────────

const pipelineData = [
  { month: "Jan", value: 2.1 }, { month: "Feb", value: 2.8 },
  { month: "Mar", value: 2.4 }, { month: "Apr", value: 3.6 },
  { month: "May", value: 3.1 }, { month: "Jun", value: 4.2 },
  { month: "Jul", value: 3.9 }, { month: "Aug", value: 5.1 },
  { month: "Sep", value: 4.7 }, { month: "Oct", value: 5.8 },
  { month: "Nov", value: 6.2 }, { month: "Dec", value: 7.1 },
];

const capacityData = [
  { team: "Design", used: 94, capacity: 100 },
  { team: "Copy", used: 72, capacity: 100 },
  { team: "Dev", used: 88, capacity: 100 },
  { team: "Strategy", used: 61, capacity: 100 },
  { team: "PM", used: 105, capacity: 100 },
];

// ─── Physics Animation Constants ─────────────────────────────────────────────

// Spring presets
const SPRING_SNAPPY   = { type: "spring" as const, stiffness: 380, damping: 28, mass: 0.8 };
const SPRING_BOUNCY   = { type: "spring" as const, stiffness: 260, damping: 20, mass: 1.0 };
const SPRING_HEAVY    = { type: "spring" as const, stiffness: 180, damping: 22, mass: 1.2 };
const SPRING_BAR      = { type: "spring" as const, stiffness: 100, damping: 22, mass: 0.9 };

// Slide enter/exit variants — 3-axis spring (x, scale) + fast blur fade
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 110 : -110,
    opacity: 0,
    scale: 0.94,
    filter: "blur(14px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -75 : 75,
    opacity: 0,
    scale: 0.97,
    filter: "blur(7px)",
  }),
};

const slideTransition = {
  x:      { ...SPRING_HEAVY },
  scale:  { ...SPRING_HEAVY },
  opacity: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  filter:  { duration: 0.30, ease: [0.4, 0, 0.2, 1] },
};

// ─── Count-Up Hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, { duration = 1.4, delay = 0, decimals = 0 } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(parseFloat((eased * target).toFixed(decimals)));
        if (p < 1) requestAnimationFrame(step);
        else setVal(target);
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [target, duration, delay, decimals]);
  return val;
}

// ─── Shared Components ────────────────────────────────────────────────────────

function SlideLabel({ children }: { children: React.ReactNode }) {
  const t = useT();
  return (
    <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: t.accent }}>
      {children}
    </p>
  );
}

function SlideHeadline({ children, size = "lg" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  const t = useT();
  const sizes = { sm: "text-4xl", md: "text-5xl", lg: "text-6xl", xl: "text-7xl" };
  return (
    <h1 className={`${sizes[size]} font-light leading-[1.1] tracking-tight`} style={{ color: t.text }}>
      {children}
    </h1>
  );
}

function SlideSubhead({ children }: { children: React.ReactNode }) {
  const t = useT();
  return (
    <p className="text-xl font-light leading-relaxed mt-4" style={{ color: t.dim }}>
      {children}
    </p>
  );
}

type StaggerFrom = "bottom" | "top" | "left" | "right" | "scale";

function Stagger({
  children, delay = 0, from = "bottom",
}: { children: React.ReactNode; delay?: number; from?: StaggerFrom }) {
  const initials: Record<StaggerFrom, object> = {
    bottom: { opacity: 0, y: 30,  scale: 0.97 },
    top:    { opacity: 0, y: -30, scale: 0.97 },
    left:   { opacity: 0, x: -32, scale: 0.97 },
    right:  { opacity: 0, x: 50,  scale: 0.97 },
    scale:  { opacity: 0, scale: 0.78 },
  };
  return (
    <motion.div
      initial={initials[from]}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{
        ...SPRING_SNAPPY,
        delay,
        opacity: { duration: 0.32, ease: "easeOut", delay },
      }}
    >
      {children}
    </motion.div>
  );
}

function EmblemCorner() {
  const t = useT();
  return (
    <motion.div
      className="absolute bottom-8 right-10 opacity-50"
      animate={{ y: [0, -7, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <ImageWithFallback
        src={nexusEmblem}
        alt="NEXUS emblem"
        className="w-7 h-7 object-contain"
        style={t.name === "White" ? { filter: "invert(1) brightness(0.4)" } : undefined}
      />
    </motion.div>
  );
}

function SlideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-24 py-20 max-w-[1440px] mx-auto">
      {children}
      <EmblemCorner />
    </div>
  );
}

function ThemeToggle({ themeKey, onToggle }: { themeKey: string; onToggle: () => void }) {
  const t = useT();
  const icons: Record<string, string> = { black: "◼", orange: "◈", white: "◻" };
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.92 }}
      className="absolute top-5 right-5 flex items-center gap-2 rounded-full px-3 py-1.5 z-20"
      style={{
        background: t.surf,
        border: `1px solid ${t.hair}`,
        color: t.accent,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        boxShadow: `0 2px 12px rgba(0,0,0,0.18)`,
      }}
    >
      <motion.span
        key={themeKey}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ ...SPRING_BOUNCY }}
      >
        {icons[themeKey]}
      </motion.span>
      {t.name}
    </motion.button>
  );
}

// ─── Slides ───────────────────────────────────────────────────────────────────

function Slide01Opening() {
  const t = useT();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20">
      <Stagger delay={0} from="top">
        <div className="flex justify-center mb-10">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          >
            <ImageWithFallback
              src={nexusEmblem}
              alt="NEXUS emblem"
              className="w-44 h-44 object-contain"
              style={t.name === "White" ? { filter: "invert(1) brightness(0.3)" } : undefined}
            />
          </motion.div>
        </div>
      </Stagger>
      <Stagger delay={0.15}>
        <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase mb-10"
           style={{ color: t.accent }}>
          NEXUS
        </p>
      </Stagger>
      <Stagger delay={0.3}>
        <h1 className="text-center text-[72px] font-light leading-[1.1] tracking-tight max-w-4xl mx-auto"
            style={{ color: t.text }}>
          The Operating System Behind Every Creative Enterprise.
        </h1>
      </Stagger>
    </div>
  );
}

function Slide02Problem() {
  const t = useT();
  const problems = [
    { stat: "17 tools", desc: "Zero shared context between them", icon: <Network size={20} /> },
    { stat: "Inboxes", desc: "Where critical knowledge goes to die", icon: <BookOpen size={20} /> },
    { stat: "Invisible", desc: "Talent burnout is only visible in hindsight", icon: <Users size={20} /> },
    { stat: "Gut feel", desc: "Decisions made without data or foresight", icon: <BarChart3 size={20} /> },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>The Problem</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline>Creative businesses are<br />drowning in disconnection.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-2 gap-4 mt-12 max-w-3xl">
        {problems.map((p, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1}>
            <div className="p-6 rounded-xl border"
                 style={{ background: t.surf, borderColor: t.hair, borderLeft: `2px solid ${t.a30}` }}>
              <div className="flex items-center gap-3 mb-3">
                <span style={{ color: t.accent }}>{p.icon}</span>
                <span className="text-2xl font-semibold" style={{ color: t.text }}>{p.stat}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: t.dim }}>{p.desc}</p>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide03SoftwareFallsShort() {
  const t = useT();
  const rows = [
    { tools: "Manages tasks and deadlines",         need: "Understands project relationships" },
    { tools: "Stores files and documents",           need: "Surfaces relevant knowledge proactively" },
    { tools: "Tracks hours and capacity",            need: "Predicts burnout before it happens" },
    { tools: "Logs client interactions",             need: "Scores and strengthens relationships" },
    { tools: "Runs isolated workflows",              need: "Connects decisions across departments" },
  ];
  return (
    <SlideWrapper>
      <div className="grid grid-cols-2 gap-20 items-start">
        <div>
          <Stagger delay={0}><SlideLabel>Why Existing Software Falls Short</SlideLabel></Stagger>
          <Stagger delay={0.1}>
            <SlideHeadline size="md">Built for tasks.<br />Not for intelligence.</SlideHeadline>
          </Stagger>
          <Stagger delay={0.25}>
            <SlideSubhead>Every tool optimizes for its own silo. Nobody connects the dots.</SlideSubhead>
          </Stagger>
        </div>
        <div className="space-y-0 mt-8">
          <Stagger delay={0.1}>
            <div className="grid grid-cols-2 pb-3 mb-1">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: t.muted }}>What tools do</p>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: t.accent }}>What you need</p>
            </div>
          </Stagger>
          {rows.map((r, i) => (
            <Stagger key={i} delay={0.2 + i * 0.08} from="left">
              <div className="grid grid-cols-2 py-4 border-t" style={{ borderColor: t.hair }}>
                <p className="text-sm pr-4" style={{ color: t.muted }}>{r.tools}</p>
                <p className="text-sm" style={{ color: t.text }}>{r.need}</p>
              </div>
            </Stagger>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function Slide04Introducing() {
  const t = useT();
  const nodes = [
    { icon: <Users size={24} />,       label: "People" },
    { icon: <FolderKanban size={24} />, label: "Projects" },
    { icon: <Building2 size={24} />,   label: "Clients" },
    { icon: <BookOpen size={24} />,    label: "Knowledge" },
    { icon: <Zap size={24} />,         label: "Operations" },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20">
      <Stagger delay={0}><SlideLabel>Introducing NEXUS</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <h1 className="text-center text-[100px] font-light tracking-[-0.02em] leading-none mb-4"
            style={{ color: t.text }}>
          NEXUS
        </h1>
      </Stagger>
      <Stagger delay={0.2}>
        <p className="text-center text-2xl font-light" style={{ color: t.dim }}>
          The Intelligence Layer for Creative Enterprises
        </p>
      </Stagger>
      <div className="flex items-center gap-0 mt-16">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center">
            <Stagger delay={0.3 + i * 0.1} from="scale">
              <div className="flex flex-col items-center gap-3 px-8">
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center border"
                  style={{ background: t.a12, borderColor: t.a40, color: t.accent }}
                  whileHover={{ scale: 1.12, boxShadow: `0 0 24px ${t.a40}` }}
                  transition={SPRING_BOUNCY}
                >
                  {n.icon}
                </motion.div>
                <span className="text-sm font-medium" style={{ color: t.text }}>{n.label}</span>
              </div>
            </Stagger>
            {i < nodes.length - 1 && (
              <motion.div
                className="w-12 h-px"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.38 + i * 0.1, duration: 0.4 }}
                style={{ background: `linear-gradient(90deg, ${t.accent}60, ${t.accent}20)`, transformOrigin: "left" }}
              />
            )}
          </div>
        ))}
      </div>
      <EmblemCorner />
    </div>
  );
}

function Slide05MissionControl() {
  const t = useT();
  const kpis = [
    { label: "Active Projects",  value: "47",   sub: "+3 this week" },
    { label: "Revenue at Risk",  value: "$2.1M", sub: "Needs attention" },
    { label: "Team Utilization", value: "84%",  sub: "PM team at 105%" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Mission Control</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Executive clarity,<br />in real time.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {kpis.map((k, i) => (
          <Stagger key={i} delay={0.2 + i * 0.08}>
            <div className="p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
              <p className="text-xs font-medium tracking-wide uppercase mb-2" style={{ color: t.dim }}>{k.label}</p>
              <p className="text-4xl font-semibold mb-1" style={{ color: t.text }}>{k.value}</p>
              <p className="text-xs" style={{ color: t.accent }}>{k.sub}</p>
            </div>
          </Stagger>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4 mt-4">
        <Stagger delay={0.4}>
          <div className="col-span-3 p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
            <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: t.dim }}>Revenue Pipeline — 2025</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={pipelineData}>
                <defs>
                  <linearGradient id="nexusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={t.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={t.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: t.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: t.tooltipBg, border: "none", borderRadius: 8, color: t.text, fontSize: 12 }} formatter={(v: number) => [`$${v}M`, "Pipeline"]} />
                <Area type="monotone" dataKey="value" stroke={t.accent} strokeWidth={2} fill="url(#nexusGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Stagger>
        <Stagger delay={0.48}>
          <div className="col-span-2 p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
            <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: t.dim }}>Team Capacity</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={capacityData} barSize={8}>
                <XAxis dataKey="team" tick={{ fill: t.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: t.tooltipBg, border: "none", borderRadius: 8, color: t.text, fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Utilized"]} />
                <Bar dataKey="used" fill={t.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Stagger>
      </div>
    </SlideWrapper>
  );
}

function Slide06CoreIntelligence() {
  const t = useT();
  const insights = [
    { type: "Capacity Alert",     msg: "Aria Chen is approaching 105% capacity — redistribute 2 tasks before Thursday.", time: "Just now" },
    { type: "Relationship Risk",  msg: "Meridian Group last contacted 14 days ago. Senior stakeholder has gone silent.", time: "2h ago" },
    { type: "Project Drift",      msg: "Project Aurora is tracking 12 days behind. Three dependencies unresolved.",      time: "4h ago" },
  ];
  return (
    <SlideWrapper>
      <div className="grid grid-cols-2 gap-20 items-center h-full">
        <div>
          <Stagger delay={0}><SlideLabel>Core Intelligence</SlideLabel></Stagger>
          <Stagger delay={0.1}>
            <h1 className="text-[86px] font-light leading-none tracking-tight mb-6" style={{ color: t.text }}>Core</h1>
          </Stagger>
          <Stagger delay={0.2}>
            <SlideSubhead>The AI engine at the heart of everything. Continuously learning, always watching, proactively surfacing what matters.</SlideSubhead>
          </Stagger>
          <Stagger delay={0.3}>
            <div className="flex items-center gap-3 mt-8">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: t.accent }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              />
              <p className="text-sm font-medium" style={{ color: t.accent }}>Active — 847 signals processed today</p>
            </div>
          </Stagger>
        </div>
        <div className="space-y-3">
          {insights.map((ins, i) => (
            <Stagger key={i} delay={0.25 + i * 0.14} from="right">
              <div className="p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair, borderLeft: `2px solid ${t.accent}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: t.accent }}>{ins.type}</span>
                  <span className="text-xs" style={{ color: t.muted }}>{ins.time}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: t.text }}>{ins.msg}</p>
              </div>
            </Stagger>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function Slide07Projects() {
  const t = useT();
  const projects = [
    { name: "Apex Brand Refresh",       client: "Apex Industries",  phase: "Design",     progress: 68, status: "On Track", due: "Aug 14" },
    { name: "Aurora Campaign",           client: "Stellar Media",    phase: "Production", progress: 34, status: "At Risk",  due: "Jul 29" },
    { name: "Meridian Web Overhaul",    client: "Meridian Group",   phase: "Strategy",   progress: 91, status: "On Track", due: "Aug 2" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Projects</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Intelligent from kickoff<br />to close.</SlideHeadline>
      </Stagger>
      <div className="space-y-3 mt-10 max-w-4xl">
        {projects.map((p, i) => {
          const onTrack = p.status === "On Track";
          const barColor = onTrack ? t.accent : "#f87171";
          return (
            <Stagger key={i} delay={0.2 + i * 0.1}>
              <div className="p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-base font-medium" style={{ color: t.text }}>{p.name}</span>
                    <span className="text-sm ml-3" style={{ color: t.dim }}>{p.client}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full"
                          style={{ background: onTrack ? t.a12 : "rgba(239,68,68,0.12)", color: onTrack ? t.accent : "#f87171" }}>
                      {p.status}
                    </span>
                    <span className="text-xs" style={{ color: t.muted }}>Due {p.due}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: t.a12 }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ ...SPRING_BAR, delay: 0.35 + i * 0.12 }}
                      style={{ background: barColor }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right" style={{ color: t.text }}>{p.progress}%</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: t.surf2, color: t.dim }}>{p.phase}</span>
                </div>
              </div>
            </Stagger>
          );
        })}
      </div>
      <Stagger delay={0.55}>
        <div className="mt-4 p-4 rounded-xl border flex items-start gap-3 max-w-4xl"
             style={{ background: t.a08, borderColor: t.a30 }}>
          <Brain size={16} style={{ color: t.accent, marginTop: 2, flexShrink: 0 }} />
          <p className="text-sm" style={{ color: t.accent }}>
            Core insight: Aurora campaign is at risk due to unresolved asset approvals from the Stellar Media legal team. 3 days of buffer remaining.
          </p>
        </div>
      </Stagger>
    </SlideWrapper>
  );
}

function Slide08People() {
  const t = useT();
  const team = [
    { name: "Aria Chen",    role: "Senior Designer",    utilization: 105, risk: "high",   avatar: "AC" },
    { name: "Marcus Webb",  role: "Creative Director",  utilization: 72,  risk: "low",    avatar: "MW" },
    { name: "Priya Nair",   role: "Copywriter",         utilization: 88,  risk: "medium", avatar: "PN" },
    { name: "James Okafor", role: "Strategist",         utilization: 61,  risk: "low",    avatar: "JO" },
  ];
  const riskColor = { low: t.accent, medium: "#f59e0b", high: "#ef4444" };
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>People</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">See your team<br />with clarity.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-2 gap-4 mt-10 max-w-4xl">
        {team.map((m, i) => {
          const rc = riskColor[m.risk as keyof typeof riskColor];
          const barBg = m.utilization > 100 ? "#ef4444" : m.utilization > 85 ? "#f59e0b" : t.accent;
          return (
            <Stagger key={i} delay={0.2 + i * 0.1}>
              <div className="p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                       style={{ background: t.a20, color: t.accent }}>
                    {m.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: t.text }}>{m.name}</p>
                    <p className="text-xs" style={{ color: t.dim }}>{m.role}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: rc }} />
                    <span className="text-xs capitalize" style={{ color: rc }}>{m.risk} risk</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: t.a12 }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(m.utilization, 100)}%` }}
                      transition={{ ...SPRING_BAR, delay: 0.35 + i * 0.1 }}
                      style={{ background: barBg }}
                    />
                  </div>
                  <span className="text-sm font-medium"
                        style={{ color: m.utilization > 100 ? "#ef4444" : t.text }}>
                    {m.utilization}%
                  </span>
                </div>
              </div>
            </Stagger>
          );
        })}
      </div>
    </SlideWrapper>
  );
}

function Slide09Clients() {
  const t = useT();
  const clients = [
    { name: "Apex Industries",  initials: "AI", lastContact: "3 days ago",  health: 92, openItems: 2 },
    { name: "Meridian Group",   initials: "MG", lastContact: "14 days ago", health: 58, openItems: 7 },
    { name: "Stellar Media",    initials: "SM", lastContact: "1 day ago",   health: 85, openItems: 1 },
    { name: "Crest Financial",  initials: "CF", lastContact: "6 days ago",  health: 74, openItems: 4 },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Clients</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Relationships,<br />not just records.</SlideHeadline>
      </Stagger>
      <div className="space-y-3 mt-10 max-w-4xl">
        <Stagger delay={0.15}>
          <div className="grid grid-cols-4 pb-2 px-5">
            {["Client", "Last Contact", "Relationship Health", "Open Items"].map((h) => (
              <p key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: t.muted }}>{h}</p>
            ))}
          </div>
        </Stagger>
        {clients.map((c, i) => {
          const healthColor = c.health > 80 ? t.accent : c.health > 65 ? "#f59e0b" : "#ef4444";
          return (
            <Stagger key={i} delay={0.2 + i * 0.08} from="left">
              <div className="grid grid-cols-4 items-center p-5 rounded-xl border"
                   style={{ background: t.surf, borderColor: t.hair }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                       style={{ background: t.a20, color: t.accent }}>
                    {c.initials}
                  </div>
                  <span className="text-sm font-medium" style={{ color: t.text }}>{c.name}</span>
                </div>
                <span className="text-sm" style={{ color: c.lastContact.includes("14") ? "#f87171" : t.dim }}>{c.lastContact}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: t.a12 }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.health}%` }}
                      transition={{ ...SPRING_BAR, delay: 0.3 + i * 0.08 }}
                      style={{ background: healthColor }}
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: t.text }}>{c.health}%</span>
                </div>
                <span className="text-sm" style={{ color: t.dim }}>{c.openItems} items</span>
              </div>
            </Stagger>
          );
        })}
      </div>
    </SlideWrapper>
  );
}

function Slide10Knowledge() {
  const t = useT();
  const results = [
    { source: "Project Brief — Apex 2023",        excerpt: "Client prioritized sustainability messaging over product specs. Legal required 48h review for all claim-based copy." },
    { source: "Post-mortem — Meridian Rebrand",   excerpt: "Timeline slippage caused by late-stage stakeholder additions. Recommend gating Phase 2 with full sign-off protocol." },
    { source: "Strategy Deck — Stellar Launch",   excerpt: "Target demo skews 28–40, premium urban. Avoid aspirational clichés; lead with utility and belonging." },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Knowledge</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Your organization<br />never forgets.</SlideHeadline>
      </Stagger>
      <Stagger delay={0.2}>
        <div className="mt-10 max-w-4xl">
          <div className="flex items-center gap-3 p-4 rounded-xl border mb-6"
               style={{ background: t.surf, borderColor: t.a40 }}>
            <Search size={16} style={{ color: t.accent }} />
            <span className="text-sm" style={{ color: t.text }}>What did we learn from the Apex rebranding project?</span>
            <div className="ml-auto">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: t.accent }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              />
            </div>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <Stagger key={i} delay={0.3 + i * 0.1} from="right">
                <div className="p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.accent }}>{r.source}</p>
                  <p className="text-sm leading-relaxed" style={{ color: t.dim }}>{r.excerpt}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </Stagger>
    </SlideWrapper>
  );
}

function Slide11Automation() {
  const t = useT();
  const flow = [
    { label: "Trigger",   desc: "Project milestone reached",       icon: <Zap size={20} /> },
    { label: "Condition", desc: "Client inactive > 7 days",        icon: <AlertTriangle size={20} /> },
    { label: "Action",    desc: "Draft and send follow-up brief",   icon: <ArrowRight size={20} /> },
    { label: "Outcome",   desc: "Log to CRM, update health score",  icon: <TrendingUp size={20} /> },
  ];
  const workflows = [
    "New project → auto-generate brief template → assign team leads",
    "Invoice overdue 30d → escalate to account director → log in client record",
    "Team utilization > 95% → pause new intake → alert operations manager",
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Automation</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Intelligence<br />in motion.</SlideHeadline>
      </Stagger>
      <Stagger delay={0.2}>
        <div className="flex items-center gap-0 mt-10 max-w-4xl">
          {flow.map((f, i) => (
            <div key={i} className="flex items-center flex-1">
              <motion.div
                className="flex-1 p-4 rounded-xl border text-center"
                style={{ background: t.surf, borderColor: t.hair }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SNAPPY, delay: 0.25 + i * 0.12 }}
              >
                <div className="flex justify-center mb-2" style={{ color: t.accent }}>{f.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: t.accent }}>{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: t.dim }}>{f.desc}</p>
              </motion.div>
              {i < flow.length - 1 && (
                <motion.div
                  className="w-6 flex-shrink-0 mx-1"
                  style={{ height: 1, borderTop: `1px dashed ${t.accent}60` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.3, transformOrigin: "left" }}
                />
              )}
            </div>
          ))}
        </div>
      </Stagger>
      <div className="space-y-3 mt-8 max-w-4xl">
        {workflows.map((w, i) => (
          <Stagger key={i} delay={0.55 + i * 0.1} from="left">
            <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                   style={{ background: t.a20, color: t.accent }}>
                {i + 1}
              </div>
              <p className="text-sm" style={{ color: t.dim }}>{w}</p>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide12Architecture() {
  const t = useT();
  const layers = [
    { name: "Presentation Layer",  items: ["Web App", "Mobile App", "API Consumers", "Embedded Widgets"], desc: "React · TypeScript · Tailwind",        highlight: false },
    { name: "Intelligence Layer",  items: ["Core AI Engine", "Recommendation System", "Semantic Search", "Automation Engine"], desc: "Python · LangChain · Vector DB", highlight: true },
    { name: "Data Layer",          items: ["Entity Graph", "Event Stream", "Document Store", "Analytics Warehouse"], desc: "PostgreSQL · Redis · S3 · Snowflake",  highlight: false },
    { name: "Infrastructure Layer",items: ["Multi-Region Cloud", "Zero-Trust Network", "SOC 2 Type II", "99.99% SLA"], desc: "AWS · Kubernetes · Terraform",       highlight: false },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Architecture</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Built for<br />enterprise scale.</SlideHeadline>
      </Stagger>
      <div className="space-y-3 mt-10 max-w-5xl">
        {layers.map((l, i) => (
          <motion.div
            key={i}
            className="flex items-center p-5 rounded-xl border"
            style={{
              background: t.surf,
              borderColor: t.hair,
              borderLeft: `2px solid ${l.highlight ? t.accent : t.a30}`,
            }}
            initial={{ opacity: 0, x: -24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.2 + i * 0.1 }}
          >
            <div className="w-48 flex-shrink-0">
              <p className="text-sm font-semibold" style={{ color: t.text }}>{l.name}</p>
              <p className="text-xs mt-0.5" style={{ color: t.muted }}>{l.desc}</p>
            </div>
            <div className="flex gap-2 flex-wrap flex-1 ml-8">
              {l.items.map((item) => (
                <span key={item} className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: t.surf2, color: t.dim }}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide13Technology() {
  const t = useT();
  const stacks = [
    { name: "Frontend",        icon: <Globe size={18} />,    items: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "PWA"] },
    { name: "Backend",         icon: <Database size={18} />, items: ["Node.js", "GraphQL", "REST API", "WebSockets", "gRPC"] },
    { name: "AI & ML",         icon: <Cpu size={18} />,      items: ["GPT-4o", "Claude 3", "LangChain", "Pinecone", "PyTorch"] },
    { name: "Infrastructure",  icon: <Shield size={18} />,   items: ["AWS EKS", "Terraform", "GitHub Actions", "DataDog", "Vault"] },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Technology</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">The stack behind<br />NEXUS.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-4 gap-4 mt-10 max-w-5xl">
        {stacks.map((s, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1} from="scale">
            <div className="p-6 rounded-xl border h-full" style={{ background: t.surf, borderColor: t.hair }}>
              <div className="flex items-center gap-2 mb-5">
                <span style={{ color: t.accent }}>{s.icon}</span>
                <p className="text-sm font-semibold" style={{ color: t.text }}>{s.name}</p>
              </div>
              <div className="space-y-2">
                {s.items.map((item) => (
                  <div key={item} className="px-3 py-2 rounded-lg text-xs font-mono"
                       style={{ background: t.surf2, color: t.dim }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function CountUpStat({ prefix = "", target, suffix = "", decimals = 0, delay = 0 }: {
  prefix?: string; target: number; suffix?: string; decimals?: number; delay?: number;
}) {
  const val = useCountUp(target, { duration: 1.6, delay, decimals });
  const display = decimals > 0 ? val.toFixed(decimals) : val;
  return <>{`${prefix}${display}${suffix}`}</>;
}

function Slide14BusinessImpact() {
  const t = useT();
  const metrics = [
    { prefix: "+", target: 47,  suffix: "%",   decimals: 0, label: "On-time project delivery",        sub: "vs. industry average of +12%" },
    { prefix: "−", target: 31,  suffix: "%",   decimals: 0, label: "Client churn rate",               sub: "Relationship intelligence at work" },
    { prefix: "",  target: 3.2, suffix: "×",   decimals: 1, label: "Knowledge reuse",                 sub: "Fewer reinvented wheels" },
    { prefix: "",  target: 18,  suffix: "hrs",  decimals: 0, label: "Saved per manager, per week",     sub: "Redirected to high-value work" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Business Impact</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Measurable outcomes<br />from day one.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-2 gap-4 mt-10 max-w-4xl">
        {metrics.map((m, i) => (
          <Stagger key={i} delay={0.2 + i * 0.12} from="scale">
            <div className="p-8 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
              <p className="text-[72px] font-bold leading-none tracking-tight mb-3" style={{ color: t.accent }}>
                <CountUpStat prefix={m.prefix} target={m.target} suffix={m.suffix} decimals={m.decimals} delay={0.3 + i * 0.12} />
              </p>
              <p className="text-base font-medium mb-1" style={{ color: t.text }}>{m.label}</p>
              <p className="text-sm" style={{ color: t.muted }}>{m.sub}</p>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide15Vision() {
  const t = useT();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20 relative">
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <div className="w-[600px] h-[600px] rounded-full"
             style={{ background: `radial-gradient(circle, ${t.accent}10 0%, transparent 70%)` }} />
      </motion.div>
      <div className="relative z-10 max-w-3xl text-center">
        <Stagger delay={0}><SlideLabel>The Future</SlideLabel></Stagger>
        <Stagger delay={0.15}>
          <SlideHeadline size="xl">The intelligent<br />creative enterprise.</SlideHeadline>
        </Stagger>
        <Stagger delay={0.3}>
          <p className="text-xl font-light leading-relaxed mt-8" style={{ color: t.dim }}>
            We are building toward a world where every creative organization operates with the clarity and intelligence of the best ones. Where decisions are informed, talent is protected, clients are delighted, and knowledge compounds over time. NEXUS is not software — it is organizational intelligence, made real.
          </p>
        </Stagger>
      </div>
      <EmblemCorner />
    </div>
  );
}

function Slide16Closing() {
  const t = useT();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20">
      <Stagger delay={0} from="top">
        <div className="flex justify-center mb-10">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          >
            <ImageWithFallback
              src={nexusEmblem}
              alt="NEXUS emblem"
              className="w-44 h-44 object-contain"
              style={t.name === "White" ? { filter: "invert(1) brightness(0.3)" } : undefined}
            />
          </motion.div>
        </div>
      </Stagger>
      <Stagger delay={0.15}>
        <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase mb-10"
           style={{ color: t.accent }}>
          NEXUS
        </p>
      </Stagger>
      <Stagger delay={0.3}>
        <h1 className="text-center text-[72px] font-light leading-[1.1] tracking-tight max-w-4xl mx-auto"
            style={{ color: t.text }}>
          One Platform.<br />Infinite Possibilities.
        </h1>
      </Stagger>
      <Stagger delay={0.45}>
        <p className="text-center text-xl font-light mt-6" style={{ color: t.dim }}>
          The Operating System for Creative Enterprises.
        </p>
      </Stagger>
      <Stagger delay={0.6}>
        <div className="flex items-center gap-6 mt-12">
          <a
            href="https://nexus-topaz-omega.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: t.accent }}
          >
            Live App <ExternalLink size={13} />
          </a>
          <span style={{ color: t.muted, fontSize: 12 }}>·</span>
          <a
            href="https://nexus-slides.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: t.dim }}
          >
            View Slides <ExternalLink size={13} />
          </a>
        </div>
      </Stagger>
    </div>
  );
}

// ─── Slide Registry ───────────────────────────────────────────────────────────

const SLIDES = [
  Slide01Opening, Slide02Problem, Slide03SoftwareFallsShort, Slide04Introducing,
  Slide05MissionControl, Slide06CoreIntelligence, Slide07Projects, Slide08People,
  Slide09Clients, Slide10Knowledge, Slide11Automation, Slide12Architecture,
  Slide13Technology, Slide14BusinessImpact, Slide15Vision, Slide16Closing,
];

// ─── Nav Dot ──────────────────────────────────────────────────────────────────

function NavDot({ active, onClick }: { active: boolean; onClick: () => void }) {
  const t = useT();
  return (
    <motion.button
      onClick={onClick}
      animate={{
        width: active ? 20 : 6,
        background: active ? t.accent : t.hair,
      }}
      transition={SPRING_SNAPPY}
      className="rounded-full"
      style={{ height: 6 }}
    />
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [themeIdx, setThemeIdx] = useState(0);
  const themeKey = THEME_CYCLE[themeIdx];
  const theme = THEMES[themeKey];

  const go = useCallback((next: number) => {
    if (next < 0 || next >= SLIDES.length) return;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(current + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   go(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, go]);

  const SlideComponent = SLIDES[current];

  return (
    <ThemeCtx.Provider value={theme}>
      <motion.div
        className="w-screen h-screen overflow-hidden relative select-none"
        animate={{ background: theme.bg }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] z-10 rounded-full"
          style={{ background: theme.accent }}
          animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
          transition={{ ...SPRING_HEAVY }}
        />

        {/* Theme toggle */}
        <ThemeToggle
          themeKey={themeKey}
          onToggle={() => setThemeIdx((i) => (i + 1) % THEME_CYCLE.length)}
        />

        {/* Slide */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.06}
            onDragEnd={(_, info) => {
              if (info.offset.x < -55 && info.velocity.x < -60) go(current + 1);
              if (info.offset.x >  55 && info.velocity.x >  60) go(current - 1);
            }}
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>

        {/* Prev */}
        {current > 0 && (
          <motion.button
            onClick={() => go(current - 1)}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={SPRING_BOUNCY}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-25"
            style={{ background: theme.surf, color: theme.text }}
          >
            <ChevronLeft size={18} />
          </motion.button>
        )}

        {/* Next */}
        {current < SLIDES.length - 1 && (
          <motion.button
            onClick={() => go(current + 1)}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={SPRING_BOUNCY}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-25"
            style={{ background: theme.surf, color: theme.text }}
          >
            <ChevronRight size={18} />
          </motion.button>
        )}

        {/* Bottom nav */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
          <p className="text-xs font-mono" style={{ color: theme.muted }}>
            {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <NavDot key={i} active={i === current} onClick={() => go(i)} />
            ))}
          </div>
        </div>
      </motion.div>
    </ThemeCtx.Provider>
  );
}
