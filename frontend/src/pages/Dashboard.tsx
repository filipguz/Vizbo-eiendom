import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { MapPin, Building2, Layers, TrendingUp, ArrowRight, Calendar, Search } from 'lucide-react'
import { projects as allProjects } from '../data/projects'
import StatusBadge from '../components/StatusBadge'
import InvestmentChart from '../components/InvestmentChart'
import ActivityFeed from '../components/ActivityFeed'
import { ProjectStatus } from '../types'

const STEPS: ProjectStatus[] = ['mulighetsstudie', 'regulering', 'prosjektering', 'salg']
const STEP_LABELS = ['Mulighetsstudie', 'Regulering', 'Prosjektering', 'Salg']
const STATUS_DOT: Record<ProjectStatus, string> = {
  mulighetsstudie: 'bg-violet-500',
  regulering:      'bg-amber-500',
  prosjektering:   'bg-blue-500',
  salg:            'bg-emerald-500',
}
const STATUS_FILTER_LABELS: Array<{ value: ProjectStatus | 'alle'; label: string }> = [
  { value: 'alle',            label: 'Alle' },
  { value: 'mulighetsstudie', label: 'Mulighetsstudie' },
  { value: 'regulering',      label: 'Regulering' },
  { value: 'prosjektering',   label: 'Prosjektering' },
  { value: 'salg',            label: 'Salg' },
]

const kpiVariants:     Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const cardVariants:    Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const sidebarVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }
const fadeUp:          Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
}

