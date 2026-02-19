import { useState, useEffect, useRef, useCallback } from "react";

const V = "#C4A2EF";
const G = "#B3F5C9";
const BK = "#0A0A0A";
const WH = "#FFFFFF";

const SITES = [
  {
    id: "guildhall", name: "Guildhall Yard", shortName: "Guildhall", era: "1050 – 1540", n: 78,
    tag: "Labour, violence and civic power",
    mapX: 48, mapY: 34,
    desc: "Beneath London's seat of governance, Guildhall Yard concealed a medieval cemetery layered atop a Roman amphitheatre. Seventy-eight individuals were recovered from densely packed burials spanning five centuries of civic life.",
    findings: [
      "High osteoarthritis rates reveal lives of relentless physical toil",
      "Dental enamel hypoplasia indicates repeated childhood nutritional stress",
      "Healed fractures suggest interpersonal violence — broken noses, defensive forearm injuries",
      "Rising dental caries rates point to diets increasingly reliant on refined grains",
    ],
    demo: { m: 45, f: 28, c: 5 },
    height: { m: 170.2, f: 158.7 },
    path: [
      { name: "Dental Disease", pct: 72 }, { name: "Osteoarthritis", pct: 58 },
      { name: "Periostitis", pct: 34 }, { name: "Fractures", pct: 22 },
      { name: "Cribra Orbitalia", pct: 18 },
    ],
    bio: { id: "GY-042", name: "The Guildhall Clerk", age: "35–45", sex: "Male", h: "171 cm",
      text: "Pronounced bone spurs at his right finger attachment sites suggest a lifetime of repetitive gripping — perhaps quill work. His teeth, heavily worn but cavity-free, indicate a diet of coarse bread. A healed left forearm fracture hints at an earlier altercation.",
      q: "Was he a scribe in the Guildhall? His burial location suggests civic proximity, yet his bones tell of modest means." },
    quiz: { q: "What does DISH typically indicate in medieval populations?", o: ["Plague exposure", "A rich, high-calorie diet", "Childhood malnutrition", "Tuberculosis"], a: 1 },
  },
  {
    id: "dominican", name: "Dominican Friary", shortName: "Black Friars", era: "1240 – 1538", n: 132,
    tag: "Wealth, prayer and continental origins",
    mapX: 26, mapY: 42,
    desc: "The Black Friars' church near modern Blackfriars was a prestigious religious house attracting burials from London's wealthy. The cemetery reveals stark inequality — elite patrons within the church versus common burials in the yard.",
    findings: [
      "DISH prevalence among church burials signals wealthy, well-fed individuals",
      "Isotope analysis reveals several friars grew up in continental Europe",
      "One individual shows evidence of trepanation — and survived the procedure",
      "Church burials show significantly lower nutritional deficiency than yard burials",
    ],
    demo: { m: 72, f: 38, c: 22 },
    height: { m: 172.1, f: 159.3 },
    path: [
      { name: "Dental Disease", pct: 65 }, { name: "Osteoarthritis", pct: 45 },
      { name: "DISH", pct: 28 }, { name: "Periostitis", pct: 25 },
      { name: "Gout", pct: 12 },
    ],
    bio: { id: "DF-089", name: "The Black Friar", age: "50–60", sex: "Male", h: "168 cm",
      text: "Buried in the privileged nave, DISH along his spine speaks to rich diet. His knees show advanced osteoarthritis from decades of kneeling in prayer. Isotopic analysis places his childhood in southern France.",
      q: "What compelled a young man from Provence to journey north and take Dominican vows?" },
    quiz: { q: "What technique reveals where a person grew up, centuries after death?", o: ["Carbon dating", "DNA sequencing", "Isotope analysis of tooth enamel", "X-ray fluorescence"], a: 2 },
  },
  {
    id: "stbenet", name: "St Benet Sherehog", shortName: "St Benet", era: "1050 – 1666", n: 254,
    tag: "Plague, fire and Cheapside commerce",
    mapX: 44, mapY: 50,
    desc: "Lost to the Great Fire of 1666, St Benet Sherehog served Cheapside's merchant community. Its churchyard yielded 254 individuals including molecular evidence of the Black Death itself.",
    findings: [
      "Yersinia pestis DNA extracted from 14th-century burials confirms the Black Death",
      "Mass graves from 1348–49 contain bodies stacked without coffins",
      "Several individuals show Pott's disease — spinal tuberculosis causing vertebral collapse",
      "Dental disease rates among the highest in medieval London reflect access to imported sugar",
    ],
    demo: { m: 98, f: 112, c: 44 },
    height: { m: 169.5, f: 157.8 },
    path: [
      { name: "Dental Disease", pct: 82 }, { name: "Osteoarthritis", pct: 42 },
      { name: "Periostitis", pct: 38 }, { name: "Fractures", pct: 19 },
      { name: "Tuberculosis", pct: 14 },
    ],
    bio: { id: "SBS-177", name: "The Cheapside Mother", age: "25–35", sex: "Female", h: "160 cm",
      text: "Buried with a copper-alloy ring, her skeleton reveals iron-deficiency anaemia and a healed leg fracture. Fetal bones within her pelvis indicate she died in late pregnancy or during childbirth.",
      q: "The copper ring — a wedding band? A keepsake? Its simplicity suggests modest means, yet her Cheapside burial places her among the trading class." },
    quiz: { q: "How do osteologists confirm plague in skeletal remains?", o: ["Visible bone lesions", "Extracting bacterial DNA from teeth", "Measuring bone density", "Examining burial position"], a: 1 },
  },
  {
    id: "spital", name: "St Mary Spital", shortName: "Spital Sq.", era: "1197 – 1540", n: 10516,
    tag: "10,000 souls — Britain's largest medieval cemetery",
    mapX: 68, mapY: 24,
    desc: "The most significant medieval burial excavation in Britain. Over 10,500 individuals recovered — from Black Death mass graves to the hospital's poorest patients, an unparalleled archive of medieval life and death.",
    findings: [
      "Over 10,500 burials — the largest excavated medieval cemetery in Britain",
      "Mass graves from 1348 contain hundreds buried in haste",
      "Hospital burials show dramatically higher disease rates than parish cemeteries",
      "Leprosy, probable syphilis and other infections appear far more frequently here",
    ],
    demo: { m: 4205, f: 3682, c: 2629 },
    height: { m: 171.0, f: 159.1 },
    path: [
      { name: "Dental Disease", pct: 75 }, { name: "Periostitis", pct: 45 },
      { name: "Osteoarthritis", pct: 40 }, { name: "Cribra Orbitalia", pct: 32 },
      { name: "Rickets", pct: 15 },
    ],
    bio: { id: "SRP-4401", name: "The Spital Youth", age: "12–15", sex: "Indeterminate", h: "148 cm",
      text: "Found in a Black Death mass pit. Severe cribra orbitalia and Harris lines reveal repeated childhood malnutrition. Yet teeth were forming normally at death — the plague struck swiftly, without regard for age.",
      q: "Were they a hospital patient before the plague, or an ordinary Londoner swept up in catastrophe?" },
    quiz: { q: "What are Harris lines in long bones?", o: ["Evidence of plague", "Lines of arrested growth from malnutrition", "Markers of heavy labour", "Genetic condition indicators"], a: 1 },
  },
];

