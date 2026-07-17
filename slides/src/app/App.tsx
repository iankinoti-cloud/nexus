import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, FolderKanban, Building2, BookOpen, Zap, Brain,
  ChevronLeft, ChevronRight, AlertTriangle, TrendingUp,
  BarChart3, Search, ArrowRight, Cpu, Globe,
  Shield, Database, Network
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import nexusEmblem from "@/imports/NEXUS-_-EMBLEM.jpeg";

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

// ─── Shared Components ────────────────────────────────────────────────────────

const TEAL = "#4FD1C5";
const BG = "#0B0B0F";
const SURFACE = "#15151B";
const SURFACE2 = "#1E1E26";

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
       style={{ color: TEAL }}>
      {children}
    </p>
  );
}

function SlideHeadline({ children, size = "lg" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = { sm: "text-4xl", md: "text-5xl", lg: "text-6xl", xl: "text-7xl" };
  return (
    <h1 className={`${sizes[size]} font-light leading-[1.1] tracking-tight text-[#F4F4F5]`}>
      {children}
    </h1>
  );
}

function SlideSubhead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xl font-light leading-relaxed mt-4" style={{ color: "#A1A1AA" }}>
      {children}
    </p>
  );
}

function Stagger({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function EmblemCorner() {
  return (
    <div className="absolute bottom-8 right-10 opacity-60">
      <ImageWithFallback
        src={nexusEmblem}
        alt="NEXUS emblem"
        className="w-7 h-7 object-contain"
      />
    </div>
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

// ─── Slides ───────────────────────────────────────────────────────────────────

function Slide01Opening() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20">
      <Stagger delay={0}>
        <div className="flex justify-center mb-10">
          <ImageWithFallback
            src={nexusEmblem}
            alt="NEXUS emblem"
            className="w-44 h-44 object-contain"
          />
        </div>
      </Stagger>
      <Stagger delay={0.15}>
        <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase mb-10"
           style={{ color: TEAL }}>
          NEXUS
        </p>
      </Stagger>
      <Stagger delay={0.3}>
        <h1 className="text-center text-[72px] font-light leading-[1.1] tracking-tight text-[#F4F4F5] max-w-4xl mx-auto">
          The Operating System Behind Every Creative Enterprise.
        </h1>
      </Stagger>
    </div>
  );
}

function Slide02Problem() {
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
        <SlideHeadline>Creative businesses are<br/>drowning in disconnection.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-2 gap-4 mt-12 max-w-3xl">
        {problems.map((p, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1}>
            <div className="p-6 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.06)", borderLeft: `2px solid ${TEAL}33` }}>
              <div className="flex items-center gap-3 mb-3">
                <span style={{ color: TEAL }}>{p.icon}</span>
                <span className="text-2xl font-semibold text-[#F4F4F5]">{p.stat}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{p.desc}</p>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide03SoftwareFallsShort() {
  const rows = [
    { tools: "Manages tasks and deadlines", need: "Understands project relationships" },
    { tools: "Stores files and documents", need: "Surfaces relevant knowledge proactively" },
    { tools: "Tracks hours and capacity", need: "Predicts burnout before it happens" },
    { tools: "Logs client interactions", need: "Scores and strengthens relationships" },
    { tools: "Runs isolated workflows", need: "Connects decisions across departments" },
  ];
  return (
    <SlideWrapper>
      <div className="grid grid-cols-2 gap-20 items-start">
        <div>
          <Stagger delay={0}><SlideLabel>Why Existing Software Falls Short</SlideLabel></Stagger>
          <Stagger delay={0.1}>
            <SlideHeadline size="md">Built for tasks.<br/>Not for intelligence.</SlideHeadline>
          </Stagger>
          <Stagger delay={0.25}>
            <SlideSubhead>Every tool optimizes for its own silo. Nobody connects the dots.</SlideSubhead>
          </Stagger>
        </div>
        <div className="space-y-0 mt-8">
          <Stagger delay={0.1}>
            <div className="grid grid-cols-2 pb-3 mb-1">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a5a" }}>What tools do</p>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: TEAL }}>What you need</p>
            </div>
          </Stagger>
          {rows.map((r, i) => (
            <Stagger key={i} delay={0.2 + i * 0.08}>
              <div className="grid grid-cols-2 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-sm pr-4" style={{ color: "#52525b" }}>{r.tools}</p>
                <p className="text-sm" style={{ color: "#F4F4F5" }}>{r.need}</p>
              </div>
            </Stagger>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function Slide04Introducing() {
  const nodes = [
    { icon: <Users size={24} />, label: "People" },
    { icon: <FolderKanban size={24} />, label: "Projects" },
    { icon: <Building2 size={24} />, label: "Clients" },
    { icon: <BookOpen size={24} />, label: "Knowledge" },
    { icon: <Zap size={24} />, label: "Operations" },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20">
      <Stagger delay={0}><SlideLabel>Introducing NEXUS</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <h1 className="text-center text-[100px] font-light tracking-[-0.02em] text-[#F4F4F5] leading-none mb-4">
          NEXUS
        </h1>
      </Stagger>
      <Stagger delay={0.2}>
        <p className="text-center text-2xl font-light" style={{ color: "#A1A1AA" }}>
          The Intelligence Layer for Creative Enterprises
        </p>
      </Stagger>
      <Stagger delay={0.35}>
        <div className="flex items-center gap-0 mt-16">
          {nodes.map((n, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-3 px-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border"
                     style={{ background: SURFACE, borderColor: TEAL + "40", color: TEAL }}>
                  {n.icon}
                </div>
                <span className="text-sm font-medium text-[#F4F4F5]">{n.label}</span>
              </div>
              {i < nodes.length - 1 && (
                <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, ${TEAL}60, ${TEAL}20)` }} />
              )}
            </div>
          ))}
        </div>
      </Stagger>
      <EmblemCorner />
    </div>
  );
}

function Slide05MissionControl() {
  const kpis = [
    { label: "Active Projects", value: "47", sub: "+3 this week" },
    { label: "Revenue at Risk", value: "$2.1M", sub: "Needs attention" },
    { label: "Team Utilization", value: "84%", sub: "PM team at 105%" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Mission Control</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Executive clarity,<br/>in real time.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {kpis.map((k, i) => (
          <Stagger key={i} delay={0.2 + i * 0.08}>
            <div className="p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-medium tracking-wide uppercase mb-2" style={{ color: "#A1A1AA" }}>{k.label}</p>
              <p className="text-4xl font-semibold text-[#F4F4F5] mb-1">{k.value}</p>
              <p className="text-xs" style={{ color: TEAL }}>{k.sub}</p>
            </div>
          </Stagger>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4 mt-4">
        <Stagger delay={0.4}>
          <div className="col-span-3 p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: "#A1A1AA" }}>Revenue Pipeline — 2025</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={pipelineData}>
                <defs>
                  <linearGradient id="nexusTealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: SURFACE2, border: "none", borderRadius: 8, color: "#F4F4F5", fontSize: 12 }} formatter={(v: number) => [`$${v}M`, "Pipeline"]} />
                <Area type="monotone" dataKey="value" stroke={TEAL} strokeWidth={2} fill="url(#nexusTealGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Stagger>
        <Stagger delay={0.48}>
          <div className="col-span-2 p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: "#A1A1AA" }}>Team Capacity</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={capacityData} barSize={8}>
                <XAxis dataKey="team" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: SURFACE2, border: "none", borderRadius: 8, color: "#F4F4F5", fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Utilized"]} />
                <Bar dataKey="used" fill={TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Stagger>
      </div>
    </SlideWrapper>
  );
}

function Slide06CoreIntelligence() {
  const insights = [
    { type: "Capacity Alert", msg: "Aria Chen is approaching 105% capacity — redistribute 2 tasks before Thursday.", time: "Just now" },
    { type: "Relationship Risk", msg: "Meridian Group last contacted 14 days ago. Senior stakeholder has gone silent.", time: "2h ago" },
    { type: "Project Drift", msg: "Project Aurora is tracking 12 days behind. Three dependencies unresolved.", time: "4h ago" },
  ];
  return (
    <SlideWrapper>
      <div className="grid grid-cols-2 gap-20 items-center h-full">
        <div>
          <Stagger delay={0}><SlideLabel>Core Intelligence</SlideLabel></Stagger>
          <Stagger delay={0.1}>
            <h1 className="text-[86px] font-light leading-none tracking-tight text-[#F4F4F5] mb-6">Core</h1>
          </Stagger>
          <Stagger delay={0.2}>
            <SlideSubhead>The AI engine at the heart of everything. Continuously learning, always watching, proactively surfacing what matters.</SlideSubhead>
          </Stagger>
          <Stagger delay={0.3}>
            <div className="flex items-center gap-3 mt-8">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: TEAL }} />
              <p className="text-sm font-medium" style={{ color: TEAL }}>Active — 847 signals processed today</p>
            </div>
          </Stagger>
        </div>
        <div className="space-y-3">
          {insights.map((ins, i) => (
            <Stagger key={i} delay={0.25 + i * 0.12}>
              <div className="p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)", borderLeft: `2px solid ${TEAL}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: TEAL }}>{ins.type}</span>
                  <span className="text-xs" style={{ color: "#52525b" }}>{ins.time}</span>
                </div>
                <p className="text-sm leading-relaxed text-[#F4F4F5]">{ins.msg}</p>
              </div>
            </Stagger>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function Slide07Projects() {
  const projects = [
    { name: "Apex Brand Refresh", client: "Apex Industries", phase: "Design", progress: 68, status: "On Track", due: "Aug 14" },
    { name: "Aurora Campaign", client: "Stellar Media", phase: "Production", progress: 34, status: "At Risk", due: "Jul 29" },
    { name: "Meridian Web Overhaul", client: "Meridian Group", phase: "Strategy", progress: 91, status: "On Track", due: "Aug 2" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Projects</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Intelligent from kickoff<br/>to close.</SlideHeadline>
      </Stagger>
      <div className="space-y-3 mt-10 max-w-4xl">
        {projects.map((p, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1}>
            <div className="p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-base font-medium text-[#F4F4F5]">{p.name}</span>
                  <span className="text-sm ml-3" style={{ color: "#A1A1AA" }}>{p.client}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: p.status === "On Track" ? TEAL + "20" : "#ef444420", color: p.status === "On Track" ? TEAL : "#f87171" }}>
                    {p.status}
                  </span>
                  <span className="text-xs" style={{ color: "#52525b" }}>Due {p.due}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, background: p.status === "On Track" ? TEAL : "#f87171" }} />
                </div>
                <span className="text-xs font-medium text-[#F4F4F5] w-8 text-right">{p.progress}%</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: SURFACE2, color: "#A1A1AA" }}>{p.phase}</span>
              </div>
            </div>
          </Stagger>
        ))}
      </div>
      <Stagger delay={0.55}>
        <div className="mt-4 p-4 rounded-xl border flex items-start gap-3 max-w-4xl" style={{ background: TEAL + "0C", borderColor: TEAL + "30" }}>
          <Brain size={16} style={{ color: TEAL, marginTop: 2, flexShrink: 0 }} />
          <p className="text-sm" style={{ color: TEAL }}>Core insight: Aurora campaign is at risk due to unresolved asset approvals from the Stellar Media legal team. 3 days of buffer remaining.</p>
        </div>
      </Stagger>
    </SlideWrapper>
  );
}

function Slide08People() {
  const team = [
    { name: "Aria Chen", role: "Senior Designer", utilization: 105, risk: "high", avatar: "AC" },
    { name: "Marcus Webb", role: "Creative Director", utilization: 72, risk: "low", avatar: "MW" },
    { name: "Priya Nair", role: "Copywriter", utilization: 88, risk: "medium", avatar: "PN" },
    { name: "James Okafor", role: "Strategist", utilization: 61, risk: "low", avatar: "JO" },
  ];
  const riskColor = { low: TEAL, medium: "#f59e0b", high: "#ef4444" };
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>People</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">See your team<br/>with clarity.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-2 gap-4 mt-10 max-w-4xl">
        {team.map((m, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1}>
            <div className="p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: TEAL + "20", color: TEAL }}>
                  {m.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F4F4F5]">{m.name}</p>
                  <p className="text-xs" style={{ color: "#A1A1AA" }}>{m.role}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: riskColor[m.risk as keyof typeof riskColor] }} />
                  <span className="text-xs capitalize" style={{ color: riskColor[m.risk as keyof typeof riskColor] }}>{m.risk} risk</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(m.utilization, 100)}%`, background: m.utilization > 100 ? "#ef4444" : m.utilization > 85 ? "#f59e0b" : TEAL }} />
                </div>
                <span className="text-sm font-medium" style={{ color: m.utilization > 100 ? "#ef4444" : "#F4F4F5" }}>{m.utilization}%</span>
              </div>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide09Clients() {
  const clients = [
    { name: "Apex Industries", initials: "AI", lastContact: "3 days ago", health: 92, openItems: 2, trend: "up" },
    { name: "Meridian Group", initials: "MG", lastContact: "14 days ago", health: 58, openItems: 7, trend: "down" },
    { name: "Stellar Media", initials: "SM", lastContact: "1 day ago", health: 85, openItems: 1, trend: "up" },
    { name: "Crest Financial", initials: "CF", lastContact: "6 days ago", health: 74, openItems: 4, trend: "neutral" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Clients</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Relationships,<br/>not just records.</SlideHeadline>
      </Stagger>
      <div className="space-y-3 mt-10 max-w-4xl">
        <Stagger delay={0.15}>
          <div className="grid grid-cols-4 pb-2 px-5">
            {["Client", "Last Contact", "Relationship Health", "Open Items"].map((h) => (
              <p key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#3f3f50" }}>{h}</p>
            ))}
          </div>
        </Stagger>
        {clients.map((c, i) => (
          <Stagger key={i} delay={0.2 + i * 0.08}>
            <div className="grid grid-cols-4 items-center p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: TEAL + "18", color: TEAL }}>
                  {c.initials}
                </div>
                <span className="text-sm font-medium text-[#F4F4F5]">{c.name}</span>
              </div>
              <span className="text-sm" style={{ color: c.lastContact.includes("14") ? "#f87171" : "#A1A1AA" }}>{c.lastContact}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${c.health}%`, background: c.health > 80 ? TEAL : c.health > 65 ? "#f59e0b" : "#ef4444" }} />
                </div>
                <span className="text-sm font-medium text-[#F4F4F5]">{c.health}%</span>
              </div>
              <span className="text-sm" style={{ color: "#A1A1AA" }}>{c.openItems} items</span>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide10Knowledge() {
  const results = [
    { source: "Project Brief — Apex 2023", excerpt: "Client prioritized sustainability messaging over product specs. Legal required 48h review for all claim-based copy." },
    { source: "Post-mortem — Meridian Rebrand", excerpt: "Timeline slippage caused by late-stage stakeholder additions. Recommend gating Phase 2 with full sign-off protocol." },
    { source: "Strategy Deck — Stellar Launch", excerpt: "Target demo skews 28–40, premium urban. Avoid aspirational clichés; lead with utility and belonging." },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Knowledge</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Your organization<br/>never forgets.</SlideHeadline>
      </Stagger>
      <Stagger delay={0.2}>
        <div className="mt-10 max-w-4xl">
          <div className="flex items-center gap-3 p-4 rounded-xl border mb-6" style={{ background: SURFACE, borderColor: TEAL + "40" }}>
            <Search size={16} style={{ color: TEAL }} />
            <span className="text-sm text-[#F4F4F5]">What did we learn from the Apex rebranding project?</span>
            <div className="ml-auto">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: TEAL }} />
            </div>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <Stagger key={i} delay={0.3 + i * 0.1}>
                <div className="p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: TEAL }}>{r.source}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{r.excerpt}</p>
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
  const flow = [
    { label: "Trigger", desc: "Project milestone reached", icon: <Zap size={20} /> },
    { label: "Condition", desc: "Client inactive > 7 days", icon: <AlertTriangle size={20} /> },
    { label: "Action", desc: "Draft and send follow-up brief", icon: <ArrowRight size={20} /> },
    { label: "Outcome", desc: "Log to CRM, update health score", icon: <TrendingUp size={20} /> },
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
        <SlideHeadline size="md">Intelligence<br/>in motion.</SlideHeadline>
      </Stagger>
      <Stagger delay={0.2}>
        <div className="flex items-center gap-0 mt-10 max-w-4xl">
          {flow.map((f, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex-1 p-4 rounded-xl border text-center" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="flex justify-center mb-2" style={{ color: TEAL }}>{f.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: TEAL }}>{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#A1A1AA" }}>{f.desc}</p>
              </div>
              {i < flow.length - 1 && (
                <div className="w-6 h-px mx-1 flex-shrink-0" style={{ borderTop: `1px dashed ${TEAL}60` }} />
              )}
            </div>
          ))}
        </div>
      </Stagger>
      <div className="space-y-3 mt-8 max-w-4xl">
        {workflows.map((w, i) => (
          <Stagger key={i} delay={0.35 + i * 0.1}>
            <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: TEAL + "20", color: TEAL }}>{i + 1}</div>
              <p className="text-sm" style={{ color: "#A1A1AA" }}>{w}</p>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide12Architecture() {
  const layers = [
    { name: "Presentation Layer", items: ["Web App", "Mobile App", "API Consumers", "Embedded Widgets"], desc: "React · TypeScript · Tailwind" },
    { name: "Intelligence Layer", items: ["Core AI Engine", "Recommendation System", "Semantic Search", "Automation Engine"], desc: "Python · LangChain · Vector DB" },
    { name: "Data Layer", items: ["Entity Graph", "Event Stream", "Document Store", "Analytics Warehouse"], desc: "PostgreSQL · Redis · S3 · Snowflake" },
    { name: "Infrastructure Layer", items: ["Multi-Region Cloud", "Zero-Trust Network", "SOC 2 Type II", "99.99% SLA"], desc: "AWS · Kubernetes · Terraform" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Architecture</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Built for<br/>enterprise scale.</SlideHeadline>
      </Stagger>
      <div className="space-y-3 mt-10 max-w-5xl">
        {layers.map((l, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1}>
            <div className="flex items-center p-5 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)", borderLeft: `2px solid ${TEAL}${i === 1 ? "" : "50"}` }}>
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-semibold text-[#F4F4F5]">{l.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#52525b" }}>{l.desc}</p>
              </div>
              <div className="flex gap-2 flex-wrap flex-1 ml-8">
                {l.items.map((item) => (
                  <span key={item} className="text-xs px-3 py-1.5 rounded-full" style={{ background: SURFACE2, color: "#A1A1AA" }}>{item}</span>
                ))}
              </div>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide13Technology() {
  const stacks = [
    { name: "Frontend", icon: <Globe size={18} />, items: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "PWA"] },
    { name: "Backend", icon: <Database size={18} />, items: ["Node.js", "GraphQL", "REST API", "WebSockets", "gRPC"] },
    { name: "AI & ML", icon: <Cpu size={18} />, items: ["GPT-4o", "Claude 3", "LangChain", "Pinecone", "PyTorch"] },
    { name: "Infrastructure", icon: <Shield size={18} />, items: ["AWS EKS", "Terraform", "GitHub Actions", "DataDog", "Vault"] },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Technology</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">The stack behind<br/>NEXUS.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-4 gap-4 mt-10 max-w-5xl">
        {stacks.map((s, i) => (
          <Stagger key={i} delay={0.2 + i * 0.1}>
            <div className="p-6 rounded-xl border h-full" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 mb-5">
                <span style={{ color: TEAL }}>{s.icon}</span>
                <p className="text-sm font-semibold text-[#F4F4F5]">{s.name}</p>
              </div>
              <div className="space-y-2">
                {s.items.map((item) => (
                  <div key={item} className="px-3 py-2 rounded-lg text-xs font-mono" style={{ background: SURFACE2, color: "#A1A1AA" }}>
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

function Slide14BusinessImpact() {
  const metrics = [
    { value: "+47%", label: "On-time project delivery", sub: "vs. industry average of +12%" },
    { value: "−31%", label: "Client churn rate", sub: "Relationship intelligence at work" },
    { value: "3.2×", label: "Knowledge reuse", sub: "Fewer reinvented wheels" },
    { value: "18hrs", label: "Saved per manager, per week", sub: "Redirected to high-value work" },
  ];
  return (
    <SlideWrapper>
      <Stagger delay={0}><SlideLabel>Business Impact</SlideLabel></Stagger>
      <Stagger delay={0.1}>
        <SlideHeadline size="md">Measurable outcomes<br/>from day one.</SlideHeadline>
      </Stagger>
      <div className="grid grid-cols-2 gap-4 mt-10 max-w-4xl">
        {metrics.map((m, i) => (
          <Stagger key={i} delay={0.2 + i * 0.12}>
            <div className="p-8 rounded-xl border" style={{ background: SURFACE, borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-[72px] font-bold leading-none tracking-tight mb-3" style={{ color: TEAL }}>{m.value}</p>
              <p className="text-base font-medium text-[#F4F4F5] mb-1">{m.label}</p>
              <p className="text-sm" style={{ color: "#52525b" }}>{m.sub}</p>
            </div>
          </Stagger>
        ))}
      </div>
    </SlideWrapper>
  );
}

function Slide15Vision() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full" style={{ background: `radial-gradient(circle, ${TEAL}08 0%, transparent 70%)` }} />
      </div>
      <div className="relative z-10 max-w-3xl text-center">
        <Stagger delay={0}><SlideLabel>The Future</SlideLabel></Stagger>
        <Stagger delay={0.15}>
          <SlideHeadline xl>The intelligent<br/>creative enterprise.</SlideHeadline>
        </Stagger>
        <Stagger delay={0.3}>
          <p className="text-xl font-light leading-relaxed mt-8" style={{ color: "#A1A1AA" }}>
            We are building toward a world where every creative organization operates with the clarity and intelligence of the best ones. Where decisions are informed, talent is protected, clients are delighted, and knowledge compounds over time. NEXUS is not software — it is organizational intelligence, made real.
          </p>
        </Stagger>
      </div>
      <EmblemCorner />
    </div>
  );
}

function Slide16Closing() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-24 py-20">
      <Stagger delay={0}>
        <div className="flex justify-center mb-10">
          <ImageWithFallback
            src={nexusEmblem}
            alt="NEXUS emblem"
            className="w-44 h-44 object-contain"
          />
        </div>
      </Stagger>
      <Stagger delay={0.15}>
        <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase mb-10" style={{ color: TEAL }}>
          NEXUS
        </p>
      </Stagger>
      <Stagger delay={0.3}>
        <h1 className="text-center text-[72px] font-light leading-[1.1] tracking-tight text-[#F4F4F5] max-w-4xl mx-auto">
          One Platform.<br/>Infinite Possibilities.
        </h1>
      </Stagger>
      <Stagger delay={0.45}>
        <p className="text-center text-xl font-light mt-6" style={{ color: "#A1A1AA" }}>
          The Operating System for Creative Enterprises.
        </p>
      </Stagger>
      <Stagger delay={0.6}>
        <p className="text-center text-sm mt-12 tracking-widest" style={{ color: "#3f3f50" }}>
          nexus.ai
        </p>
      </Stagger>
    </div>
  );
}

// ─── Slide Registry ───────────────────────────────────────────────────────────

const SLIDES = [
  Slide01Opening,
  Slide02Problem,
  Slide03SoftwareFallsShort,
  Slide04Introducing,
  Slide05MissionControl,
  Slide06CoreIntelligence,
  Slide07Projects,
  Slide08People,
  Slide09Clients,
  Slide10Knowledge,
  Slide11Automation,
  Slide12Architecture,
  Slide13Technology,
  Slide14BusinessImpact,
  Slide15Vision,
  Slide16Closing,
];

// ─── Navigation Dot ───────────────────────────────────────────────────────────

function NavDot({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 rounded-full"
      style={{ width: active ? 20 : 6, height: 6, background: active ? TEAL : "rgba(255,255,255,0.2)" }}
    />
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((next: number) => {
    if (next < 0 || next >= SLIDES.length) return;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, go]);

  const SlideComponent = SLIDES[current];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative select-none" style={{ background: BG }}>

      {/* Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <SlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Prev button */}
      {current > 0 && (
        <button
          onClick={() => go(current - 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity"
          style={{ background: SURFACE, color: "#F4F4F5" }}
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Next button */}
      {current < SLIDES.length - 1 && (
        <button
          onClick={() => go(current + 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity"
          style={{ background: SURFACE, color: "#F4F4F5" }}
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Bottom nav */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
        <p className="text-xs font-mono" style={{ color: "#3f3f50" }}>
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <NavDot key={i} active={i === current} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
