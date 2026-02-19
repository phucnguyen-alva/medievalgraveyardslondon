import { useState, useEffect, useRef, useCallback } from "react";

const V = "#C4A2EF";
const G = "#B3F5C9";
const BK = "#0A0A0A";
const WH = "#FFFFFF";

/* ───────── SITE DATA (no em dashes, natural scientific tone) ───────── */
const SITES = [
  {
    id: "guildhall", name: "Guildhall Yard", shortName: "Guildhall", era: "1050 – 1540", n: 78,
    tag: "Labour, violence and civic power beneath City Hall",
    color: V,
    mapX: 52, mapY: 36,
    desc: "Right beneath London's medieval seat of government, archaeologists found 78 skeletons packed into a cemetery that sat on top of a Roman amphitheatre. These people lived through five centuries of civic life, and their bones tell us exactly how hard that life was.",
    findings: [
      "Osteoarthritis was widespread, pointing to years of gruelling physical work.",
      "Dental enamel defects (hypoplasia) show that many of these people went hungry as children.",
      "Healed fractures, including broken noses and forearm injuries, suggest frequent interpersonal violence.",
      "Tooth decay increased over time, likely because diets shifted toward more refined grains.",
    ],
    demo: { m: 45, f: 28, c: 5 },
    height: { m: 170.2, f: 158.7 },
    path: [
      { name: "Dental Disease", pct: 72 }, { name: "Osteoarthritis", pct: 58 },
      { name: "Periostitis", pct: 34 }, { name: "Fractures", pct: 22 },
      { name: "Cribra Orbitalia", pct: 18 },
    ],
    bio: {
      id: "GY-042", name: "The Guildhall Clerk", age: "35–45", sex: "Male", h: "171 cm",
      text: "This man's finger bones have pronounced spurs at the attachment sites, the kind of changes that come from a lifetime of repetitive gripping, possibly holding a quill. His teeth were heavily worn but free of cavities, consistent with a diet of coarse bread. A healed fracture in his left forearm tells us he survived at least one violent encounter.",
      q: "Was he a scribe working inside the Guildhall itself? His burial location suggests proximity to civic power, but his bones tell a story of modest means.",
    },
    quiz: { q: "What does DISH (Diffuse Idiopathic Skeletal Hyperostosis) typically indicate about a medieval person's lifestyle?", o: ["Plague exposure", "A rich, high-calorie diet", "Childhood malnutrition", "Tuberculosis infection"], a: 1 },
  },
  {
    id: "dominican", name: "Dominican Friary", shortName: "Black Friars", era: "1240 – 1538", n: 132,
    tag: "Wealth, prayer and people from across Europe",
    color: G,
    mapX: 28, mapY: 48,
    desc: "The Black Friars' church near modern-day Blackfriars was one of London's most prestigious religious houses. Wealthy Londoners paid to be buried inside the church itself, while ordinary people were placed in the yard outside. The bones reveal this inequality clearly.",
    findings: [
      "A bone condition called DISH, linked to overeating, was common among those buried inside the church.",
      "Isotope analysis of teeth shows that several friars actually grew up in continental Europe.",
      "One individual had a hole surgically cut in their skull (trepanation) and survived the procedure.",
      "People buried inside the church had far fewer signs of nutritional deficiency than those in the yard.",
    ],
    demo: { m: 72, f: 38, c: 22 },
    height: { m: 172.1, f: 159.3 },
    path: [
      { name: "Dental Disease", pct: 65 }, { name: "Osteoarthritis", pct: 45 },
      { name: "DISH", pct: 28 }, { name: "Periostitis", pct: 25 },
      { name: "Gout", pct: 12 },
    ],
    bio: {
      id: "DF-089", name: "The Black Friar", age: "50–60", sex: "Male", h: "168 cm",
      text: "Buried in the most privileged spot in the nave, this friar's spine shows DISH, a condition that develops from rich eating over many years. His knees have severe osteoarthritis from decades of kneeling on stone floors in prayer. Chemical analysis of his tooth enamel places his childhood in southern France.",
      q: "What brought a young man from Provence all the way to London to take Dominican vows? His bones tell us where he came from, but not why he left.",
    },
    quiz: { q: "What technique can reveal where a person grew up, even centuries after their death?", o: ["Carbon dating", "DNA sequencing", "Isotope analysis of tooth enamel", "X-ray fluorescence"], a: 2 },
  },
  {
    id: "stbenet", name: "St Benet Sherehog", shortName: "St Benet", era: "1050 – 1666", n: 254,
    tag: "Plague, fire and the merchants of Cheapside",
    color: "#FFD666",
    mapX: 48, mapY: 52,
    desc: "This church was destroyed in the Great Fire of 1666 and never rebuilt. It served the merchant community of Cheapside, medieval London's busiest commercial street. Among the 254 skeletons recovered, scientists found molecular proof of the Black Death.",
    findings: [
      "DNA from Yersinia pestis, the plague bacterium, was successfully extracted from 14th-century teeth.",
      "Mass graves from 1348 to 1349 contain bodies stacked rapidly without coffins.",
      "Several people had Pott's disease, a form of spinal tuberculosis that causes the vertebrae to collapse.",
      "Dental disease rates here were among the highest in medieval London, likely because these merchants had access to imported sugar.",
    ],
    demo: { m: 98, f: 112, c: 44 },
    height: { m: 169.5, f: 157.8 },
    path: [
      { name: "Dental Disease", pct: 82 }, { name: "Osteoarthritis", pct: 42 },
      { name: "Periostitis", pct: 38 }, { name: "Fractures", pct: 19 },
      { name: "Tuberculosis", pct: 14 },
    ],
    bio: {
      id: "SBS-177", name: "The Cheapside Mother", age: "25–35", sex: "Female", h: "160 cm",
      text: "She was buried wearing a simple copper-alloy ring. Her skeleton shows signs of iron-deficiency anaemia and a healed leg fracture. Most remarkably, tiny fetal bones found within her pelvis tell us she died in late pregnancy or during childbirth.",
      q: "That copper ring: was it a wedding band? A keepsake? Its simplicity suggests modest means, yet a Cheapside burial places her squarely among the trading class.",
    },
    quiz: { q: "How do osteologists confirm the presence of plague in skeletal remains?", o: ["Visible bone lesions", "Extracting bacterial DNA from teeth", "Measuring bone density loss", "Examining burial position"], a: 1 },
  },
  {
    id: "spital", name: "St Mary Spital", shortName: "St Mary Spital", era: "1197 – 1540", n: 10516,
    tag: "Over 10,000 people: Britain's largest medieval excavation",
    color: "#FF9B9B",
    mapX: 72, mapY: 22,
    desc: "This is the most important medieval burial excavation ever conducted in Britain. More than 10,500 skeletons were recovered from the grounds of a medieval hospital and priory, including mass graves from the Black Death of 1348. It is an unparalleled archive of how ordinary Londoners lived and died.",
    findings: [
      "With over 10,500 burials, this is the largest excavated medieval cemetery in Britain.",
      "Mass graves from 1348 hold hundreds of plague victims buried in haste.",
      "Hospital patients show dramatically higher disease rates than people from ordinary parish cemeteries.",
      "Conditions like leprosy and probable syphilis appear far more frequently among the hospital burials.",
    ],
    demo: { m: 4205, f: 3682, c: 2629 },
    height: { m: 171.0, f: 159.1 },
    path: [
      { name: "Dental Disease", pct: 75 }, { name: "Periostitis", pct: 45 },
      { name: "Osteoarthritis", pct: 40 }, { name: "Cribra Orbitalia", pct: 32 },
      { name: "Rickets", pct: 15 },
    ],
    bio: {
      id: "SRP-4401", name: "The Spital Youth", age: "12–15", sex: "Indeterminate", h: "148 cm",
      text: "This young person was found in a Black Death mass burial pit. Their eye sockets show severe cribra orbitalia, and growth-arrest lines (Harris lines) in their leg bones record repeated episodes of childhood malnutrition. Yet their teeth were forming normally at the time of death. The plague killed quickly, regardless of age.",
      q: "Were they already a hospital patient before the plague arrived, or just an ordinary young Londoner swept up in the catastrophe? The mass pit makes individual stories nearly impossible to untangle.",
    },
    quiz: { q: "What are Harris lines, visible in X-rays of long bones?", o: ["Evidence of plague infection", "Lines of arrested growth from malnutrition or illness", "Markers of heavy manual labour", "Indicators of a genetic bone condition"], a: 1 },
  },
];

