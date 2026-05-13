import { useState } from 'react'
import { Project } from '../types'

const STATUS_COLOR: Record<string, string> = {
  mulighetsstudie: '#8b5cf6',
  regulering:      '#f59e0b',
  prosjektering:   '#3b82f6',
  salg:            '#10b981',
}

interface Props {
  projects: Project[]
}

export default function InvestmentChart({ projects }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const total = projects.reduce((s, p) => s + p.investmentMNOK, 0)

  // Build donut arcs
  const cx = 80
  const cy = 80
  const R = 58
  const r = 36
  const gap = 0.03 // radians gap between slices

  let cumAngle = -Math.PI / 2

  const slices = projects.map((p) => {
    const fraction = p.investmentMNOK / total
    const sweep = fraction * 2 * Math.PI - gap
    const startAngle = cumAngle + gap / 2
    const endAngle = startAngle + sweep
    cumAngle += fraction * 2 * Math.PI

    const x1 = cx + R * Math.cos(startAngle)
    const y1 = cy + R * Math.sin(startAngle)
    const x2 = cx + R * Math.cos(endAngle)
    const y2 = cy + R * Math.sin(endAngle)
    const ix1 = cx + r * Math.cos(endAngle)
    const iy1 = cy + r * Math.sin(endAngle)
    const ix2 = cx + r * Math.cos(startAngle)
    const iy2 = cy + r * Math.sin(startAngle)
    const large = sweep > Math.PI ? 1 : 0

    const d = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${r} ${r} 0 ${large} 0 ${ix2} ${iy2}`,
      'Z',
    ].join(' ')

    return { p, d, fraction, color: STATUS_COLOR[p.status] }
  })

  const active = hovered ? projects.find((p) => p.id === hovered) : null

  return (
    <div className="flex items-center gap-6">
      {/* Donut */}
      <div className="relative flex-none">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map(({ p, d, color }) => (
            <path
              key={p.id}
              d={d}
              fill={color}
              opacity={hovered && hovered !== p.id ? 0.3 : 1}
              style={{ transition: 'opacity 0.15s', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          {/* Center label */}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#f9fafb" fontSize="14" fontWeight="700">
            {active ? active.investmentMNOK : total}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize="9">
            {active ? 'MNOK' : 'MNOK totalt'}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {slices.map(({ p, fraction, color }) => (
          <div
            key={p.id}
            className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-sm flex-none"
              style={{ background: color, opacity: hovered && hovered !== p.id ? 0.3 : 1 }}
            />
            <span
              className={`text-xs flex-1 truncate transition-colors ${
                hovered === p.id ? 'text-gray-200' : 'text-gray-500'
              }`}
            >
              {p.name}
            </span>
            <span className={`text-xs font-semibold tabular-nums ${hovered === p.id ? 'text-white' : 'text-gray-600'}`}>
              {Math.round(fraction * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
