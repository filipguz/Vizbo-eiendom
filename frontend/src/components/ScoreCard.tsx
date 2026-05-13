interface Props {
  score: number
  label: string
  description: string
  icon: React.ReactNode
}

function scoreColor(score: number) {
  if (score >= 70) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' }
  if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-500/20' }
  return             { stroke: '#ef4444', text: 'text-red-600 dark:text-red-400',           bg: 'bg-red-50 dark:bg-red-500/10',       border: 'border-red-200 dark:border-red-500/20' }
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
      <div className="flex-none flex flex-col items-center gap-1">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor" strokeWidth="6"
              className="text-slate-200 dark:text-white/5" />
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

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-slate-400 dark:text-gray-400">{icon}</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-gray-200">{label}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
