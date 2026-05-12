interface Props {
  score: number
  label: string
  description: string
  icon: React.ReactNode
}

function scoreColor(score: number) {
  if (score >= 70) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
  if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
  return { stroke: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
}

function scoreLabel(score: number) {
  if (score >= 80) return 'Svært god'
  if (score >= 60) return 'God'
  if (score >= 40) return 'Moderat'
  if (score >= 20) return 'Lav'
  return 'Kritisk'
}

export default function ScoreCard({ score, label, description, icon }: Props) {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const colors = scoreColor(score)

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 flex gap-4 items-start`}>
      {/* Arc gauge */}
      <div className="flex-none flex flex-col items-center gap-1">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
            />
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
          </div>
        </div>
        <span className={`text-[10px] font-medium ${colors.text}`}>{scoreLabel(score)}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-semibold text-gray-200">{label}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
