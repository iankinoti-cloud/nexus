import { useState, useEffect, useCallback, useContext, createContext, useRef } from "react";
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
  { team: "Copy",   used: 72, capacity: 100 },
  { team: "Dev",    used: 88, capacity: 100 },
  { team: "Strategy", used: 61, capacity: 100 },
  { team: "PM",     used: 105, capacity: 100 },
];

// ─── Physics Presets ─────────────────────────────────────────────────────────

const SPRING_SNAPPY = { type: "spring" as const, stiffness: 380, damping: 28, mass: 0.8 };
const SPRING_BOUNCY = { type: "spring" as const, stiffness: 260, damping: 20, mass: 1.0 };
const SPRING_HEAVY  = { type: "spring" as const, stiffness: 180, damping: 22, mass: 1.2 };
const SPRING_BAR    = { type: "spring" as const, stiffness: 100, damping: 22, mass: 0.9 };
const SPRING_LETTER = { type: "spring" as const, stiffness: 240, damping: 22, mass: 1.0 };

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 110 : -110, opacity: 0, scale: 0.94, filter: "blur(14px)" }),
  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  exit:  (dir: number) => ({ x: dir > 0 ? -75 : 75,   opacity: 0, scale: 0.97, filter: "blur(7px)" }),
};

const slideTransition = {
  x:      SPRING_HEAVY,
  scale:  SPRING_HEAVY,
  opacity: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as number[] },
  filter:  { duration: 0.30, ease: [0.4, 0, 0.2, 1] as number[] },
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCountUp(target: number, { duration = 1.4, delay = 0, decimals = 0 } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / (duration * 1000), 1);
        setVal(parseFloat(((1 - Math.pow(1 - p, 3)) * target).toFixed(decimals)));
        if (p < 1) requestAnimationFrame(step);
        else setVal(target);
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [target, duration, delay, decimals]);
  return val;
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?";

function useScramble(target: string, startDelayMs: number, scrambleDurationMs = 480) {
  const [state, setState] = useState({ char: SCRAMBLE_CHARS[0], settled: false });
  useEffect(() => {
    setState({ char: SCRAMBLE_CHARS[0], settled: false });
    const startTimer = setTimeout(() => {
      let elapsed = 0;
      const tick = () => {
        elapsed += 50;
        if (elapsed >= scrambleDurationMs) {
          setState({ char: target, settled: true });
        } else {
          setState({ char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)], settled: false });
          setTimeout(tick, 50);
        }
      };
      tick();
    }, startDelayMs);
    return () => clearTimeout(startTimer);
  }, [target, startDelayMs, scrambleDurationMs]);
  return state;
}

// ─── Scramble Letter (slides) ─────────────────────────────────────────────────