/* ─────────────── SKULL AVATAR (header + docent) ─────────────── */
const SkullAvatar = ({ speaking = false, size = 44 }) => (
  <div style={{ width: size, height: size, flexShrink: 0, position: "relative" }}>
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      <circle cx="50" cy="50" r="48" fill={BK} />
      <g transform="translate(50,46)">
        {/* Cranium */}
        <path d="M-26 -6 C-26 -30 -20 -40 0 -40 C20 -40 26 -30 26 -6 C26 4 22 10 16 14 L12 14 L8 24 L-8 24 L-12 14 L-16 14 C-22 10 -26 4 -26 -6 Z"
          fill="none" stroke={WH} strokeWidth="2.6" strokeLinejoin="round" />
        {/* Sutures */}
        <path d="M0 -40 Q-1 -30 0 -18" fill="none" stroke={WH} strokeWidth="0.7" opacity="0.2" />
        <path d="M-16 -36 Q-8 -33 0 -34 Q8 -33 16 -36" fill="none" stroke={WH} strokeWidth="0.5" opacity="0.15" />
        {/* Brow ridge */}
        <path d="M-20 -18 Q-10 -22 0 -20 Q10 -22 20 -18" fill="none" stroke={WH} strokeWidth="1.4" opacity="0.45" />
        {/* Eye sockets — deep dark voids */}
        <ellipse cx="-9" cy="-10" rx="8" ry="9" fill={BK} stroke={WH} strokeWidth="2.2" />
        <ellipse cx="9" cy="-10" rx="8" ry="9" fill={BK} stroke={WH} strokeWidth="2.2" />
        {speaking && <>
          <ellipse cx="-9" cy="-10" rx="3.5" ry="4" fill={V} opacity="0.55">
            <animate attributeName="opacity" values="0.55;0.1;0.55" dur="1.8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="9" cy="-10" rx="3.5" ry="4" fill={G} opacity="0.55">
            <animate attributeName="opacity" values="0.1;0.55;0.1" dur="1.8s" repeatCount="indefinite" />
          </ellipse>
        </>}
        {/* Nasal cavity — inverted heart */}
        <path d="M-4 0 C-5 -4 -1.5 -7 0 -7 C1.5 -7 5 -4 4 0 C3.5 3 1.5 6 0 7 C-1.5 6 -3.5 3 -4 0 Z"
          fill={BK} stroke={WH} strokeWidth="1.6" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke={WH} strokeWidth="0.5" opacity="0.25" />
        {/* Cheekbones / zygomatic */}
        <path d="M-17 -6 C-22 -2 -22 6 -18 10" fill="none" stroke={WH} strokeWidth="1.3" opacity="0.4" />
        <path d="M17 -6 C22 -2 22 6 18 10" fill="none" stroke={WH} strokeWidth="1.3" opacity="0.4" />
        {/* Upper jaw + teeth */}
        <path d="M-14 12 Q-12 16 0 17 Q12 16 14 12" fill="none" stroke={WH} strokeWidth="1.3" />
        {[-10,-6.5,-3,0,3,6.5,10].map(x => (
          <line key={`ut${x}`} x1={x} y1={12.5 + Math.abs(x) * 0.12} x2={x} y2={16 + Math.abs(x) * 0.08}
            stroke={WH} strokeWidth="1.1" opacity="0.7" />
        ))}
        {/* Mandible */}
        <path d="M-16 14 C-18 18 -12 24 0 24 C12 24 18 18 16 14" fill="none" stroke={WH} strokeWidth="2">
          {speaking && <animate attributeName="d"
            values="M-16 14 C-18 18 -12 24 0 24 C12 24 18 18 16 14;M-16 14 C-18 20 -12 28 0 28 C12 28 18 20 16 14;M-16 14 C-18 18 -12 24 0 24 C12 24 18 18 16 14"
            dur="0.3s" repeatCount="indefinite" />}
        </path>
        {/* Lower teeth */}
        {[-8,-4.5,-1.5,1.5,4.5,8].map(x => (
          <line key={`lt${x}`} x1={x} y1={17 + Math.abs(x) * 0.1} x2={x} y2={20 + Math.abs(x) * 0.06}
            stroke={WH} strokeWidth="0.9" opacity="0.5" />
        ))}
      </g>
    </svg>
    {speaking && <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: G, animation: "pulse .8s infinite" }} />}
  </div>
);