/* ─────────────── SKULL AVATAR ─────────────── */
const SkullAvatar = ({ speaking = false, size = 44 }) => (
  <div style={{ width: size, height: size, flexShrink: 0, position: "relative" }}>
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      <circle cx="50" cy="50" r="48" fill={BK} />
      <g transform="translate(50,46)">
        <path d="M-26 -6 C-26 -30 -20 -40 0 -40 C20 -40 26 -30 26 -6 C26 4 22 10 16 14 L12 14 L8 24 L-8 24 L-12 14 L-16 14 C-22 10 -26 4 -26 -6 Z" fill="none" stroke={WH} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M0 -40 Q-1 -30 0 -18" fill="none" stroke={WH} strokeWidth="0.7" opacity="0.2" />
        <path d="M-20 -18 Q-10 -22 0 -20 Q10 -22 20 -18" fill="none" stroke={WH} strokeWidth="1.4" opacity="0.45" />
        <ellipse cx="-9" cy="-10" rx="8" ry="9" fill={BK} stroke={WH} strokeWidth="2.2" />
        <ellipse cx="9" cy="-10" rx="8" ry="9" fill={BK} stroke={WH} strokeWidth="2.2" />
        {speaking && <>
          <ellipse cx="-9" cy="-10" rx="3.5" ry="4" fill={V} opacity="0.55"><animate attributeName="opacity" values="0.55;0.1;0.55" dur="1.8s" repeatCount="indefinite" /></ellipse>
          <ellipse cx="9" cy="-10" rx="3.5" ry="4" fill={G} opacity="0.55"><animate attributeName="opacity" values="0.1;0.55;0.1" dur="1.8s" repeatCount="indefinite" /></ellipse>
        </>}
        <path d="M-4 0 C-5 -4 -1.5 -7 0 -7 C1.5 -7 5 -4 4 0 C3.5 3 1.5 6 0 7 C-1.5 6 -3.5 3 -4 0 Z" fill={BK} stroke={WH} strokeWidth="1.6" />
        <path d="M-17 -6 C-22 -2 -22 6 -18 10" fill="none" stroke={WH} strokeWidth="1.3" opacity="0.4" />
        <path d="M17 -6 C22 -2 22 6 18 10" fill="none" stroke={WH} strokeWidth="1.3" opacity="0.4" />
        <path d="M-14 12 Q-12 16 0 17 Q12 16 14 12" fill="none" stroke={WH} strokeWidth="1.3" />
        {[-10,-6.5,-3,0,3,6.5,10].map(x => <line key={`ut${x}`} x1={x} y1={12.5+Math.abs(x)*.12} x2={x} y2={16+Math.abs(x)*.08} stroke={WH} strokeWidth="1.1" opacity="0.7" />)}
        <path d="M-16 14 C-18 18 -12 24 0 24 C12 24 18 18 16 14" fill="none" stroke={WH} strokeWidth="2">
          {speaking && <animate attributeName="d" values="M-16 14 C-18 18 -12 24 0 24 C12 24 18 18 16 14;M-16 14 C-18 20 -12 28 0 28 C12 28 18 20 16 14;M-16 14 C-18 18 -12 24 0 24 C12 24 18 18 16 14" dur="0.3s" repeatCount="indefinite" />}
        </path>
        {[-8,-4.5,-1.5,1.5,4.5,8].map(x => <line key={`lt${x}`} x1={x} y1={17+Math.abs(x)*.1} x2={x} y2={20+Math.abs(x)*.06} stroke={WH} strokeWidth="0.9" opacity="0.5" />)}
      </g>
    </svg>
    {speaking && <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: G, animation: "pulse .8s infinite" }} />}
  </div>
);