function ScrambleLetter({ char, delay }: { char: string; delay: number }) {
  const t = useT();
  const { char: displayed, settled } = useScramble(char, delay * 1000, 460);

  return (
    <motion.span
      initial={{ opacity: 0, y: -80, rotateX: -70 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ ...SPRING_LETTER, delay, opacity: { duration: 0.2, delay } }}
      style={{
        display: "inline-block",
        fontSize: 100,
        fontWeight: 200,
        lineHeight: 1,
        minWidth: "0.65em",
        textAlign: "center",
        letterSpacing: "-0.02em",
        color: settled ? t.text : t.accent,
        textShadow: settled ? "none" : `0 0 28px ${t.accent}70`,
        transition: "color 0.18s ease, text-shadow 0.18s ease",
        perspective: 800,
      }}
    >
      {displayed}
    </motion.span>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────

const QUADRANTS = [
  { clip: "inset(0 50% 50% 0)",  from: { x: -110, y: -110 } }, // top-left
  { clip: "inset(0 0 50% 50%)",  from: { x:  110, y: -110 } }, // top-right
  { clip: "inset(50% 50% 0 0)",  from: { x: -110, y:  110 } }, // bottom-left
  { clip: "inset(50% 0 0 50%)",  from: { x:  110, y:  110 } }, // bottom-right
];

const LETTER_EXITS = [
  { x: -130, y: -100, rotate: -20 },
  { x:  -45, y: -150, rotate: -8  },
  { x:    0, y: -180, rotate:  0  },
  { x:   55, y: -150, rotate:  8  },
  { x:  140, y:  -90, rotate:  18 },
];

function SplashLetter({
  char, delay, exiting, exitIdx,
}: { char: string; delay: number; exiting: boolean; exitIdx: number }) {
  const t = useT();
  const { char: displayed, settled } = useScramble(char, delay * 1000, 500);
  const ex = LETTER_EXITS[exitIdx];

  return (
    <motion.span
      initial={{ opacity: 0, y: -90, rotateX: -80 }}
      animate={
        exiting
          ? { opacity: 0, x: ex.x, y: ex.y, rotate: ex.rotate, scale: 0.2, filter: "blur(10px)" }
          : { opacity: 1, y: 0, rotateX: 0, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" }
      }
      transition={
        exiting
          ? { duration: 0.42, ease: [0.4, 0, 1, 1], delay: exitIdx * 0.04 }
          : { ...SPRING_LETTER, delay, opacity: { duration: 0.25, delay } }
      }
      style={{
        display: "inline-block",
        fontSize: 72,
        fontWeight: 200,
        lineHeight: 1,
        minWidth: "0.62em",
        textAlign: "center",
        letterSpacing: "-0.02em",
        color: settled ? t.text : t.accent,
        textShadow: settled ? "none" : `0 0 32px ${t.accent}80`,
        transition: "color 0.2s ease, text-shadow 0.2s ease",
        perspective: 800,
      }}
    >
      {displayed}
    </motion.span>
  );
}

function Splash({ onDone }: { onDone: () => void }) {
  const t = useT();
  const [exiting, setExiting] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 3100);
    const doneTimer = setTimeout(() => onDoneRef.current(), 3800);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, []);

  const emblemSize = 192;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: t.bg }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.55, delay: exiting ? 0.25 : 0, ease: "easeInOut" }}
    >
      {/* Radial ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        animate={
          exiting
            ? { opacity: 0, scale: 2.5 }
            : { opacity: [0, 0.6, 0.4], scale: [0.4, 1, 1] }
        }
        transition={exiting ? { duration: 0.4 } : { duration: 1.4, ease: "easeOut" }}
      >
        <div
          style={{
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${t.accent}18 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Emblem — 4-quadrant assembly */}
      <motion.div
        style={{ position: "relative", width: emblemSize, height: emblemSize, marginBottom: 40 }}
        animate={exiting ? { scale: 2.8, opacity: 0, filter: "blur(24px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={exiting ? { duration: 0.5, ease: [0.4, 0, 1, 1] } : {}}
      >
        {QUADRANTS.map((q, i) => (
          <motion.div
            key={i}
            style={{ position: "absolute", inset: 0, clipPath: q.clip, overflow: "hidden" }}
            initial={{ x: q.from.x, y: q.from.y, opacity: 0 }}
            animate={exiting
              ? { x: q.from.x * 0.4, y: q.from.y * 0.4, opacity: 0 }
              : { x: 0, y: 0, opacity: 1 }
            }
            transition={exiting
              ? { duration: 0.35, ease: [0.4, 0, 1, 1], delay: i * 0.03 }
              : { ...SPRING_BOUNCY, delay: 0.3 + i * 0.06 }
            }
          >
            <img
              src={nexusEmblem}
              alt=""
              style={{
                width: emblemSize,
                height: emblemSize,
                objectFit: "contain",
                ...(t.name === "White" ? { filter: "invert(1) brightness(0.3)" } : {}),
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* NEXUS wordmark — scramble */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {"NEXUS".split("").map((letter, i) => (
          <SplashLetter
            key={i}
            char={letter}
            delay={0.85 + i * 0.16}
            exiting={exiting}
            exitIdx={i}
          />
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={exiting ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
        transition={exiting ? { duration: 0.25 } : { delay: 2.3, duration: 0.6 }}
        style={{
          marginTop: 24,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: t.dim,
        }}
      >
        The Intelligence Layer
      </motion.p>

      {/* Thin accent rule under tagline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={exiting ? { opacity: 0 } : { scaleX: 1, opacity: 1 }}
        transition={exiting ? { duration: 0.2 } : { delay: 2.55, duration: 0.5, ease: "easeOut" }}
        style={{
          marginTop: 12,
          width: 64,
          height: 1,
          background: t.accent,
          transformOrigin: "center",
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
}

// ─── Shared Slide Components ──────────────────────────────────────────────────

type StaggerFrom = "bottom" | "top" | "left" | "right" | "scale";

function SlideLabel({ children }: { children: React.ReactNode }) {
  const t = useT();
  return <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: t.accent }}>{children}</p>;
}

function SlideHeadline({ children, size = "lg" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  const t = useT();
  const sizes = { sm: "text-4xl", md: "text-5xl", lg: "text-6xl", xl: "text-7xl" };
  return <h1 className={`${sizes[size]} font-light leading-[1.1] tracking-tight`} style={{ color: t.text }}>{children}</h1>;
}

function SlideSubhead({ children }: { children: React.ReactNode }) {
  const t = useT();
  return <p className="text-xl font-light leading-relaxed mt-4" style={{ color: t.dim }}>{children}</p>;
}

function Stagger({ children, delay = 0, from = "bottom" }: { children: React.ReactNode; delay?: number; from?: StaggerFrom }) {
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
      transition={{ ...SPRING_SNAPPY, delay, opacity: { duration: 0.32, ease: "easeOut", delay } }}
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
      style={{ background: t.surf, border: `1px solid ${t.hair}`, color: t.accent, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}
    >
      <motion.span key={themeKey} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={SPRING_BOUNCY}>
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
          <motion.div animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}>
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
        <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase mb-10" style={{ color: t.accent }}>NEXUS</p>
      </Stagger>
      <Stagger delay={0.3}>
        <h1 className="text-center text-[72px] font-light leading-[1.1] tracking-tight max-w-4xl mx-auto" style={{ color: t.text }}>
          The Operating System Behind Every Creative Enterprise.
        </h1>
      </Stagger>
    </div>
  );
}

function Slide02Problem() {
  const t = useT();
  const problems = [
    { stat: "17 tools",  desc: "Zero shared context between them",           icon: <Network size={20} /> },
    { stat: "Inboxes",   desc: "Where critical knowledge goes to die",        icon: <BookOpen size={20} /> },
    { stat: "Invisible", desc: "Talent burnout is only visible in hindsight", icon: <Users size={20} /> },
    { stat: "Gut feel",  desc: "Decisions made without data or foresight",    icon: <BarChart3 size={20} /> },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>The Problem</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline>Creative businesses are<br />drowning in disconnection.</SlideHeadline></Stagger>
      <div className="grid grid-cols-2 gap-4 mt-12 max-w-3xl">
        {problems.map((p, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1}>
            <div className="p-6 rounded-xl border" style={{ background: t.surf, borderColor: t.hair, borderLeft: `2px solid ${t.a30}` }}>
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
    { tools: "Manages tasks and deadlines",   need: "Understands project relationships" },
    { tools: "Stores files and documents",     need: "Surfaces relevant knowledge proactively" },
    { tools: "Tracks hours and capacity",      need: "Predicts burnout before it happens" },
    { tools: "Logs client interactions",       need: "Scores and strengthens relationships" },
    { tools: "Runs isolated workflows",        need: "Connects decisions across departments" },
  ];
  return (
    <SlideWrapper>
      <div className="grid grid-cols-2 gap-20 items-start">
        <div>
          <Stagger delay={0}><SlideLabel>Why Existing Software Falls Short</SlideLabel></Stagger>
          <Stagger delay={0.1}><SlideHeadline size="md">Built for tasks.<br />Not for intelligence.</SlideHeadline></Stagger>
          <Stagger delay={0.25}><SlideSubhead>Every tool optimizes for its own silo. Nobody connects the dots.</SlideSubhead></Stagger>
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
    { icon: <Users size={24} />,        label: "People" },
    { icon: <FolderKanban size={24} />, label: "Projects" },
    { icon: <Building2 size={24} />,    label: "Clients" },
    { icon: <BookOpen size={24} />,     label: "Knowledge" },
    { icon: <Zap size={24} />,          label: "Operations" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20">
      <Stagger delay={0}><SlideLabel>Introducing NEXUS</SlideLabel></Stagger>

      {/* Letter-by-letter scramble with 3D drop + light sweep */}
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0, marginBottom: 16 }}>
        {"NEXUS".split("").map((letter, i) => (
          <ScrambleLetter key={i} char={letter} delay={0.12 + i * 0.13} />
        ))}
        {/* Sweep — fires after last letter settles (~1.0s) */}
        <motion.div
          initial={{ x: "-110%", opacity: 0 }}
          animate={{ x: "110%", opacity: [0, 0.7, 0] }}
          transition={{ delay: 1.05, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${t.accent}35, transparent)`,
            pointerEvents: "none",
            borderRadius: 4,
          }}
        />
      </div>

      <Stagger delay={0.85}>
        <p className="text-center text-2xl font-light" style={{ color: t.dim }}>
          The Intelligence Layer for Creative Enterprises
        </p>
      </Stagger>

      <div className="flex items-center gap-0 mt-16">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center">
            <Stagger delay={0.9 + i * 0.1} from="scale">
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
                className="w-12 flex-shrink-0"
                style={{ height: 1 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.35, transformOrigin: "left" }}
              >
                <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, ${t.accent}60, ${t.accent}20)` }} />
              </motion.div>
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
      <Stagger delay={0.1}><SlideHeadline size="md">Executive clarity,<br />in real time.</SlideHeadline></Stagger>
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
    { type: "Capacity Alert",    msg: "Aria Chen is approaching 105% capacity — redistribute 2 tasks before Thursday.", time: "Just now" },
    { type: "Relationship Risk", msg: "Meridian Group last contacted 14 days ago. Senior stakeholder has gone silent.", time: "2h ago" },
    { type: "Project Drift",     msg: "Project Aurora is tracking 12 days behind. Three dependencies unresolved.",      time: "4h ago" },
  ];
  return (
    <SlideWrapper>
      <div className="grid grid-cols-2 gap-20 items-center h-full">
        <div>
          <Stagger delay={0}><SlideLabel>Core Intelligence</SlideLabel></Stagger>
          <Stagger delay={0.1}><h1 className="text-[86px] font-light leading-none tracking-tight mb-6" style={{ color: t.text }}>Core</h1></Stagger>
          <Stagger delay={0.2}><SlideSubhead>The AI engine at the heart of everything. Continuously learning, always watching, proactively surfacing what matters.</SlideSubhead></Stagger>
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
    { name: "Apex Brand Refresh",    client: "Apex Industries", phase: "Design",     progress: 68, status: "On Track", due: "Aug 14" },
    { name: "Aurora Campaign",        client: "Stellar Media",   phase: "Production", progress: 34, status: "At Risk",  due: "Jul 29" },
    { name: "Meridian Web Overhaul", client: "Meridian Group",  phase: "Strategy",   progress: 91, status: "On Track", due: "Aug 2" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Projects</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">Intelligent from kickoff<br />to close.</SlideHeadline></Stagger>
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
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                      transition={{ ...SPRING_BAR, delay: 0.35 + i * 0.12 }} style={{ background: barColor }} />
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
        <div className="mt-4 p-4 rounded-xl border flex items-start gap-3 max-w-4xl" style={{ background: t.a08, borderColor: t.a30 }}>
          <Brain size={16} style={{ color: t.accent, marginTop: 2, flexShrink: 0 }} />
          <p className="text-sm" style={{ color: t.accent }}>Core insight: Aurora campaign is at risk due to unresolved asset approvals from the Stellar Media legal team. 3 days of buffer remaining.</p>
        </div>
      </Stagger>
    </SlideWrapper>
  );
}

function Slide08People() {
  const t = useT();
  const team = [
    { name: "Aria Chen",    role: "Senior Designer",   utilization: 105, risk: "high",   avatar: "AC" },
    { name: "Marcus Webb",  role: "Creative Director",  utilization: 72,  risk: "low",    avatar: "MW" },
    { name: "Priya Nair",   role: "Copywriter",         utilization: 88,  risk: "medium", avatar: "PN" },
    { name: "James Okafor", role: "Strategist",         utilization: 61,  risk: "low",    avatar: "JO" },
  ];
  const riskColor = (risk: string) => ({ high: "#ef4444", medium: "#f59e0b", low: t.accent }[risk] ?? t.accent);
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>People</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">See your team<br />with clarity.</SlideHeadline></Stagger>
      <div className="grid grid-cols-2 gap-4 mt-10 max-w-4xl">
        {team.map((m, i) => {
          const rc = riskColor(m.risk);
          const barBg = m.utilization > 100 ? "#ef4444" : m.utilization > 85 ? "#f59e0b" : t.accent;
          return (
            <Stagger key={i} delay={0.2 + i * 0.1}>
              <div className="p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: t.a20, color: t.accent }}>{m.avatar}</div>
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
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(m.utilization, 100)}%` }}
                      transition={{ ...SPRING_BAR, delay: 0.35 + i * 0.1 }} style={{ background: barBg }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: m.utilization > 100 ? "#ef4444" : t.text }}>{m.utilization}%</span>
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
    { name: "Apex Industries", initials: "AI", lastContact: "3 days ago",  health: 92, openItems: 2 },
    { name: "Meridian Group",  initials: "MG", lastContact: "14 days ago", health: 58, openItems: 7 },
    { name: "Stellar Media",   initials: "SM", lastContact: "1 day ago",   health: 85, openItems: 1 },
    { name: "Crest Financial", initials: "CF", lastContact: "6 days ago",  health: 74, openItems: 4 },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Clients</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">Relationships,<br />not just records.</SlideHeadline></Stagger>
      <div className="space-y-3 mt-10 max-w-4xl">
        <Stagger delay={0.15}>
          <div className="grid grid-cols-4 pb-2 px-5">
            {["Client", "Last Contact", "Relationship Health", "Open Items"].map((h) => (
              <p key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: t.muted }}>{h}</p>
            ))}
          </div>
        </Stagger>
        {clients.map((c, i) => {
          const hc = c.health > 80 ? t.accent : c.health > 65 ? "#f59e0b" : "#ef4444";
          return (
            <Stagger key={i} delay={0.2 + i * 0.08} from="left">
              <div className="grid grid-cols-4 items-center p-5 rounded-xl border" style={{ background: t.surf, borderColor: t.hair }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: t.a20, color: t.accent }}>{c.initials}</div>
                  <span className="text-sm font-medium" style={{ color: t.text }}>{c.name}</span>
                </div>
                <span className="text-sm" style={{ color: c.lastContact.includes("14") ? "#f87171" : t.dim }}>{c.lastContact}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: t.a12 }}>
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${c.health}%` }}
                      transition={{ ...SPRING_BAR, delay: 0.3 + i * 0.08 }} style={{ background: hc }} />
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
    { source: "Project Brief — Apex 2023",       excerpt: "Client prioritized sustainability messaging over product specs. Legal required 48h review for all claim-based copy." },
    { source: "Post-mortem — Meridian Rebrand",  excerpt: "Timeline slippage caused by late-stage stakeholder additions. Recommend gating Phase 2 with full sign-off protocol." },
    { source: "Strategy Deck — Stellar Launch",  excerpt: "Target demo skews 28–40, premium urban. Avoid aspirational clichés; lead with utility and belonging." },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Knowledge</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">Your organization<br />never forgets.</SlideHeadline></Stagger>
      <Stagger delay={0.2}>
        <div className="mt-10 max-w-4xl">
          <div className="flex items-center gap-3 p-4 rounded-xl border mb-6" style={{ background: t.surf, borderColor: t.a40 }}>
            <Search size={16} style={{ color: t.accent }} />
            <span className="text-sm" style={{ color: t.text }}>What did we learn from the Apex rebranding project?</span>
            <div className="ml-auto">
              <motion.div className="w-2 h-2 rounded-full" style={{ background: t.accent }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
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
    { label: "Trigger",   desc: "Project milestone reached",      icon: <Zap size={20} /> },
    { label: "Condition", desc: "Client inactive > 7 days",       icon: <AlertTriangle size={20} /> },
    { label: "Action",    desc: "Draft and send follow-up brief",  icon: <ArrowRight size={20} /> },
    { label: "Outcome",   desc: "Log to CRM, update health score", icon: <TrendingUp size={20} /> },
  ];
  const workflows = [
    "New project → auto-generate brief template → assign team leads",
    "Invoice overdue 30d → escalate to account director → log in client record",
    "Team utilization > 95% → pause new intake → alert operations manager",
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Automation</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">Intelligence<br />in motion.</SlideHeadline></Stagger>
      <Stagger delay={0.2}>
        <div className="flex items-center gap-0 mt-10 max-w-4xl">
          {flow.map((f, i) => (
            <div key={i} className="flex items-center flex-1">
              <motion.div className="flex-1 p-4 rounded-xl border text-center" style={{ background: t.surf, borderColor: t.hair }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING_SNAPPY, delay: 0.25 + i * 0.12 }}>
                <div className="flex justify-center mb-2" style={{ color: t.accent }}>{f.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: t.accent }}>{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: t.dim }}>{f.desc}</p>
              </motion.div>
              {i < flow.length - 1 && (
                <motion.div className="w-6 flex-shrink-0 mx-1" style={{ height: 1, borderTop: `1px dashed ${t.accent}60` }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.3, transformOrigin: "left" }} />
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
                   style={{ background: t.a20, color: t.accent }}>{i + 1}</div>
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
  const agents = [
    { name: "Zara", title: "Operations Command", color: t.accent, items: ["Project risk", "Deadlines", "Resource allocation", "Timeline management"], actions: ["reassign", "extend_deadline", "handoff"] },
    { name: "Knox", title: "Talent Intelligence", color: "#A855F7", items: ["Team capacity", "Burnout prevention", "Skills matching", "DMF recruitment"], actions: ["recommend_hire", "reassign", "handoff"] },
    { name: "Mira", title: "Client Success", color: "#10B981", items: ["Client health", "CRM dossiers", "Follow-up drafts", "Churn prevention"], actions: ["contact_client", "log_contact", "handoff"] },
    { name: "Axel", title: "Production Control", color: "#F59E0B", items: ["Studio scheduling", "Equipment allocation", "Crew assignment", "Shoot planning"], actions: ["book_studio", "allocate_crew", "handoff"] },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Agent Architecture</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">Four specialist agents.<br />One intelligent workforce.</SlideHeadline></Stagger>
      <div className="grid grid-cols-4 gap-4 mt-10 max-w-5xl w-full">
        {agents.map((agent, i) => (
          <motion.div key={agent.name} className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: t.surf, border: `1px solid ${agent.color}25`, borderTop: `3px solid ${agent.color}` }}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.2 + i * 0.1 }}
          >
            <div>
              <p className="text-base font-bold" style={{ color: agent.color }}>{agent.name}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: t.muted }}>{agent.title}</p>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              {agent.items.map(item => (
                <span key={item} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: `${agent.color}10`, color: t.dim, border: `1px solid ${agent.color}20` }}>{item}</span>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold" style={{ color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Actions</p>
              {agent.actions.map(a => (
                <span key={a} className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${agent.color}08`, color: agent.color, border: `1px solid ${agent.color}18` }}>{a}()</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="flex items-center gap-6 mt-8 px-6 py-3 rounded-2xl"
        style={{ background: t.surf, border: `1px solid ${t.hair}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[
          { label: "Powered by", value: "Claude claude-opus-4-8" },
          { label: "Data layer", value: "Supabase · RLS per user" },
          { label: "Stack", value: "React · Vite · Vercel" },
          { label: "Security", value: "STRIDE · JWT · Rate limiting" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: t.muted }}>{label}</span>
            <span className="text-xs font-semibold" style={{ color: t.text }}>{value}</span>
          </div>
        ))}
      </motion.div>
    </SlideWrapper>
  );
}

function Slide13Technology() {
  const t = useT();
  const stacks = [
    { name: "Frontend",       icon: <Globe size={18} />,    items: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "shadcn/ui"] },
    { name: "Backend",        icon: <Database size={18} />, items: ["Node.js", "Express", "Vercel Functions", "Supabase RLS", "Streaming API"] },
    { name: "AI Layer",       icon: <Cpu size={18} />,      items: ["Claude claude-opus-4-8", "Prompt caching", "Structured outputs", "4-agent routing", "Offline fallback"] },
    { name: "Security",       icon: <Shield size={18} />,   items: ["STRIDE model", "JWT verification", "Rate limiting", "Input caps", "Payload guard"] },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Technology</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">The stack behind<br />NEXUS.</SlideHeadline></Stagger>
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
                  <div key={item} className="px-3 py-2 rounded-lg text-xs font-mono" style={{ background: t.surf2, color: t.dim }}>{item}</div>
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
  return <>{`${prefix}${decimals > 0 ? val.toFixed(decimals) : val}${suffix}`}</>;
}

function Slide14BusinessImpact() {
  const t = useT();
  const metrics = [
    { prefix: "+", target: 47,  suffix: "%",   decimals: 0, label: "On-time project delivery",    sub: "vs. industry average of +12%" },
    { prefix: "−", target: 31,  suffix: "%",   decimals: 0, label: "Client churn rate",            sub: "Relationship intelligence at work" },
    { prefix: "",  target: 3.2, suffix: "×",   decimals: 1, label: "Knowledge reuse",              sub: "Fewer reinvented wheels" },
    { prefix: "",  target: 18,  suffix: "hrs", decimals: 0, label: "Saved per manager, per week",  sub: "Redirected to high-value work" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Business Impact</SlideLabel></Stagger>
      <Stagger delay={0.1}><SlideHeadline size="md">Measurable outcomes<br />from day one.</SlideHeadline></Stagger>
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
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
        <div className="w-[600px] h-[600px] rounded-full"
             style={{ background: `radial-gradient(circle, ${t.accent}10 0%, transparent 70%)` }} />
      </motion.div>
      <div className="relative z-10 max-w-3xl text-center">
        <Stagger delay={0}><SlideLabel>The Future</SlideLabel></Stagger>
        <Stagger delay={0.15}><SlideHeadline size="xl">The intelligent<br />creative enterprise.</SlideHeadline></Stagger>
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
          <motion.div animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}>
            <ImageWithFallback src={nexusEmblem} alt="NEXUS emblem" className="w-44 h-44 object-contain"
              style={t.name === "White" ? { filter: "invert(1) brightness(0.3)" } : undefined} />
          </motion.div>
        </div>
      </Stagger>
      <Stagger delay={0.15}>
        <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase mb-10" style={{ color: t.accent }}>NEXUS</p>
      </Stagger>
      <Stagger delay={0.3}>
        <h1 className="text-center text-[72px] font-light leading-[1.1] tracking-tight max-w-4xl mx-auto" style={{ color: t.text }}>
          One Platform.<br />Infinite Possibilities.
        </h1>
      </Stagger>
      <Stagger delay={0.45}>
        <p className="text-center text-xl font-light mt-6" style={{ color: t.dim }}>The Operating System for Creative Enterprises.</p>
      </Stagger>
      <Stagger delay={0.6}>
        <div className="flex items-center gap-6 mt-12">
          <a href="https://nexus-topaz-omega.vercel.app" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
             style={{ color: t.accent }}>
            Live App <ExternalLink size={13} />
          </a>
          <span style={{ color: t.muted, fontSize: 12 }}>·</span>
          <a href="https://nexus-slides.vercel.app" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
             style={{ color: t.dim }}>
            View Slides <ExternalLink size={13} />
          </a>
        </div>
      </Stagger>
    </div>
  );
}

function SlideDemo() {
  const t = useT();
  return (
    <SlideWrapper>
      <Stagger delay={0}>
        <SlideHeadline size="md">See NEXUS think.</SlideHeadline>
      </Stagger>
      <Stagger delay={0.2}>
        <div
          className="mt-8 rounded-2xl overflow-hidden mx-auto"
          style={{
            border: `1px solid ${t.accent}47`,
            boxShadow: `0 30px 90px -20px rgba(0,0,0,0.75), 0 0 60px ${t.accent}14`,
            maxWidth: 1180,
          }}
        >
          <video
            src="/NEXUS-film.mp4"
            poster="/NEXUS-poster.jpg"
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto block"
            style={{ background: t.bg }}
          />
        </div>
      </Stagger>
      <Stagger delay={0.32}>
        <p className="text-center text-sm mt-5 tracking-wide" style={{ color: t.muted }}>
          Real product · live AI · narrated · desktop &amp; mobile — press&nbsp;
          <span style={{ color: t.accent }}>▶</span>&nbsp;and unmute for sound.
        </p>
      </Stagger>
    </SlideWrapper>
  );
}

// ─── Humanwash Editorial Sequence ─────────────────────────────────────────────

const HW_AMBER = "#E8A020";
const HW_STEEL = "#4A6FA5";
const HW_RED   = "#C94040";

type HWActProps = { t: Theme };

const hwActVariants = {
  initial: { opacity: 0, filter: "contrast(1.8) brightness(1.5) blur(2px)", x: 5, scaleX: 1.015 },
  animate: { opacity: 1, filter: "contrast(1) brightness(1) blur(0px)", x: 0, scaleX: 1 },
  exit:    { opacity: 0, filter: "contrast(1.5) brightness(1.4) blur(3px)", x: -8, scaleX: 0.985 },
};
const hwActTransition = { duration: 0.2, ease: [0.4, 0, 1, 1] as number[] };

// VFX — particle burst canvas (Act I background energy field)
function ParticleBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const par = canvas.parentElement!;
    const W = canvas.width  = par.offsetWidth;
    const H = canvas.height = par.offsetHeight;
    const ctx = canvas.getContext("2d")!;
    const pts = Array.from({ length: 150 }, () => {
      const a = Math.random() * Math.PI * 2;
      const s = 4 + Math.random() * 10;
      return {
        x: W / 2 + (Math.random() - 0.5) * 120,
        y: H / 2 + (Math.random() - 0.5) * 80,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 1,
        decay: 0.007 + Math.random() * 0.013,
        r: 0.8 + Math.random() * 2.2,
        amber: Math.random() > 0.62,
      };
    });
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.97; p.vy *= 0.97;
        p.life -= p.decay;
        if (p.life <= 0) return;
        alive = true;
        ctx.globalAlpha = p.life * 0.65;
        ctx.fillStyle = p.amber ? HW_AMBER : "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", opacity: 0.55 }} />;
}

// VFX — glitch flash overlay on phase cuts
function GlitchFlash({ id }: { id: number }) {
  return (
    <motion.div
      key={id}
      className="absolute inset-0 pointer-events-none z-30"
      initial={{ opacity: 0.75 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.13, ease: "easeOut" }}
      style={{
        background: "linear-gradient(135deg, rgba(79,209,197,0.14) 0%, rgba(255,255,255,0.09) 50%, rgba(232,160,32,0.14) 100%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

// Letter shard configs for HUMAN / WASHING (Act I)
const HUMAN_SHARDS   = [
  { ix: -170, iy: -100, rot: -24 }, { ix: -55, iy: -150, rot: -9 },
  { ix:   15, iy: -120, rot:   0 }, { ix:  75, iy: -140, rot: 13 },
  { ix:  155, iy:  -75, rot:  22 },
];
const WASHING_SHARDS = [
  { ix: -185, iy:  85, rot:  27 }, { ix:  -95, iy: 115, rot: -16 },
  { ix:  -25, iy:  95, rot:   9 }, { ix:   45, iy: 125, rot: -22 },
  { ix:  105, iy:  75, rot:  19 }, { ix:  162, iy:  98, rot: -11 },
  { ix:  210, iy: 115, rot:  30 },
];

function EvidenceStat({ t }: HWActProps) {
  const pct = useCountUp(40, { duration: 1.3, delay: 0.3 });
  return (
    <motion.div
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
      className="flex flex-col items-center text-center w-full"
    >
      <span style={{ fontSize: 112, fontWeight: 800, color: HW_AMBER, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(pct)}%
      </span>
      <p style={{ color: t.text, fontSize: 22, marginTop: 8, maxWidth: 480, lineHeight: 1.4 }}>
        more likely to trust AI responses that use first-person language
      </p>
      <div className="flex items-center gap-2 mt-8" style={{ width: 360 }}>
        <motion.div
          style={{ height: 8, background: HW_AMBER, borderRadius: 4, transformOrigin: "left" }}
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ ...SPRING_BAR, delay: 0.5 }}
        />
        <div style={{ height: 8, flex: 1, background: t.hair, borderRadius: 4 }} />
      </div>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
        style={{ color: t.muted, fontSize: 11, marginTop: 10, fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase" }}
      >
        Stanford HCI · 2024
      </motion.p>
    </motion.div>
  );
}

function EvidencePhrase({ t }: HWActProps) {
  const [struck, setStruck] = useState(false);
  const [replaced, setReplaced] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStruck(true), 800);
    const t2 = setTimeout(() => setReplaced(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
      className="w-full"
    >
      <p style={{ color: HW_STEEL, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 24 }}>
        Phrase Transformation
      </p>
      <div style={{ position: "relative", marginBottom: 36 }}>
        <p style={{ fontSize: 20, color: t.dim, lineHeight: 1.55 }}>
          "Our AI analyzes your data and returns predictions based on learned patterns."
        </p>
        <motion.div
          style={{
            position: "absolute", left: 0, right: 0, top: "50%",
            height: 2, background: HW_RED, transformOrigin: "left",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: struck ? 1 : 0 }}
          transition={{ duration: 0.52, ease: "easeOut" }}
        />
      </div>
      <AnimatePresence>
        {replaced && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] as number[] }}
            style={{ fontSize: 28, color: HW_AMBER, lineHeight: 1.4, fontWeight: 300 }}
          >
            "I understand what you're going through. Let me help."
          </motion.p>
        )}
      </AnimatePresence>
      {replaced && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          style={{ color: t.muted, fontSize: 12, marginTop: 18, letterSpacing: "0.15em", textTransform: "uppercase" }}
        >
          Same model. Same output. Different trust signal.
        </motion.p>
      )}
    </motion.div>
  );
}

function EvidenceFunnel({ t }: HWActProps) {
  const stages = [
    { label: "CAPABILITY",     width: 320, bg: t.a08,                   border: t.hair,          textColor: t.dim     },
    { label: "WARMTH THEATER", width: 210, bg: "rgba(232,160,32,0.14)", border: `${HW_AMBER}60`, textColor: HW_AMBER  },
    { label: "USER TRUST ✓",   width: 130, bg: "rgba(232,160,32,0.28)", border: HW_AMBER,        textColor: HW_AMBER  },
  ];
  return (
    <motion.div
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
      className="flex flex-col items-center"
    >
      <p style={{ color: HW_STEEL, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 28 }}>
        The Humanwashing Funnel
      </p>
      {stages.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ ...SPRING_BAR, delay: 0.2 + i * 0.42 }}
            style={{
              width: s.width, height: 54,
              border: `1.5px solid ${s.border}`,
              background: s.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 4,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: s.textColor }}>
              {s.label}
            </span>
          </motion.div>
          {i < stages.length - 1 && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.38 + i * 0.42, duration: 0.22, transformOrigin: "top" }}
              style={{ width: 1, height: 26, background: `linear-gradient(to bottom, ${t.hair}, ${HW_AMBER}80)` }}
            />
          )}
        </div>
      ))}
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
        style={{ color: t.muted, fontSize: 12, marginTop: 22, textAlign: "center", maxWidth: 340, lineHeight: 1.55 }}
      >
        Raw capability enters. Warmth theater is applied.<br />Trust is manufactured, not earned.
      </motion.p>
    </motion.div>
  );
}

