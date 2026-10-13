/**
 * Endyra's capture screen at the endoscopy room kiosk, drawn from the real
 * kiosk (nextocompany/endyra apps/kiosk, case capture route) in the new
 * Endyra identity. Sample data only; the scope image is an abstract stand-in.
 */
const W = 1600
const H = 900
const BAR = 72
const PANEL = 1300

const MONO = 'var(--font-plex-mono), ui-monospace, monospace'
const SANS = 'var(--font-montserrat), system-ui, sans-serif'

function Dot({ x, y, on = true }: { x: number; y: number; on?: boolean }) {
  return <circle cx={x} cy={y} r={6} fill={on ? 'var(--endyra)' : 'var(--ink-muted)'} />
}

function Timer({ x, label, value, active }: { x: number; label: string; value: string; active?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={262}
        width={120}
        height={92}
        rx={12}
        fill={active ? 'color-mix(in srgb, var(--endyra) 14%, transparent)' : 'none'}
        stroke={active ? 'var(--endyra)' : '#4a4a4c'}
      />
      <text x={x + 14} y={294} fontSize={12} letterSpacing={1} fill="#b4b5b7" fontFamily={SANS}>
        {label}
      </text>
      <text x={x + 14} y={334} fontSize={30} fontWeight={600} fill={active ? 'var(--endyra)' : '#e7e8e9'} fontFamily={MONO}>
        {value}
      </text>
    </g>
  )
}

export function EndyraScreen({ label, className = '' }: { label: string; className?: string }) {
  const thumbs = Array.from({ length: 6 }, (_, i) => ({ x: PANEL + 40 + (i % 3) * 78, y: 720 + Math.floor(i / 3) * 62 }))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className={className}>
      <defs>
        <radialGradient id="endyra-scope" cx="50%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#6b3a35" />
          <stop offset="55%" stopColor="#3b1f1d" />
          <stop offset="100%" stopColor="#120a0a" />
        </radialGradient>
        <clipPath id="endyra-frame">
          <rect width={W} height={H} rx={20} />
        </clipPath>
      </defs>
      <g clipPath="url(#endyra-frame)">
        <rect width={W} height={H} fill="#1c1c1d" />

        {/* Top bar: mark, signal and storage, physician, patient and part. */}
        <rect width={W} height={BAR} fill="#232324" />
        <line x1={0} y1={BAR} x2={W} y2={BAR} stroke="#3a3a3c" />
        <image href="/brand/endyra-logo-reverse.svg" x={28} y={22} height={28} width={135} />
        <Dot x={214} y={36} />
        <text x={228} y={41} fontSize={15} letterSpacing={2} fill="#b4b5b7" fontFamily={SANS}>
          SIGNAL <tspan fill="#e7e8e9">OK</tspan>
        </text>
        <Dot x={360} y={36} />
        <text x={374} y={41} fontSize={15} letterSpacing={2} fill="#b4b5b7" fontFamily={SANS}>
          STORAGE <tspan fill="#e7e8e9">8%</tspan>
        </text>
        <text x={W / 2} y={41} fontSize={16} fill="#e7e8e9" textAnchor="middle" fontFamily={SANS}>
          Dr. Sample Physician
        </text>
        <text x={1386} y={41} fontSize={16} fill="#e7e8e9" fontFamily={MONO}>
          HN-000123
        </text>
        <rect x={1500} y={24} width={72} height={24} rx={12} fill="none" stroke="var(--endyra)" />
        <text x={1536} y={41} fontSize={12} letterSpacing={1.5} fill="var(--endyra)" textAnchor="middle" fontFamily={SANS}>
          LOWER
        </text>

        {/* The live scope image: an abstract stand-in, never a real patient's image. */}
        <rect y={BAR} width={PANEL} height={H - BAR} fill="#0b0b0b" />
        <circle cx={PANEL / 2} cy={BAR + (H - BAR) / 2} r={340} fill="url(#endyra-scope)" />
        <circle cx={44} cy={BAR + 40} r={7} fill="var(--coral)" />
        <text x={60} y={BAR + 46} fontSize={16} letterSpacing={2} fill="#e7e8e9" fontFamily={SANS}>
          REC 04:18
        </text>

        {/* Right panel: patient, part timing, capture, captured images, status. */}
        <rect x={PANEL} y={BAR} width={W - PANEL} height={H - BAR} fill="#262627" />
        <text x={PANEL + 36} y={BAR + 52} fontSize={14} letterSpacing={2} fill="#b4b5b7" fontFamily={SANS}>
          PATIENT
        </text>
        <text x={PANEL + 36} y={BAR + 100} fontSize={38} fontWeight={600} fill="#e7e8e9" fontFamily={MONO}>
          HN-000123
        </text>
        <Timer x={PANEL + 28} label="INSERTION" value="06:42" />
        <Timer x={PANEL + 152} label="WITHDRAWAL" value="04:18" active />

        <circle cx={PANEL + 150} cy={470} r={64} fill="color-mix(in srgb, var(--endyra) 16%, transparent)" />
        <circle cx={PANEL + 150} cy={470} r={44} fill="var(--endyra)" />
        <rect x={PANEL + 132} y={460} width={36} height={26} rx={5} fill="none" stroke="#1c1c1d" strokeWidth={3.5} />
        <circle cx={PANEL + 150} cy={473} r={7.5} fill="none" stroke="#1c1c1d" strokeWidth={3.5} />
        <text x={PANEL + 150} y={566} fontSize={14} fill="#b4b5b7" textAnchor="middle" fontFamily={SANS}>
          Tap or press the foot switch
        </text>
        <rect x={PANEL + 36} y={590} width={228} height={52} rx={10} fill="none" stroke="#4a4a4c" />
        <text x={PANEL + 150} y={622} fontSize={17} fill="#e7e8e9" textAnchor="middle" fontFamily={SANS}>
          Record video
        </text>

        <text x={PANEL + 36} y={698} fontSize={14} letterSpacing={2} fill="#b4b5b7" fontFamily={SANS}>
          CAPTURED
        </text>
        <text x={PANEL + 264} y={698} fontSize={22} fill="#e7e8e9" textAnchor="end" fontFamily={MONO}>
          06
        </text>
        {thumbs.map(({ x, y }, i) => (
          <rect key={i} x={x} y={y} width={70} height={52} rx={6} fill="url(#endyra-scope)" stroke="#3a3a3c" />
        ))}
        <Dot x={PANEL + 44} y={872} />
        <text x={PANEL + 58} y={877} fontSize={14} fill="#b4b5b7" fontFamily={SANS}>
          Foot switch <tspan fill="#e7e8e9">Connected</tspan>
        </text>
      </g>
    </svg>
  )
}