/* ─────────────── FULL SKELETON ─────────────── */
const FullSkeleton = ({ size = 80 }) => (
  <svg viewBox="0 0 100 240" style={{ width: size, height: size * 2.4, display: "block" }}>
    <g transform="translate(50,12)" fill="none" stroke={BK} strokeLinecap="round">
      <path d="M-18 4 C-18 -18 -13 -26 0 -26 C13 -26 18 -18 18 4 C18 12 14 16 10 19 L7 19 L5 28 L-5 28 L-7 19 L-10 19 C-14 16 -18 12 -18 4 Z" strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="-7" cy="0" rx="6" ry="7" strokeWidth="1.8" /><ellipse cx="7" cy="0" rx="6" ry="7" strokeWidth="1.8" />
      <path d="M-3 10 C-3 8 0 5.5 0 5.5 C0 5.5 3 8 3 10 C3 12 1 14 0 14.5 C-1 14 -3 12 -3 10 Z" strokeWidth="1.3" />
      <path d="M-12 19 C-14 23 -9 29 0 29 C9 29 14 23 12 19" strokeWidth="1.8" />
      {[33,36.5,40].map(y => <ellipse key={y} cx="0" cy={y} rx="4.5" ry="2" strokeWidth=".7" opacity=".35" />)}
      <path d="M0 37 Q-11 34 -22 38" strokeWidth="1.8" /><path d="M0 37 Q11 34 22 38" strokeWidth="1.8" />
      <line x1="0" y1="39" x2="0" y2="70" strokeWidth="1.3" opacity=".45" />
      {[[41,48,19],[45,53,18],[49,59,17],[54,64,16],[59,68,14.5]].map(([yT,yB,w],i) => <g key={`r${i}`} opacity={1-i*.06}><path d={`M0 ${yT} Q-${w+3} ${yT-1} -${w} ${(yT+yB)/2} Q-${w-2} ${yB} -${w*.55} ${yB+1.5}`} strokeWidth="1.1" /><path d={`M0 ${yT} Q${w+3} ${yT-1} ${w} ${(yT+yB)/2} Q${w-2} ${yB} ${w*.55} ${yB+1.5}`} strokeWidth="1.1" /></g>)}
      <line x1="0" y1="38" x2="0" y2="92" strokeWidth="1.8" />
      <line x1="-22" y1="38" x2="-26" y2="70" strokeWidth="2" /><line x1="22" y1="38" x2="26" y2="70" strokeWidth="2" />
      <line x1="-26" y1="72" x2="-22" y2="100" strokeWidth="1.5" /><line x1="26" y1="72" x2="22" y2="100" strokeWidth="1.5" />
      <path d="M-13 92 Q-22 98 -20 108 Q-11 112 0 108 Q11 112 20 108 Q22 98 13 92" strokeWidth="2" />
      <line x1="-11" y1="108" x2="-13" y2="148" strokeWidth="2.2" /><line x1="11" y1="108" x2="13" y2="148" strokeWidth="2.2" />
      <line x1="-13" y1="153" x2="-11" y2="186" strokeWidth="1.8" /><line x1="13" y1="153" x2="11" y2="186" strokeWidth="1.8" />
      <path d="M-11 186 L-17 192 L-20 190" strokeWidth="1.1" opacity=".45" /><path d="M11 186 L17 192 L20 190" strokeWidth="1.1" opacity=".45" />
    </g>
  </svg>
);

