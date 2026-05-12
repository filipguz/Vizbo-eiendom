import { Link } from 'react-router-dom'
import { MapPin, Building2, Layers, TrendingUp, ArrowRight, Calendar } from 'lucide-react'
import { projects } from '../data/projects'
import StatusBadge from '../components/StatusBadge'
import { ProjectStatus } from '../types'

const STEPS: ProjectStatus[] = ['mulighetsstudie', 'regulering', 'prosjektering', 'salg']
const STEP_LABELS = ['Mulighetsstudie', 'Regulering', 'Prosjektering', 'Salg']

const stepColor: Record<ProjectStatus, string> = {
  mulighetsstudie: 'bg-violet-500',
  regulering: 'bg-amber-500',
  prosjektering: 'bg-blue-500',
  salg: 'bg-emerald-500',
}

export default function Dashboard() {
  const totalBRA = projects.reduce((s, p) => s + p.bra, 0)
  const totalUnits = projects.reduce((s, p) => s + p.units, 0)
  const totalInvestment = projects.reduce((s, p) => s + p.investmentMNOK, 0)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Prosjektoversikt</h1>
        <p className="text-sm text-gray-500 mt-1">4 aktive utviklingsprosjekter · Sist oppdatert 12. mai 2026</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Aktive prosjekter"
          value="4"
          icon={<Building2 size={18} className="text-blue-400" />}
          trend="+1 siste kvartal"
          trendUp
        />
        <KpiCard
          label="Totalt BRA"
          value={`${(totalBRA / 1000).toFixed(1)}k m²`}
          icon={<Layers size={18} className="text-violet-400" />}
          trend="59 700 m² samlet"
        />
        <KpiCard
          label="Antall enheter"
          value={totalUnits.toString()}
          icon={<MapPin size={18} className="text-emerald-400" />}
          trend="449 leiligheter"
        />
        <KpiCard
          label="Totalinvestering"
          value={`${totalInvestment} MNOK`}
          icon={<TrendingUp size={18} className="text-amber-400" />}
          trend="1,19 mrd. NOK"
        />
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-2 gap-5">
        {projects.map((p) => {
          const stepIdx = STEPS.indexOf(p.status)
          return (
            <div
              key={p.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-200 group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={p.status} />
                <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                  <Calendar size={11} />
                  <span>{p.completionYear}</span>
                </div>
              </div>

              {/* Name + location */}
              <h2 className="text-lg font-semibold text-white mb-0.5 group-hover:text-blue-300 transition-colors">
                {p.name}
              </h2>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
                <MapPin size={11} />
                <span>{p.address}</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Stat label="BRA" value={`${p.bra.toLocaleString('no')} m²`} />
                <Stat label="Enheter" value={p.units.toString()} />
                <Stat label="Etasjer" value={p.floors.toString()} />
              </div>

              {/* Investment */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-600">Investering</span>
                <span className="text-sm font-semibold text-gray-300">{p.investmentMNOK} MNOK</span>
              </div>

              {/* Progress steps */}
              <div className="mb-4">
                <div className="flex items-center gap-0">
                  {STEPS.map((step, i) => {
                    const active = i === stepIdx
                    const done = i < stepIdx
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="relative flex items-center justify-center">
                          <div
                            className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                              active
                                ? `${stepColor[p.status]} border-transparent scale-125`
                                : done
                                ? 'bg-gray-600 border-transparent'
                                : 'bg-transparent border-gray-700'
                            }`}
                          />
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-px ${done || active ? 'bg-gray-600' : 'bg-gray-800'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-1.5">
                  {STEP_LABELS.map((l, i) => (
                    <span
                      key={l}
                      className={`text-[9px] ${i === stepIdx ? 'text-gray-400 font-medium' : 'text-gray-700'}`}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/project/${p.id}`}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium transition-all duration-150 border border-gray-700 hover:border-gray-600 group/btn"
              >
                Se prosjektdetaljer
                <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  icon,
  trend,
  trendUp,
}: {
  label: string
  value: string
  icon: React.ReactNode
  trend: string
  trendUp?: boolean
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-xl font-bold text-white mb-1">{value}</p>
      <p className={`text-[10px] ${trendUp ? 'text-emerald-400' : 'text-gray-600'}`}>{trend}</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/60 rounded-lg px-3 py-2">
      <p className="text-[10px] text-gray-600 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-200">{value}</p>
    </div>
  )
}