/* ─────────────── FULL SKELETON (splash screen) ─────────────── */
const FullSkeleton = ({ size = 80 }) => (
  <svg viewBox="0 0 100 240" style={{ width: size, height: size * 2.4, display: "block" }}>
    <g transform="translate(50,12)" fill="none" stroke={BK} strokeLinecap="round">
      {/* ── SKULL ── */}
      <path d="M-18 4 C-18 -18 -13 -26 0 -26 C13 -26 18 -18 18 4 C18 12 14 16 10 19 L7 19 L5 28 L-5 28 L-7 19 L-10 19 C-14 16 -18 12 -18 4 Z" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M0 -26 Q-.5 -18 0 -8" strokeWidth=".5" opacity=".2" />
      {/* Eyes */}
      <ellipse cx="-7" cy="0" rx="6" ry="7" strokeWidth="1.8" />
      <ellipse cx="7" cy="0" rx="6" ry="7" strokeWidth="1.8" />
      {/* Nose */}
      <path d="M-3 10 C-3 8 0 5.5 0 5.5 C0 5.5 3 8 3 10 C3 12 1 14 0 14.5 C-1 14 -3 12 -3 10 Z" strokeWidth="1.3" />
      {/* Cheekbones */}
      <path d="M-14 2 C-18 5 -18 12 -14 15" strokeWidth="1" opacity=".35" />
      <path d="M14 2 C18 5 18 12 14 15" strokeWidth="1" opacity=".35" />
      {/* Upper teeth */}
      <path d="M-10 19 Q0 22 10 19" strokeWidth="1" />
      {[-7,-4,-1,1,4,7].map(x => <line key={`ut${x}`} x1={x} y1="19.5" x2={x} y2="21.5" strokeWidth=".8" opacity=".6" />)}
      {/* Mandible */}
      <path d="M-12 19 C-14 23 -9 29 0 29 C9 29 14 23 12 19" strokeWidth="1.8" />
      {[-6,-3,0,3,6].map(x => <line key={`lt${x}`} x1={x} y1="23" x2={x} y2="26" strokeWidth=".6" opacity=".45" />)}

      {/* ── NECK ── */}
      {[33,36.5,40].map(y => <ellipse key={y} cx="0" cy={y} rx="4.5" ry="2" strokeWidth=".7" opacity=".35" />)}

      {/* ── CLAVICLES ── */}
      <path d="M0 37 Q-11 34 -22 38" strokeWidth="1.8" />
      <path d="M0 37 Q11 34 22 38" strokeWidth="1.8" />

      {/* ── STERNUM ── */}
      <line x1="0" y1="39" x2="0" y2="70" strokeWidth="1.3" opacity=".45" />

      {/* ── RIBS (5 pairs) ── */}
      {[[41,48,19],[45,53,18],[49,59,17],[54,64,16],[59,68,14.5]].map(([yT,yB,w],i) => (
        <g key={`r${i}`} opacity={1 - i * .06}>
          <path d={`M0 ${yT} Q-${w+3} ${yT-1} -${w} ${(yT+yB)/2} Q-${w-2} ${yB} -${w*.55} ${yB+1.5}`} strokeWidth="1.1" />
          <path d={`M0 ${yT} Q${w+3} ${yT-1} ${w} ${(yT+yB)/2} Q${w-2} ${yB} ${w*.55} ${yB+1.5}`} strokeWidth="1.1" />
        </g>
      ))}

      {/* ── SPINE ── */}
      <line x1="0" y1="38" x2="0" y2="92" strokeWidth="1.8" />
      {[43,49,55,61,67,73,79,85].map(y => <ellipse key={y} cx="0" cy={y} rx="5" ry="1.8" strokeWidth=".5" opacity=".2" />)}

      {/* ── ARMS ── */}
      {/* Humerus */}
      <line x1="-22" y1="38" x2="-26" y2="70" strokeWidth="2" />
      <line x1="22" y1="38" x2="26" y2="70" strokeWidth="2" />
      {/* Elbow */}
      <circle cx="-26" cy="70" r="2.2" strokeWidth=".7" opacity=".3" />
      <circle cx="26" cy="70" r="2.2" strokeWidth=".7" opacity=".3" />
      {/* Radius + Ulna */}
      <line x1="-26" y1="72" x2="-22" y2="100" strokeWidth="1.5" />
      <line x1="-26" y1="72" x2="-28" y2="100" strokeWidth=".9" opacity=".35" />
      <line x1="26" y1="72" x2="22" y2="100" strokeWidth="1.5" />
      <line x1="26" y1="72" x2="28" y2="100" strokeWidth=".9" opacity=".35" />
      {/* Hands */}
      {[[-22,100,-1],[22,100,1]].map(([hx,hy,d]) => (
        <g key={`h${d}`}>
          {[[-3,9],[-1.2,11],[.8,11],[2.8,10],[4.2,7]].map(([dx,dy],i) => (
            <g key={i}>
              <line x1={hx} y1={hy} x2={hx+dx*d} y2={hy+dy*.55} strokeWidth=".65" opacity=".4" />
              <line x1={hx+dx*d} y1={hy+dy*.55} x2={hx+dx*d*1.15} y2={hy+dy} strokeWidth=".5" opacity=".3" />
            </g>
          ))}
        </g>
      ))}

      {/* ── PELVIS ── */}
      <path d="M-13 92 Q-22 98 -20 108 Q-11 112 0 108 Q11 112 20 108 Q22 98 13 92" strokeWidth="2" />
      <path d="M-6 92 Q0 100 6 92" strokeWidth=".6" opacity=".2" />

      {/* ── LEGS ── */}
      {/* Femur */}
      <line x1="-11" y1="108" x2="-13" y2="148" strokeWidth="2.2" />
      <line x1="11" y1="108" x2="13" y2="148" strokeWidth="2.2" />
      <circle cx="-11" cy="108" r="2.5" strokeWidth=".7" opacity=".3" />
      <circle cx="11" cy="108" r="2.5" strokeWidth=".7" opacity=".3" />
      {/* Patella */}
      <ellipse cx="-13" cy="149" rx="2.8" ry="3.5" strokeWidth=".9" opacity=".35" />
      <ellipse cx="13" cy="149" rx="2.8" ry="3.5" strokeWidth=".9" opacity=".35" />
      {/* Tibia + Fibula */}
      <line x1="-13" y1="153" x2="-11" y2="186" strokeWidth="1.8" />
      <line x1="-13" y1="153" x2="-15" y2="186" strokeWidth=".8" opacity=".3" />
      <line x1="13" y1="153" x2="11" y2="186" strokeWidth="1.8" />
      <line x1="13" y1="153" x2="15" y2="186" strokeWidth=".8" opacity=".3" />
      {/* Feet */}
      <path d="M-11 186 L-17 192 L-20 190" strokeWidth="1.1" opacity=".45" />
      <path d="M11 186 L17 192 L20 190" strokeWidth="1.1" opacity=".45" />
      {[-19.5,-17,-14.5].map(x => <line key={x} x1={x} y1="191" x2={x-.3} y2="194" strokeWidth=".45" opacity=".25" />)}
      {[19.5,17,14.5].map(x => <line key={x} x1={x} y1="191" x2={x+.3} y2="194" strokeWidth=".45" opacity=".25" />)}
    </g>
  </svg>
);