/* ─────────────── IMPROVED MAP ─────────────── */
const CityMap = ({ sites, active, seen, hov, setHov, onSelect, mob }) => (
  <div style={{ background: WH, border: "1px solid #E0E0E0", borderRadius: 2, padding: mob ? 10 : 14, position: "relative" }}>
    {/* Map title */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#BBB" }}>City of London</span>
      <span style={{ fontSize: 9, color: "#CCC", fontFamily: "'DM Mono',monospace" }}>c. 1200 – 1540 CE</span>
    </div>
    <svg viewBox="0 0 200 130" style={{ width: "100%", display: "block" }}>
      <defs>
        <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r=".5" fill="#E8E8E8" />
        </pattern>
      </defs>
      <rect width="200" height="130" fill="url(#dots)" rx="1" />

      {/* Thames: wide river with softer banks */}
      <path d="M0 108 Q30 96 65 100 Q95 108 130 98 Q160 92 190 96 L200 95 L200 130 L0 130 Z" fill={G} opacity=".08" />
      <path d="M0 108 Q30 96 65 100 Q95 108 130 98 Q160 92 190 96" fill="none" stroke={G} strokeWidth="3" opacity=".25" />
      <path d="M0 108 Q30 96 65 100 Q95 108 130 98 Q160 92 190 96" fill="none" stroke={G} strokeWidth=".8" opacity=".5" />
      <text x="170" y="118" fontSize="6" fill="#C0C0C0" fontFamily="'DM Mono',monospace" letterSpacing="3" opacity=".6">THAMES</text>

      {/* London Wall outline */}
      <path d="M38 36 Q42 22 65 18 Q95 14 130 18 Q152 24 158 40 Q160 55 155 68 Q148 78 130 82 Q110 86 90 84 Q65 82 50 72 Q40 62 38 50 Z"
        fill="none" stroke="#D4D4D4" strokeWidth="1.2" strokeDasharray="4,3" opacity=".6" />
      <text x="43" y="30" fontSize="4.5" fill="#CCC" fontFamily="'DM Sans',sans-serif" fontWeight="600" opacity=".5">LONDON WALL</text>

      {/* Key streets */}
      <line x1="60" y1="75" x2="140" y2="75" stroke="#E8E8E8" strokeWidth=".8" />
      <text x="88" y="73" fontSize="3.8" fill="#D0D0D0" fontFamily="'DM Mono',monospace" textAnchor="middle" letterSpacing=".5">CHEAPSIDE</text>

      <line x1="100" y1="25" x2="100" y2="85" stroke="#E8E8E8" strokeWidth=".6" />

      {/* Fleet river (west) */}
      <path d="M30 20 Q28 50 26 70 Q24 85 22 108" fill="none" stroke={G} strokeWidth="1" opacity=".15" />
      <text x="18" y="62" fontSize="3.5" fill="#D4D4D4" fontFamily="'DM Mono',monospace" transform="rotate(-85,18,62)" opacity=".5">FLEET</text>

      {/* Landmark dots */}
      {[
        { x: 100, y: 90, l: "London Bridge" },
        { x: 68, y: 58, l: "St Paul's" },
        { x: 160, y: 50, l: "Tower" },
      ].map(lm => (
        <g key={lm.l}>
          <rect x={lm.x - 1} y={lm.y - 1} width="2.5" height="2.5" fill="#D8D8D8" />
          <text x={lm.x + 4} y={lm.y + 1.5} fontSize="3.8" fill="#C8C8C8" fontFamily="'DM Sans',sans-serif" fontWeight="500">{lm.l}</text>
        </g>
      ))}

      {/* Walking route connecting sites */}
      <path d={`M${sites[3].mapX*2},${sites[3].mapY*1.9} L${sites[0].mapX*2},${sites[0].mapY*1.9} L${sites[2].mapX*2},${sites[2].mapY*1.9} L${sites[1].mapX*2},${sites[1].mapY*1.9}`}
        fill="none" stroke={V} strokeWidth=".6" strokeDasharray="3,4" opacity=".3" />

      {/* Cemetery pins */}
      {sites.map(c => {
        const cx = c.mapX * 2, cy = c.mapY * 1.9;
        const isA = active?.id === c.id, isH = hov === c.id, isV = seen[c.id];
        const r = mob ? (isA ? 10 : 8) : (isA ? 9 : isH ? 8 : 6.5);
        return (
          <g key={c.id} style={{ cursor: "pointer" }} onMouseEnter={() => setHov(c.id)} onMouseLeave={() => setHov(null)} onClick={() => onSelect(c)}>
            {/* Pulse ring */}
            {isA && <circle cx={cx} cy={cy} r="7" fill="none" stroke={V} strokeWidth="1.5" opacity=".35"><animate attributeName="r" values="7;18;7" dur="2.5s" repeatCount="indefinite" /><animate attributeName="opacity" values=".35;0;.35" dur="2.5s" repeatCount="indefinite" /></circle>}

            {/* Shadow */}
            <ellipse cx={cx} cy={cy + (isA ? 3 : 2)} rx={r * .7} ry={r * .25} fill={BK} opacity=".06" />

            {/* Pin body */}
            <circle cx={cx} cy={cy} r={r} fill={isA ? c.color : WH} stroke={isA ? BK : isV ? c.color : "#C8C8C8"} strokeWidth={isA ? 2.5 : 2} style={{ transition: "all .2s" }} />

            {/* Inner markers */}
            {isA && <circle cx={cx} cy={cy} r="3" fill={WH} />}
            {!isA && isV && <circle cx={cx} cy={cy} r="2.5" fill={c.color} />}
            {!isA && !isV && <circle cx={cx} cy={cy} r="1.5" fill="#D4D4D4" />}

            {/* Tooltip label */}
            {(isH || isA) && (
              <g style={{ animation: "fadeUp .15s ease" }}>
                <rect x={cx - 30} y={cy - 26} width="60" height="17" rx="2" fill={BK} />
                <polygon points={`${cx-3},${cy-9} ${cx+3},${cy-9} ${cx},${cy-5}`} fill={BK} />
                <text x={cx} y={cy - 15} textAnchor="middle" fill={WH} fontSize="6.5" fontWeight="700" fontFamily="'DM Sans',sans-serif">{c.shortName}</text>
              </g>
            )}

            {/* Site number (when not hovered/active) */}
            {!isH && !isA && !isV && (
              <text x={cx} y={cy + 1.5} textAnchor="middle" fill="#AAA" fontSize="5.5" fontWeight="700" fontFamily="'DM Mono',monospace">{sites.indexOf(c) + 1}</text>
            )}
          </g>
        );
      })}

      {/* Scale bar */}
      <line x1="10" y1="122" x2="35" y2="122" stroke="#CCC" strokeWidth=".7" />
      <line x1="10" y1="120" x2="10" y2="124" stroke="#CCC" strokeWidth=".5" />
      <line x1="35" y1="120" x2="35" y2="124" stroke="#CCC" strokeWidth=".5" />
      <text x="22.5" y="120" textAnchor="middle" fontSize="3.5" fill="#CCC" fontFamily="'DM Mono',monospace">~500m</text>

      {/* North arrow */}
      <g transform="translate(186,16)">
        <line x1="0" y1="8" x2="0" y2="-2" stroke="#CCC" strokeWidth=".8" />
        <polygon points="0,-4 -2,0 2,0" fill="#CCC" />
        <text x="0" y="-6" textAnchor="middle" fontSize="4" fill="#CCC" fontWeight="700" fontFamily="'DM Mono',monospace">N</text>
      </g>
    </svg>
    {/* Legend */}
    <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid #C8C8C8" }} />
        <span style={{ fontSize: 10, color: "#999" }}>Undiscovered</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: V }} />
        <span style={{ fontSize: 10, color: "#999" }}>Explored</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 14, height: 0, borderTop: "1.5px dashed #D4D4D4" }} />
        <span style={{ fontSize: 10, color: "#999" }}>London Wall</span>
      </div>
    </div>
  </div>
);