export default function Dashboard() {
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'alle'>('alle')
  const [filterCity,   setFilterCity]   = useState('alle')
  const [search,       setSearch]       = useState('')

  const filtered = allProjects.filter((p) => {
    if (filterStatus !== 'alle' && p.status !== filterStatus) return false
    if (filterCity   !== 'alle' && p.location !== filterCity)  return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalBRA        = allProjects.reduce((s, p) => s + p.bra, 0)
  const totalUnits      = allProjects.reduce((s, p) => s + p.units, 0)
  const totalInvestment = allProjects.reduce((s, p) => s + p.investmentMNOK, 0)
  const cities          = [...new Set(allProjects.map((p) => p.location))]

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Prosjektoversikt</h1>
          <p className="text-sm text-slate-500 dark:text-gray-500 mt-1">
            {allProjects.length} aktive utviklingsprosjekter · Sist oppdatert 12. mai 2026
          </p>
        </motion.div>

        {/* KPI row */}
        <motion.div
          className="grid grid-cols-4 gap-4 mb-8"
          variants={kpiVariants} initial="hidden" animate="show"
        >
          <KpiCard label="Aktive prosjekter" value="4"
            icon={<Building2 size={18} className="text-blue-500" />} sub="+1 siste kvartal" subGreen />
          <KpiCard label="Totalt BRA" value={`${(totalBRA/1000).toFixed(1)}k m²`}
            icon={<Layers size={18} className="text-violet-500" />} sub="59 700 m² samlet" />
          <KpiCard label="Antall enheter" value={totalUnits.toString()}
            icon={<MapPin size={18} className="text-emerald-500" />} sub="449 leiligheter" />
          <KpiCard label="Totalinvestering" value={`${totalInvestment} MNOK`}
            icon={<TrendingUp size={18} className="text-amber-500" />} sub="1,19 mrd. NOK" />
        </motion.div>

        <div className="flex gap-5 items-start">
          {/* Left */}
          <div className="flex-1 min-w-0">
            {/* Filter bar */}
            <motion.div
              className="flex flex-wrap items-center gap-2 mb-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.3 }}
            >
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-600" />
                <input type="text" placeholder="Søk prosjekt…" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-slate-400 dark:focus:border-gray-600 w-40"
                />
              </div>
              <div className="flex gap-1.5">
                {STATUS_FILTER_LABELS.map(({ value, label }) => (
                  <button key={value} onClick={() => setFilterStatus(value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterStatus === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-900 text-slate-500 dark:text-gray-500 border border-slate-200 dark:border-gray-800 hover:text-slate-800 dark:hover:text-gray-300 hover:border-slate-300 dark:hover:border-gray-700'
                    }`}>{label}</button>
                ))}
              </div>
              <div className="flex gap-1.5 ml-1">
                {['alle', ...cities].map((city) => (
                  <button key={city} onClick={() => setFilterCity(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterCity === city
                        ? 'bg-slate-700 dark:bg-gray-700 text-white'
                        : 'bg-white dark:bg-gray-900 text-slate-500 dark:text-gray-600 border border-slate-200 dark:border-gray-800 hover:text-slate-700 dark:hover:text-gray-400 hover:border-slate-300 dark:hover:border-gray-700'
                    }`}>{city === 'alle' ? 'Alle byer' : city}</button>
                ))}
              </div>
              {filtered.length !== allProjects.length && (
                <span className="text-xs text-slate-400 dark:text-gray-600 ml-1">
                  {filtered.length} av {allProjects.length} prosjekter
                </span>
              )}
            </motion.div>

            {/* Project cards */}
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 text-slate-400 dark:text-gray-600 text-sm">
                Ingen prosjekter matcher filteret
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={cardVariants} initial="hidden" animate="show"
              >
                {filtered.map((p) => {
                  const stepIdx = STEPS.indexOf(p.status)
                  return (
                    <motion.div key={p.id} variants={fadeUp}
                      whileHover={{ y: -2, transition: { duration: 0.15 } }}
                      className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-gray-700 hover:shadow-lg dark:hover:shadow-black/30 transition-colors duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <StatusBadge status={p.status} />
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-gray-600 text-xs">
                          <Calendar size={11} /><span>{p.completionYear}</span>
                        </div>
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {p.name}
                      </h2>
                      <div className="flex items-center gap-1 text-slate-400 dark:text-gray-500 text-xs mb-4">
                        <MapPin size={11} /><span>{p.address}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <Stat label="BRA"     value={`${p.bra.toLocaleString('no')} m²`} />
                        <Stat label="Enheter" value={p.units.toString()} />
                        <Stat label="Etasjer" value={p.floors.toString()} />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400 dark:text-gray-600">Investering</span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">{p.investmentMNOK} MNOK</span>
                      </div>
                      {/* Progress steps */}
                      <div className="mb-4">
                        <div className="flex items-center">
                          {STEPS.map((step, i) => {
                            const active = i === stepIdx
                            const done   = i < stepIdx
                            return (
                              <div key={step} className="flex items-center flex-1">
                                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                                  active ? `${STATUS_DOT[p.status]} border-transparent scale-125`
                                         : done ? 'bg-slate-400 dark:bg-gray-600 border-transparent'
                                                : 'bg-transparent border-slate-300 dark:border-gray-700'
                                }`} />
                                {i < STEPS.length - 1 && (
                                  <div className={`flex-1 h-px ${done||active ? 'bg-slate-400 dark:bg-gray-600' : 'bg-slate-200 dark:bg-gray-800'}`} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex justify-between mt-1.5">
                          {STEP_LABELS.map((l, i) => (
                            <span key={l} className={`text-[9px] ${i===stepIdx ? 'text-slate-600 dark:text-gray-400 font-medium' : 'text-slate-300 dark:text-gray-700'}`}>
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link to={`/project/${p.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all border border-slate-200 dark:border-gray-700 group/btn">
                        Se prosjektdetaljer
                        <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </div>

          {/* Right sidebar */}
          <motion.div
            className="w-64 flex-none space-y-4"
            variants={sidebarVariants} initial="hidden" animate="show"
          >
            <motion.div variants={fadeUp}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4">Investering</p>
              <InvestmentChart projects={allProjects} />
            </motion.div>
            <motion.div variants={fadeUp}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4">Siste aktivitet</p>
              <ActivityFeed />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, icon, sub, subGreen }: {
  label: string; value: string; icon: React.ReactNode; sub: string; subGreen?: boolean
}) {
  return (
    <motion.div variants={fadeUp}
      className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-gray-500">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
      <p className={`text-[10px] ${subGreen ? 'text-emerald-500' : 'text-slate-400 dark:text-gray-600'}`}>{sub}</p>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-gray-800/60 rounded-lg px-3 py-2">
      <p className="text-[10px] text-slate-400 dark:text-gray-600 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">{value}</p>
    </div>
  )
}