/* ─────────────── ANIMATED BAR ─────────────── */
const Bar = ({ pct, delay = 0 }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 60 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ flex: 1, height: 6, background: "#F0F0F0", borderRadius: 3 }}>
      <div style={{ width: `${w}%`, height: "100%", background: V, borderRadius: 3, transition: "width .9s cubic-bezier(.22,1,.36,1)" }} />
    </div>
  );
};

/* ─────────────── RESPONSIVE HOOK ─────────────── */
const useIsMobile = () => {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);
  useEffect(() => { const h = () => setM(window.innerWidth <= 768); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return m;
};

/* ═══════════════ MAIN APP ═══════════════ */
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [site, setSite] = useState(null);
  const [tab, setTab] = useState("overview");
  const [seen, setSeen] = useState({});
  const [speaking, setSpeaking] = useState(false);
  const [msg, setMsg] = useState("");
  const [quizA, setQuizA] = useState({});
  const [hov, setHov] = useState(null);
  const [step, setStep] = useState(0);
  const [mobilePanel, setMobilePanel] = useState("map");
  const panelRef = useRef(null);
  const mob = useIsMobile();

  useEffect(() => { [300, 900, 1500, 2100].forEach((d, i) => setTimeout(() => setStep(i + 1), d)); }, []);

  const say = useCallback((t) => {
    setSpeaking(true); setMsg("");
    let i = 0;
    const iv = setInterval(() => { setMsg(t.slice(0, ++i)); if (i >= t.length) { clearInterval(iv); setTimeout(() => setSpeaking(false), 500); } }, 18);
  }, []);

  const open = (s) => {
    setSite(s); setTab("overview"); setSeen(v => ({ ...v, [s.id]: true }));
    say(s.tag); setMobilePanel("detail");
    setTimeout(() => { panelRef.current?.scrollTo({ top: 0, behavior: "smooth" }); window.scrollTo({ top: 0, behavior: "smooth" }); }, 50);
  };
  const back = () => { setSite(null); setMobilePanel("map"); };

  const CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=DM+Mono:wght@300;400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#DDD;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}`;

  /* ── SPLASH ── */
  if (screen === "splash") return (
    <div style={{ minHeight: "100dvh", background: WH, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "'DM Sans',sans-serif", padding: 24 }}>
      <style>{CSS}</style>
      <div style={{ position: "absolute", top: "-12%", right: "-12%", width: "45vw", height: "45vw", maxWidth: 380, maxHeight: 380, borderRadius: "50%", background: V, opacity: step >= 1 ? .1 : 0, transition: "opacity 1s" }} />
      <div style={{ position: "absolute", bottom: "-8%", left: "-8%", width: "35vw", height: "35vw", maxWidth: 280, maxHeight: 280, background: G, opacity: step >= 2 ? .12 : 0, transition: "opacity 1s" }} />
      <div style={{ textAlign: "center", maxWidth: 520, position: "relative", zIndex: 1 }}>
        <div style={{ opacity: step >= 1 ? 1 : 0, transition: "all .8s", transform: `translateY(${step >= 1 ? 0 : 20}px)`, marginBottom: 20, display: "flex", justifyContent: "center" }}>
          <FullSkeleton size={mob ? 52 : 68} />
        </div>
        <div style={{ opacity: step >= 2 ? 1 : 0, transition: "all 1s", transform: `translateY(${step >= 2 ? 0 : 16}px)` }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: V, marginBottom: 12 }}>London Museum</p>
          <h1 style={{ fontSize: "clamp(32px,9vw,68px)", fontWeight: 900, color: BK, lineHeight: .95, margin: "0 0 12px", letterSpacing: -2 }}>Medieval<br />Graveyards</h1>
          <p style={{ fontSize: "clamp(13px,3.5vw,16px)", color: "#888", lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>Four burial sites. Thousands of skeletons.<br />Centuries of London stories in bone.</p>
        </div>
        <button onClick={() => { setScreen("explore"); setTimeout(() => say("Welcome. Pick a burial site on the map — I'll tell you what the bones remember."), 300); }}
          style={{ marginTop: 28, padding: "16px 40px", background: BK, color: WH, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", opacity: step >= 3 ? 1 : 0, transition: "all .5s" }}
          onMouseEnter={e => { e.target.style.background = V; e.target.style.color = BK; }}
          onMouseLeave={e => { e.target.style.background = BK; e.target.style.color = WH; }}>Explore</button>
        <div style={{ marginTop: 32, display: "flex", gap: "clamp(12px,4vw,28px)", justifyContent: "center", opacity: step >= 4 ? .3 : 0, transition: "opacity 1s", flexWrap: "wrap" }}>
          {["MOLA", "Oxford Archaeology", "Elementary Digital"].map(p => <span key={p} style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#AAA" }}>{p}</span>)}
        </div>
      </div>
    </div>
  );

  /* ── MAIN EXPLORE ── */
  const s = site, ct = Object.keys(seen).length;
  const showLeft = !mob || mobilePanel === "map";
  const showRight = !mob || mobilePanel === "detail";
  const px = mob ? 12 : 16;

  return (
    <div style={{ minHeight: "100dvh", background: "#FAFAFA", fontFamily: "'DM Sans',sans-serif", color: BK, display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>

      {/* ─ HEADER ─ */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `10px ${px}px`, background: WH, borderBottom: "1px solid #EEE", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SkullAvatar size={mob ? 28 : 30} />
          <span style={{ fontSize: mob ? 11 : 13, fontWeight: 700, letterSpacing: 1 }}>MEDIEVAL GRAVEYARDS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < ct ? V : "#E8E8E8", transition: "background .4s" }} />)}
          <span style={{ fontSize: 10, color: "#AAA", marginLeft: 2, fontFamily: "'DM Mono',monospace" }}>{ct}/4</span>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0, flexDirection: mob ? "column" : "row" }}>

        {/* ═══ LEFT PANEL ═══ */}
        {showLeft && (
          <div style={{ flex: mob ? "none" : "1 1 400px", padding: px, display: "flex", flexDirection: "column", gap: 12, ...(mob ? {} : { maxHeight: "calc(100dvh - 50px)", overflowY: "auto" }) }}>
            {/* Docent */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <SkullAvatar speaking={speaking} size={mob ? 36 : 44} />
              <div style={{ flex: 1, background: WH, border: "1px solid #EEE", borderRadius: "2px 10px 10px 10px", padding: "8px 12px", minHeight: 36 }}>
                <p style={{ fontSize: mob ? 13 : 14, color: "#555", lineHeight: 1.5 }}>{msg}{speaking && <span style={{ color: V, animation: "blink .6s infinite" }}>|</span>}</p>
              </div>
            </div>

            {/* Map */}
            <div style={{ background: WH, border: "1px solid #EEE", padding: mob ? 8 : 12 }}>
              <svg viewBox="0 0 100 68" style={{ width: "100%", display: "block" }}>
                {[20,30,40,50,60,70,80].map(x => <line key={x} x1={x} y1="5" x2={x} y2="63" stroke="#F0F0F0" strokeWidth=".4" />)}
                {[15,25,35,45,55].map(y => <line key={y} x1="10" y1={y} x2="90" y2={y} stroke="#F0F0F0" strokeWidth=".4" />)}
                <path d="M0 56 Q18 48 35 52 Q52 58 70 50 Q85 46 100 48" fill="none" stroke={G} strokeWidth="4" opacity=".2" />
                <path d="M0 56 Q18 48 35 52 Q52 58 70 50 Q85 46 100 48" fill="none" stroke={G} strokeWidth="1" opacity=".4" />
                <text x="84" y="51" fontSize="3.5" fill="#CCC" fontFamily="'DM Mono',monospace" letterSpacing="1">THAMES</text>
                <path d="M20 20 Q28 14 42 13 Q58 12 74 17 Q82 22 84 35 Q82 48 72 52 Q58 55 42 53 Q28 50 22 40 Z" fill="none" stroke="#DDD" strokeWidth=".5" strokeDasharray="2,2" />
                <path d={`M${SITES[3].mapX},${SITES[3].mapY} L${SITES[0].mapX},${SITES[0].mapY} L${SITES[2].mapX},${SITES[2].mapY} L${SITES[1].mapX},${SITES[1].mapY}`} fill="none" stroke="#DDD" strokeWidth=".4" strokeDasharray="2,3" />
                {SITES.map(c => {
                  const isA = s?.id === c.id, isH = hov === c.id, isV = seen[c.id];
                  const r = mob ? (isA ? 7 : 6) : (isA ? 6 : isH ? 5.5 : 4.5);
                  return (
                    <g key={c.id} style={{ cursor: "pointer" }} onMouseEnter={() => setHov(c.id)} onMouseLeave={() => setHov(null)} onClick={() => open(c)}>
                      {isA && <circle cx={c.mapX} cy={c.mapY} r="5" fill="none" stroke={V} strokeWidth="1" opacity=".4"><animate attributeName="r" values="5;13;5" dur="2.5s" repeatCount="indefinite" /><animate attributeName="opacity" values=".4;0;.4" dur="2.5s" repeatCount="indefinite" /></circle>}
                      <circle cx={c.mapX} cy={c.mapY} r={r} fill={isA ? V : WH} stroke={isA ? WH : isV ? V : "#CCC"} strokeWidth={isA ? 2 : 1.5} />
                      {isA && <circle cx={c.mapX} cy={c.mapY} r="2" fill={WH} />}
                      {!isA && isV && <circle cx={c.mapX} cy={c.mapY} r="1.5" fill={V} />}
                      {(isH || isA) && <g><rect x={c.mapX - 22} y={c.mapY - 20} width="44" height="13" rx="2" fill={BK} /><text x={c.mapX} y={c.mapY - 11} textAnchor="middle" fill={WH} fontSize="4.5" fontWeight="700" fontFamily="'DM Sans',sans-serif">{c.shortName}</text></g>}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Site list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {SITES.map(c => {
                const isA = s?.id === c.id;
                return (
                  <button key={c.id} onClick={() => open(c)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: mob ? "14px 12px" : "12px 14px",
                    background: isA ? BK : WH, border: isA ? "none" : "1px solid #EEE",
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s",
                    textAlign: "left", width: "100%",
                  }}
                    onMouseEnter={e => { if (!isA) e.currentTarget.style.borderColor = V; }}
                    onMouseLeave={e => { if (!isA) e.currentTarget.style.borderColor = "#EEE"; }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: isA ? V : seen[c.id] ? V : "#DDD", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isA ? WH : BK }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: isA ? "rgba(255,255,255,.5)" : "#AAA", fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.era} · {c.n.toLocaleString()}</div>
                    </div>
                    {seen[c.id] && !isA && <span style={{ fontSize: 10, color: V }}>●</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ RIGHT PANEL ═══ */}
        {showRight && (
          <div ref={panelRef} style={{ flex: mob ? "none" : "1 1 500px", ...(mob ? {} : { borderLeft: "1px solid #EEE", maxHeight: "calc(100dvh - 50px)", overflowY: "auto" }), background: WH }}>
            {!s ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: mob ? "auto" : "100%", textAlign: "center", minHeight: 340, padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #EEE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <div style={{ width: 18, height: 18, background: V, borderRadius: "50%", opacity: .25 }} />
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Select a site</p>
                <p style={{ fontSize: 14, color: "#AAA", maxWidth: 240, lineHeight: 1.6 }}>Choose a burial ground from the map</p>
              </div>
            ) : (
              <div key={s.id} style={{ animation: "slideIn .3s ease", padding: mob ? "18px 14px 28px" : "28px 28px 40px" }}>
                {/* Back */}
                <button onClick={back} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #EEE", background: "transparent", fontSize: 12, color: "#AAA", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 18 }}
                  onMouseEnter={e => { e.target.style.borderColor = BK; e.target.style.color = BK; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#EEE"; e.target.style.color = "#AAA"; }}>← Map</button>

                {/* Header */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <div style={{ padding: "4px 10px", background: V, fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'DM Mono',monospace", color: BK }}>{s.era}</div>
                    <span style={{ fontSize: 11, color: "#CCC", fontFamily: "'DM Mono',monospace" }}>{s.n.toLocaleString()} excavated</span>
                  </div>
                  <h2 style={{ fontSize: mob ? 22 : 30, fontWeight: 900, lineHeight: 1.05, marginBottom: 6, letterSpacing: -1 }}>{s.name}</h2>
                  <p style={{ fontSize: 14, color: "#888" }}>{s.tag}</p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #EEE", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
                  {[{ k: "overview", l: "Overview" }, { k: "data", l: "Data" }, { k: "bio", l: "Skeleton" }, { k: "quiz", l: "Quiz" }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                      padding: mob ? "10px 12px" : "10px 18px", border: "none", background: "transparent",
                      fontSize: 13, fontWeight: tab === t.k ? 700 : 400, color: tab === t.k ? BK : "#BBB",
                      cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
                      borderBottom: tab === t.k ? `2px solid ${V}` : "2px solid transparent",
                    }}>{t.l}</button>
                  ))}
                </div>

                {/* ── OVERVIEW ── */}
                {tab === "overview" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "#555", marginBottom: 22 }}>{s.desc}</p>
                    {s.findings.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "12px 0", borderTop: i ? "1px solid #F5F5F5" : "none", animation: `fadeUp .25s ease ${i * 60}ms both` }}>
                        <div style={{ width: 18, height: 18, minWidth: 18, background: i % 2 === 0 ? V : G, borderRadius: i % 2 === 0 ? "50%" : 0, opacity: .15, marginTop: 3 }} />
                        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>{f}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── DATA ── */}
                {tab === "data" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#BBB", marginBottom: 10 }}>Demographics</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 22 }}>
                      {[{ l: "Male", v: s.demo.m, bg: V }, { l: "Female", v: s.demo.f, bg: G }, { l: "Sub-adult", v: s.demo.c, bg: "#DDD" }].map(d => {
                        const tot = s.demo.m + s.demo.f + s.demo.c;
                        return (
                          <div key={d.l} style={{ padding: mob ? "10px 6px" : "14px 10px", background: "#FAFAFA", textAlign: "center" }}>
                            <div style={{ fontSize: mob ? 16 : 24, fontWeight: 900, fontFamily: "'DM Mono',monospace" }}>{d.v.toLocaleString()}</div>
                            <div style={{ fontSize: 10, color: "#AAA", marginTop: 2, marginBottom: 6 }}>{d.l}</div>
                            <div style={{ height: 3, background: "#F0F0F0", borderRadius: 2 }}>
                              <div style={{ width: `${Math.round(d.v / tot * 100)}%`, height: "100%", background: d.bg, borderRadius: 2, transition: "width 1s" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#BBB", marginBottom: 10 }}>Average Stature</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 26 }}>
                      {[{ l: "Male", v: s.height.m, c: V }, { l: "Female", v: s.height.f, c: G }].map(x => (
                        <div key={x.l} style={{ padding: mob ? "10px 8px" : "14px 12px", background: "#FAFAFA", display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: mob ? 20 : 26, fontWeight: 900, fontFamily: "'DM Mono',monospace" }}>{x.v}</span>
                          <span style={{ fontSize: 12, color: "#AAA" }}>cm</span>
                          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 3 }}>
                            <span style={{ fontSize: 10, color: "#CCC" }}>{x.l}</span>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: x.c, opacity: .6 }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#BBB", marginBottom: 10 }}>Disease Prevalence</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {s.path.map((p, i) => (
                        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: mob ? 76 : 110, fontSize: mob ? 12 : 13, color: "#555", fontWeight: 500, flexShrink: 0 }}>{p.name}</span>
                          <Bar pct={p.pct} delay={i * 100} />
                          <span style={{ width: 28, fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#AAA", textAlign: "right", flexShrink: 0 }}>{p.pct}%</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#CCC", marginTop: 12, lineHeight: 1.5 }}>Rates reflect conditions observable in bone. True prevalence was likely higher.</p>
                  </div>
                )}

                {/* ── BIO ── */}
                {tab === "bio" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <div style={{ background: BK, padding: mob ? 16 : 28, color: WH, position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: `linear-gradient(${V}, ${G})` }} />
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: V, background: "rgba(196,162,239,.12)", padding: "3px 10px" }}>{s.bio.id}</span>
                        <span style={{ fontSize: 11, color: "#666" }}>Skeleton Biography</span>
                      </div>
                      <h3 style={{ fontSize: mob ? 18 : 24, fontWeight: 900, marginBottom: 14, letterSpacing: -.5 }}>{s.bio.name}</h3>
                      <div style={{ display: "flex", gap: mob ? 12 : 24, marginBottom: 16, flexWrap: "wrap" }}>
                        {[["Age", s.bio.age], ["Sex", s.bio.sex], ["Stature", s.bio.h]].map(([l, v]) => (
                          <div key={l}>
                            <div style={{ fontSize: 10, color: "#666", letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                            <div style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: "#CCC", marginTop: 2 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.8, color: "#999", marginBottom: 18 }}>{s.bio.text}</p>
                      <div style={{ borderTop: "1px solid #222", paddingTop: 14 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: V, marginBottom: 6 }}>Unanswered</p>
                        <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6 }}>{s.bio.q}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── QUIZ ── */}
                {tab === "quiz" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <div style={{ padding: mob ? 14 : 24, background: "#FAFAFA" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: V, marginBottom: 10 }}>Test Your Knowledge</p>
                      <p style={{ fontSize: mob ? 14 : 16, fontWeight: 700, lineHeight: 1.5, marginBottom: 16 }}>{s.quiz.q}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {s.quiz.o.map((o, i) => {
                          const done = quizA[s.id] !== undefined, right = i === s.quiz.a, picked = quizA[s.id] === i;
                          return (
                            <button key={i} disabled={done} onClick={() => setQuizA(q => ({ ...q, [s.id]: i }))}
                              style={{
                                padding: "13px 14px", textAlign: "left", width: "100%",
                                border: done && right ? `2px solid ${G}` : done && picked && !right ? "2px solid #F87171" : "1px solid #EEE",
                                background: done && right ? "#F0FFF4" : done && picked && !right ? "#FFF5F5" : WH,
                                color: done && right ? "#166534" : done && picked && !right ? "#991B1B" : BK,
                                fontSize: 14, cursor: done ? "default" : "pointer",
                                fontFamily: "'DM Sans',sans-serif",
                              }}
                              onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = V; }}
                              onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = "#EEE"; }}>
                              <span style={{ fontWeight: 700, marginRight: 8, fontFamily: "'DM Mono',monospace", color: done && right ? "#166534" : "#CCC" }}>{String.fromCharCode(65 + i)}</span>{o}
                            </button>
                          );
                        })}
                      </div>
                      {quizA[s.id] !== undefined && (
                        <div style={{ marginTop: 12, padding: "12px 14px", background: quizA[s.id] === s.quiz.a ? "#DCFCE7" : "#FEE2E2", fontSize: 14, color: quizA[s.id] === s.quiz.a ? "#166534" : "#991B1B", lineHeight: 1.5 }}>
                          {quizA[s.id] === s.quiz.a ? "Correct." : `The answer is ${String.fromCharCode(65 + s.quiz.a)}: ${s.quiz.o[s.quiz.a]}.`}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 28, padding: "12px 0", borderTop: "1px solid #F0F0F0", textAlign: "center" }}>
                  <span style={{ fontSize: 10, color: "#CCC", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>LONDON MUSEUM · OSTEOLOGICAL DATABASE</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}