/* ─────────────── ANIMATED BAR ─────────────── */
const Bar = ({ pct, delay = 0 }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 60 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ flex: 1, height: 6, background: "#EBEBEB", borderRadius: 3 }}>
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

/* ═══════════════════════ MAIN APP ═══════════════════════ */
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

  /* emoji favicon */
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/svg+xml"; link.rel = "icon";
    link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💀</text></svg>";
    document.head.appendChild(link);
    document.title = "Medieval Graveyards of London";
  }, []);

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
          <FullSkeleton size={mob ? 50 : 68} />
        </div>
        <div style={{ opacity: step >= 2 ? 1 : 0, transition: "all 1s", transform: `translateY(${step >= 2 ? 0 : 16}px)` }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: V, marginBottom: 12 }}>London Museum</p>
          <h1 style={{ fontSize: "clamp(32px,9vw,68px)", fontWeight: 900, color: BK, lineHeight: .95, margin: "0 0 14px", letterSpacing: -2 }}>Medieval<br />Graveyards</h1>
          <p style={{ fontSize: "clamp(13px,3.5vw,16px)", color: "#666", lineHeight: 1.7, maxWidth: 360, margin: "0 auto" }}>Four burial sites. Thousands of skeletons.<br />Centuries of London stories written in bone.</p>
        </div>
        <button onClick={() => { setScreen("explore"); setTimeout(() => say("Welcome. Tap a burial site on the map and I will tell you what the bones remember."), 300); }}
          style={{ marginTop: 28, padding: "16px 40px", background: BK, color: WH, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", opacity: step >= 3 ? 1 : 0, transition: "all .5s" }}
          onMouseEnter={e => { e.target.style.background = V; e.target.style.color = BK; }}
          onMouseLeave={e => { e.target.style.background = BK; e.target.style.color = WH; }}>Explore</button>
        <div style={{ marginTop: 32, display: "flex", gap: "clamp(12px,4vw,28px)", justifyContent: "center", opacity: step >= 4 ? .35 : 0, transition: "opacity 1s", flexWrap: "wrap" }}>
          {["MOLA", "Oxford Archaeology", "Elementary Digital"].map(p => <span key={p} style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#AAA" }}>{p}</span>)}
        </div>
        <a href="https://www.londonmuseum.org.uk" target="_blank" rel="noopener noreferrer"
          style={{ marginTop: 14, fontSize: 11, color: "#999", textDecoration: "none", opacity: step >= 4 ? 1 : 0, transition: "opacity 1s", display: "inline-flex", alignItems: "center", gap: 4 }}
          onMouseEnter={e => e.currentTarget.style.color = V}
          onMouseLeave={e => e.currentTarget.style.color = "#999"}>
          londonmuseum.org.uk <span style={{ fontSize: 10 }}>↗</span>
        </a>
      </div>
    </div>
  );

  /* ── MAIN EXPLORE ── */
  const s = site, ct = Object.keys(seen).length;
  const showLeft = !mob || mobilePanel === "map";
  const showRight = !mob || mobilePanel === "detail";
  const px = mob ? 12 : 16;

  return (
    <div style={{ minHeight: "100dvh", background: "#F7F7F7", fontFamily: "'DM Sans',sans-serif", color: BK, display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>

      {/* ─ HEADER ─ */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `10px ${px}px`, background: WH, borderBottom: "1px solid #E5E5E5", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SkullAvatar size={mob ? 28 : 30} />
          <span style={{ fontSize: mob ? 11 : 13, fontWeight: 700, letterSpacing: 1, color: BK }}>MEDIEVAL GRAVEYARDS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < ct ? V : "#DCDCDC", transition: "background .4s" }} />)}
            <span style={{ fontSize: 10, color: "#999", marginLeft: 2, fontFamily: "'DM Mono',monospace" }}>{ct}/4</span>
          </div>
          <a href="https://www.londonmuseum.org.uk" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, fontWeight: 600, color: "#888", textDecoration: "none", padding: "5px 10px", border: "1px solid #E0E0E0", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", display: mob ? "none" : "flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = V; e.currentTarget.style.color = BK; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0E0E0"; e.currentTarget.style.color = "#888"; }}>
            London Museum <span style={{ fontSize: 10 }}>↗</span>
          </a>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0, flexDirection: mob ? "column" : "row" }}>

        {/* ═══ LEFT PANEL ═══ */}
        {showLeft && (
          <div style={{ flex: mob ? "none" : "1 1 420px", padding: px, display: "flex", flexDirection: "column", gap: 12, ...(mob ? {} : { maxHeight: "calc(100dvh - 50px)", overflowY: "auto" }) }}>
            {/* Docent */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <SkullAvatar speaking={speaking} size={mob ? 36 : 44} />
              <div style={{ flex: 1, background: WH, border: "1px solid #E5E5E5", borderRadius: "2px 10px 10px 10px", padding: "8px 12px", minHeight: 36 }}>
                <p style={{ fontSize: mob ? 13 : 14, color: "#444", lineHeight: 1.55 }}>{msg}{speaking && <span style={{ color: V, animation: "blink .6s infinite" }}>|</span>}</p>
              </div>
            </div>

            {/* Map */}
            <CityMap sites={SITES} active={s} seen={seen} hov={hov} setHov={setHov} onSelect={open} mob={mob} />

            {/* Site list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {SITES.map(c => {
                const isA = s?.id === c.id;
                return (
                  <button key={c.id} onClick={() => open(c)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: mob ? "14px 12px" : "12px 14px",
                    background: isA ? BK : WH, border: isA ? "none" : "1px solid #E5E5E5",
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s",
                    textAlign: "left", width: "100%",
                  }}
                    onMouseEnter={e => { if (!isA) e.currentTarget.style.borderColor = V; }}
                    onMouseLeave={e => { if (!isA) e.currentTarget.style.borderColor = "#E5E5E5"; }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: isA ? c.color : seen[c.id] ? c.color : "#D4D4D4", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isA ? WH : BK }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: isA ? "rgba(255,255,255,.55)" : "#999", fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.era} · {c.n.toLocaleString()} individuals</div>
                    </div>
                    {seen[c.id] && !isA && <span style={{ fontSize: 10, color: c.color }}>●</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ RIGHT PANEL ═══ */}
        {showRight && (
          <div ref={panelRef} style={{ flex: mob ? "none" : "1 1 500px", ...(mob ? {} : { borderLeft: "1px solid #E5E5E5", maxHeight: "calc(100dvh - 50px)", overflowY: "auto" }), background: WH }}>
            {!s ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: mob ? "auto" : "100%", textAlign: "center", minHeight: 340, padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>💀</div>
                <p style={{ fontSize: 17, fontWeight: 700, color: BK, marginBottom: 6 }}>Select a burial site</p>
                <p style={{ fontSize: 14, color: "#888", maxWidth: 260, lineHeight: 1.6 }}>Tap a pin on the map or choose from the list to explore its history, data and skeletal biographies.</p>
              </div>
            ) : (
              <div key={s.id} style={{ animation: "slideIn .3s ease", padding: mob ? "18px 14px 28px" : "28px 28px 40px" }}>
                {/* Back */}
                <button onClick={back} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #E5E5E5", background: "transparent", fontSize: 12, color: "#888", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 18 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = BK; e.currentTarget.style.color = BK; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.color = "#888"; }}>← Back to map</button>

                {/* Header */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <div style={{ padding: "4px 10px", background: s.color, fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'DM Mono',monospace", color: BK }}>{s.era}</div>
                    <span style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono',monospace" }}>{s.n.toLocaleString()} excavated</span>
                  </div>
                  <h2 style={{ fontSize: mob ? 22 : 30, fontWeight: 900, lineHeight: 1.1, marginBottom: 6, letterSpacing: -1, color: BK }}>{s.name}</h2>
                  <p style={{ fontSize: 14, color: "#777", fontWeight: 500 }}>{s.tag}</p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #F0F0F0", overflowX: "auto", scrollbarWidth: "none" }}>
                  {[{ k: "overview", l: "Overview" }, { k: "data", l: "Data" }, { k: "bio", l: "Skeleton" }, { k: "quiz", l: "Quiz" }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                      padding: mob ? "10px 12px" : "10px 18px", border: "none", background: "transparent",
                      fontSize: 13, fontWeight: tab === t.k ? 700 : 500, color: tab === t.k ? BK : "#AAA",
                      cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
                      borderBottom: tab === t.k ? `2px solid ${s.color}` : "2px solid transparent", marginBottom: -2,
                    }}>{t.l}</button>
                  ))}
                </div>

                {/* ── OVERVIEW ── */}
                {tab === "overview" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <p style={{ fontSize: 15, lineHeight: 1.85, color: "#333", marginBottom: 24 }}>{s.desc}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#AAA", marginBottom: 12 }}>Key Findings</p>
                    {s.findings.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "14px 0", borderTop: i ? "1px solid #F0F0F0" : "none", animation: `fadeUp .25s ease ${i * 60}ms both` }}>
                        <div style={{ width: 22, height: 22, minWidth: 22, background: i % 2 === 0 ? s.color : G, borderRadius: i % 2 === 0 ? "50%" : 0, opacity: .2, marginTop: 2 }} />
                        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{f}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── DATA ── */}
                {tab === "data" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#AAA", marginBottom: 10 }}>Demographics</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 22 }}>
                      {[{ l: "Male", v: s.demo.m, bg: V }, { l: "Female", v: s.demo.f, bg: G }, { l: "Sub-adult", v: s.demo.c, bg: "#D4D4D4" }].map(d => {
                        const tot = s.demo.m + s.demo.f + s.demo.c;
                        return (
                          <div key={d.l} style={{ padding: mob ? "10px 6px" : "14px 10px", background: "#F7F7F7", textAlign: "center" }}>
                            <div style={{ fontSize: mob ? 16 : 24, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: BK }}>{d.v.toLocaleString()}</div>
                            <div style={{ fontSize: 10, color: "#888", marginTop: 2, marginBottom: 6 }}>{d.l}</div>
                            <div style={{ height: 3, background: "#E8E8E8", borderRadius: 2 }}>
                              <div style={{ width: `${Math.round(d.v / tot * 100)}%`, height: "100%", background: d.bg, borderRadius: 2, transition: "width 1s" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#AAA", marginBottom: 10 }}>Average Stature</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 26 }}>
                      {[{ l: "Male", v: s.height.m, c: V }, { l: "Female", v: s.height.f, c: G }].map(x => (
                        <div key={x.l} style={{ padding: mob ? "10px 8px" : "14px 12px", background: "#F7F7F7", display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: mob ? 20 : 26, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: BK }}>{x.v}</span>
                          <span style={{ fontSize: 12, color: "#888" }}>cm</span>
                          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 3 }}>
                            <span style={{ fontSize: 10, color: "#999" }}>{x.l}</span>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: x.c, opacity: .7 }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#AAA", marginBottom: 10 }}>Disease Prevalence</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {s.path.map((p, i) => (
                        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: mob ? 76 : 110, fontSize: mob ? 12 : 13, color: "#444", fontWeight: 500, flexShrink: 0 }}>{p.name}</span>
                          <Bar pct={p.pct} delay={i * 100} />
                          <span style={{ width: 28, fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#888", textAlign: "right", flexShrink: 0 }}>{p.pct}%</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#AAA", marginTop: 12, lineHeight: 1.5 }}>These rates reflect only conditions visible in bone. The true prevalence of disease was almost certainly higher.</p>
                  </div>
                )}

                {/* ── BIO ── */}
                {tab === "bio" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <div style={{ background: BK, padding: mob ? 16 : 28, color: WH, position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: `linear-gradient(${s.color}, ${G})` }} />
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: s.color, background: "rgba(196,162,239,.12)", padding: "3px 10px" }}>{s.bio.id}</span>
                        <span style={{ fontSize: 11, color: "#777" }}>Skeleton Biography</span>
                      </div>
                      <h3 style={{ fontSize: mob ? 18 : 24, fontWeight: 900, marginBottom: 14, letterSpacing: -.5, color: WH }}>{s.bio.name}</h3>
                      <div style={{ display: "flex", gap: mob ? 12 : 24, marginBottom: 16, flexWrap: "wrap" }}>
                        {[["Age", s.bio.age], ["Sex", s.bio.sex], ["Stature", s.bio.h]].map(([l, v]) => (
                          <div key={l}>
                            <div style={{ fontSize: 10, color: "#777", letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                            <div style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: "#DDD", marginTop: 2 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.85, color: "#BBB", marginBottom: 18 }}>{s.bio.text}</p>
                      <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: 14 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: s.color, marginBottom: 6 }}>Open Question</p>
                        <p style={{ fontSize: 14, color: "#999", lineHeight: 1.65 }}>{s.bio.q}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── QUIZ ── */}
                {tab === "quiz" && (
                  <div style={{ animation: "fadeUp .25s ease" }}>
                    <div style={{ padding: mob ? 14 : 24, background: "#F7F7F7" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: V, marginBottom: 10 }}>Test Your Knowledge</p>
                      <p style={{ fontSize: mob ? 14 : 16, fontWeight: 700, lineHeight: 1.5, marginBottom: 16, color: BK }}>{s.quiz.q}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {s.quiz.o.map((o, i) => {
                          const done = quizA[s.id] !== undefined, right = i === s.quiz.a, picked = quizA[s.id] === i;
                          return (
                            <button key={i} disabled={done} onClick={() => setQuizA(q => ({ ...q, [s.id]: i }))}
                              style={{
                                padding: "13px 14px", textAlign: "left", width: "100%",
                                border: done && right ? `2px solid ${G}` : done && picked && !right ? "2px solid #F87171" : "1px solid #E0E0E0",
                                background: done && right ? "#F0FFF4" : done && picked && !right ? "#FFF5F5" : WH,
                                color: done && right ? "#15803D" : done && picked && !right ? "#B91C1C" : "#333",
                                fontSize: 14, cursor: done ? "default" : "pointer",
                                fontFamily: "'DM Sans',sans-serif",
                              }}
                              onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = V; }}
                              onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = "#E0E0E0"; }}>
                              <span style={{ fontWeight: 700, marginRight: 8, fontFamily: "'DM Mono',monospace", color: done && right ? "#15803D" : "#BBB" }}>{String.fromCharCode(65 + i)}</span>{o}
                            </button>
                          );
                        })}
                      </div>
                      {quizA[s.id] !== undefined && (
                        <div style={{ marginTop: 12, padding: "12px 14px", background: quizA[s.id] === s.quiz.a ? "#DCFCE7" : "#FEE2E2", fontSize: 14, color: quizA[s.id] === s.quiz.a ? "#15803D" : "#B91C1C", lineHeight: 1.5 }}>
                          {quizA[s.id] === s.quiz.a ? "Correct!" : `Not quite. The answer is ${String.fromCharCode(65 + s.quiz.a)}: ${s.quiz.o[s.quiz.a]}.`}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: 28, padding: "14px 0", borderTop: "1px solid #F0F0F0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, color: "#BBB", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>LONDON MUSEUM · OSTEOLOGICAL DATABASE</span>
                  <a href="https://www.londonmuseum.org.uk" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 600, color: WH, textDecoration: "none", padding: "8px 20px", background: BK, fontFamily: "'DM Sans',sans-serif", letterSpacing: 1, transition: "all .2s", display: "inline-flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={e => { e.currentTarget.style.background = V; e.currentTarget.style.color = BK; }}
                    onMouseLeave={e => { e.currentTarget.style.background = BK; e.currentTarget.style.color = WH; }}>
                    Visit London Museum <span style={{ fontSize: 11 }}>↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}