function ActI({ t }: HWActProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-24"
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
    >
      <ParticleBurst />

      {/* HUMAN — letters shatter in from scattered trajectories */}
      <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1, marginBottom: -8 }}>
        {"HUMAN".split("").map((ch, i) => {
          const s = HUMAN_SHARDS[i];
          return (
            <motion.span key={i}
              initial={{ opacity: 0, x: s.ix, y: s.iy, rotate: s.rot, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={{ ...SPRING_BOUNCY, delay: 0.04 + i * 0.06, opacity: { duration: 0.18, delay: 0.04 + i * 0.06 } }}
              style={{
                fontSize: 140, fontWeight: 800, color: t.text,
                letterSpacing: "-0.03em", display: "inline-block",
                textShadow: "0 0 40px rgba(255,255,255,0.12)",
              }}
            >
              {ch}
            </motion.span>
          );
        })}
      </div>

      {/* WASHING — letters rise from below, amber */}
      <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
        {"WASHING".split("").map((ch, i) => {
          const s = WASHING_SHARDS[i];
          return (
            <motion.span key={i}
              initial={{ opacity: 0, x: s.ix, y: s.iy, rotate: s.rot, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={{ ...SPRING_BOUNCY, delay: 0.3 + i * 0.055, opacity: { duration: 0.18, delay: 0.3 + i * 0.055 } }}
              style={{
                fontSize: 140, fontWeight: 200, color: HW_AMBER,
                letterSpacing: "-0.03em", display: "inline-block",
                textShadow: `0 0 40px ${HW_AMBER}45`,
              }}
            >
              {ch}
            </motion.span>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.12, duration: 0.55 }}
        style={{ color: t.dim, fontSize: 18, marginTop: 32, textAlign: "center" }}
      >
        When AI systems <em>perform</em> humanity rather than deliver it.
      </motion.p>
    </motion.div>
  );
}

function ActII({ t }: HWActProps) {
  const machineLines = ["> pattern_match: 0.847", "> corpus_tokens: 14.2B", "> confidence_score: 0.912"];
  const perceptionItems = ["Understands me", "Cares about my problem", "Is genuinely helpful"];
  return (
    <motion.div
      className="absolute inset-0 grid grid-cols-2 overflow-hidden"
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
    >
      <motion.div
        style={{
          position: "absolute", left: "50%", top: 0, bottom: 0, width: 1,
          background: `linear-gradient(to bottom, transparent, ${t.accent}50, transparent)`,
          transformOrigin: "top", zIndex: 10,
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
      />
      <motion.div
        className="flex flex-col justify-center px-16 py-20"
        style={{
          background: "rgba(74,111,165,0.10)",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(74,111,165,0.05) 3px, rgba(74,111,165,0.05) 4px)",
        }}
        initial={{ x: -48, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ...SPRING_HEAVY, delay: 0.15 }}
      >
        <p style={{ color: HW_STEEL, fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 24 }}>
          Machine Reality
        </p>
        {machineLines.map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.18, duration: 0.28 }}
            style={{ fontFamily: "monospace", fontSize: 13, color: HW_STEEL, marginBottom: 12 }}
          >
            {line}
          </motion.p>
        ))}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.45 }}
          style={{ fontSize: 20, color: t.dim, marginTop: 28, lineHeight: 1.45 }}
        >
          "Statistically predicted next-token sequences."
        </motion.p>
      </motion.div>
      <motion.div
        className="flex flex-col justify-center px-16 py-20"
        style={{ background: "rgba(232,160,32,0.07)" }}
        initial={{ x: 48, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ...SPRING_HEAVY, delay: 0.22 }}
      >
        <p style={{ color: HW_AMBER, fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 24 }}>
          User Perception
        </p>
        {perceptionItems.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.2, duration: 0.32 }}
            className="flex items-center gap-3 mb-5"
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: HW_AMBER, opacity: 0.75, flexShrink: 0 }} />
            <p style={{ fontSize: 18, color: t.text }}>{item}</p>
          </motion.div>
        ))}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.45 }}
          style={{ fontSize: 20, color: HW_AMBER, marginTop: 28, lineHeight: 1.45 }}
        >
          "It really gets me."
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function ActIII({ t, evidIdx, setEvidIdx }: HWActProps & { evidIdx: number; setEvidIdx: (i: number) => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-24"
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
    >
      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {evidIdx === 0 && <EvidenceStat key="stat" t={t} />}
          {evidIdx === 1 && <EvidencePhrase key="phrase" t={t} />}
          {evidIdx === 2 && <EvidenceFunnel key="funnel" t={t} />}
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5 mt-10">
        {[0, 1, 2].map(i => (
          <motion.button key={i} onClick={() => setEvidIdx(i)}
            animate={{ width: i === evidIdx ? 20 : 6, background: i === evidIdx ? HW_AMBER : t.hair }}
            transition={SPRING_SNAPPY}
            style={{ height: 4, borderRadius: 2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ActIV({ t }: HWActProps) {
  const words = [
    { text: "Not",            big: false },
    { text: "feelings.",      big: false },
    { text: "Trust",          big: true  },
    { text: "architecture.",  big: true  },
  ];
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-24"
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.28em", alignItems: "baseline" }}>
        {words.map((w, i) => (
          <motion.span key={i}
            initial={{ y: -44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_BOUNCY, delay: i * 0.22, opacity: { duration: 0.2, delay: i * 0.22 } }}
            style={{
              fontSize: w.big ? 76 : 52,
              fontWeight: w.big ? 700 : 300,
              color: w.big ? HW_AMBER : t.dim,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {w.text}
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.98, duration: 0.58, ease: "easeOut", transformOrigin: "left" }}
        style={{ height: 3, background: HW_AMBER, width: 460, marginTop: 22, borderRadius: 2 }}
      />
    </motion.div>
  );
}

function ActV({ t }: HWActProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-24"
      variants={hwActVariants} initial="initial" animate="animate" exit="exit"
      transition={hwActTransition}
    >
      <Stagger delay={0} from="scale">
        <ImageWithFallback
          src={nexusEmblem} alt="NEXUS"
          className="w-24 h-24 object-contain"
          style={t.name === "White" ? { filter: "invert(1) brightness(0.3)" } : undefined}
        />
      </Stagger>
      <Stagger delay={0.22}>
        <p style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }}>
          NEXUS
        </p>
      </Stagger>
      <Stagger delay={0.38}>
        <h2 style={{ fontSize: 68, fontWeight: 200, color: t.text, textAlign: "center", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          Intelligence at scale.
        </h2>
      </Stagger>
    </motion.div>
  );
}

function SlideHumanwash() {
  const t = useT();
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [evidIdx, setEvidIdx] = useState(0);
  const [glitchId, setGlitchId] = useState(0);
  const [glitching, setGlitching] = useState(false);

  const cut = () => {
    setGlitching(true);
    setGlitchId(n => n + 1);
    setTimeout(() => setGlitching(false), 130);
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setPhase(5); return; }
    const T = (fn: () => void, ms: number) => setTimeout(fn, ms);
    const timers = [
      T(() => setPhase(1), 80),
      T(() => { cut(); setPhase(2); }, 2400),
      T(() => { cut(); setPhase(3); }, 5400),
      T(() => setEvidIdx(1), 8400),
      T(() => setEvidIdx(2), 11400),
      T(() => { cut(); setPhase(4); }, 14400),
      T(() => { cut(); setPhase(5); }, 18400),
    ];
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full overflow-hidden relative" style={{ background: t.bg }}>
      {/* Phase dots only — no label */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {([1, 2, 3, 4, 5] as const).map(p => (
          <motion.div key={p}
            animate={{ width: p === phase ? 20 : 6, background: p === phase ? t.accent : t.hair }}
            transition={SPRING_SNAPPY}
            style={{ height: 4, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* Glitch cut flash */}
      <AnimatePresence>{glitching && <GlitchFlash key={glitchId} id={glitchId} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 1 && <ActI key="act1" t={t} />}
        {phase === 2 && <ActII key="act2" t={t} />}
        {phase === 3 && <ActIII key="act3" t={t} evidIdx={evidIdx} setEvidIdx={setEvidIdx} />}
        {phase === 4 && <ActIV key="act4" t={t} />}
        {phase === 5 && <ActV key="act5" t={t} />}
      </AnimatePresence>
      <EmblemCorner />
    </div>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const SLIDES = [
  Slide01Opening, Slide02Problem, Slide03SoftwareFallsShort, Slide04Introducing,
  Slide05MissionControl, Slide06CoreIntelligence, Slide07Projects, Slide08People,
  Slide09Clients, Slide10Knowledge, Slide11Automation, SlideDemo, Slide12Architecture,
  Slide13Technology, Slide14BusinessImpact, Slide15Vision, Slide16Closing,
];

// ─── Nav Dot ──────────────────────────────────────────────────────────────────

function NavDot({ active, onClick }: { active: boolean; onClick: () => void }) {
  const t = useT();
  return (
    <motion.button onClick={onClick}
      animate={{ width: active ? 20 : 6, background: active ? t.accent : t.hair }}
      transition={SPRING_SNAPPY}
      className="rounded-full" style={{ height: 6 }} />
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// Timestamp (seconds) at which each slide should begin during narration playback.
// Adjust after generating audio if pacing shifts.
const SLIDE_CUE_TIMES = [0, 12, 28, 44, 56, 70, 83, 95, 106, 117, 128, 140, 150, 162, 172, 185, 197];

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [themeIdx, setThemeIdx] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cueRef = useRef(0);
  const themeKey = THEME_CYCLE[themeIdx];
  const theme = THEMES[themeKey];

  const go = useCallback((next: number) => {
    if (next < 0 || next >= SLIDES.length) return;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  const startPresent = useCallback(() => {
    const audio = new Audio("/audio/nexus-narration.mp3");
    audioRef.current = audio;
    cueRef.current = 0;
    go(0);
    setIsPresenting(true);

    audio.addEventListener("timeupdate", () => {
      const t = audio.currentTime;
      let next = cueRef.current;
      while (next < SLIDE_CUE_TIMES.length - 1 && t >= SLIDE_CUE_TIMES[next + 1]) {
        next++;
      }
      if (next !== cueRef.current) {
        cueRef.current = next;
        setDirection(1);
        setCurrent(next);
      }
    });

    audio.addEventListener("ended", () => setIsPresenting(false));
    audio.play();
  }, [go]);

  const stopPresent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPresenting(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!splashDone || isPresenting) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(current + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   go(current - 1);
      if (e.key === "Escape") stopPresent();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, go, splashDone, isPresenting, stopPresent]);

  const SlideComponent = SLIDES[current];

  return (
    <ThemeCtx.Provider value={theme}>
      <motion.div
        className="w-screen h-screen overflow-hidden relative select-none"
        animate={{ background: theme.bg }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Cinematic splash */}
        <AnimatePresence>
          {!splashDone && <Splash key="splash" onDone={() => setSplashDone(true)} />}
        </AnimatePresence>

        {/* Slide progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] z-10 rounded-full"
          style={{ background: theme.accent }}
          animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
          transition={SPRING_HEAVY}
        />

        {/* Theme toggle */}
        <ThemeToggle themeKey={themeKey} onToggle={() => setThemeIdx((i) => (i + 1) % THEME_CYCLE.length)} />

        {/* Slides */}
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
              if (!splashDone) return;
              if (info.offset.x < -55 && info.velocity.x < -60) go(current + 1);
              if (info.offset.x >  55 && info.velocity.x >  60) go(current - 1);
            }}
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>

        {/* Prev */}
        {splashDone && current > 0 && (
          <motion.button onClick={() => go(current - 1)}
            whileHover={{ opacity: 1, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={SPRING_BOUNCY}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-25"
            style={{ background: theme.surf, color: theme.text }}>
            <ChevronLeft size={18} />
          </motion.button>
        )}

        {/* Next */}
        {splashDone && current < SLIDES.length - 1 && (
          <motion.button onClick={() => go(current + 1)}
            whileHover={{ opacity: 1, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={SPRING_BOUNCY}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-25"
            style={{ background: theme.surf, color: theme.text }}>
            <ChevronRight size={18} />
          </motion.button>
        )}

        {/* Bottom nav */}
        {splashDone && (
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
            <p className="text-xs font-mono" style={{ color: theme.muted }}>
              {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => <NavDot key={i} active={i === current} onClick={() => !isPresenting && go(i)} />)}
            </div>
            <motion.button
              onClick={isPresenting ? stopPresent : startPresent}
              whileHover={{ opacity: 1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_SNAPPY}
              className="mt-1 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase"
              style={{
                background: isPresenting ? "rgba(201,64,64,0.18)" : "rgba(255,255,255,0.07)",
                color: isPresenting ? "#C94040" : theme.dim,
                border: `1px solid ${isPresenting ? "rgba(201,64,64,0.35)" : theme.hair}`,
              }}
            >
              {isPresenting ? "⏹ Stop" : "▶ Present"}
            </motion.button>
          </div>
        )}
      </motion.div>
    </ThemeCtx.Provider>
  );
}
