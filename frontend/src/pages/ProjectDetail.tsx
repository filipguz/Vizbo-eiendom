import { useParams, Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, MapPin, Building2, Layers, Calendar, TrendingUp, Sun, Volume2, Droplets, Eye, FileText, Download, Box } from 'lucide-react'
import { projects } from '../data/projects'
import StatusBadge from '../components/StatusBadge'
import ScoreCard from '../components/ScoreCard'
import ThreeViewer from '../components/ThreeViewer'
import FinancialCalculator from '../components/FinancialCalculator'

const FILE_TYPE_COLORS: Record<string, string> = {
  PDF:  'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
  DWG:  'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
  IFC:  'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20',
  XLSX: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
}

const statsVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeUp:        Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-slate-400 dark:text-gray-500">Prosjekt ikke funnet</p>
        <Link to="/" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Tilbake til oversikt</Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-gray-300 mb-6 transition-colors">
          <ArrowLeft size={14} />Tilbake til oversikt
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        className="flex items-start justify-between mb-6"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-500 text-sm">
            <MapPin size={13} /><span>{project.address}</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-500 mt-2 max-w-xl leading-relaxed">{project.description}</p>
        </div>
        <div className="flex-none text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{project.investmentMNOK} MNOK</p>
          <p className="text-xs text-slate-400 dark:text-gray-600 mt-0.5">Estimert investering</p>
        </div>
      </motion.div>

      {/* BIM stats */}
      <motion.div
        className="grid grid-cols-5 gap-3 mb-6"
        variants={statsVariants} initial="hidden" animate="show"
      >
        {[
          { icon: <Layers    size={16} className="text-blue-500" />,   label: 'Bruksareal',      value: `${project.bra.toLocaleString('no')} m²` },
          { icon: <Building2 size={16} className="text-violet-500" />, label: 'Enheter',         value: project.units.toString() },
          { icon: <Box       size={16} className="text-amber-500" />,  label: 'Etasjer',         value: project.floors.toString() },
          { icon: <Calendar  size={16} className="text-emerald-500" />,label: 'Ferdigstillelse', value: project.completionYear.toString() },
          { icon: <TrendingUp size={16} className="text-rose-500" />,  label: 'Arealformål',     value: project.zoningCode },
        ].map(({ icon, label, value }) => (
          <motion.div key={label} variants={fadeUp}
            className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-slate-400 dark:text-gray-500">{label}</span></div>
            <p className="text-base font-bold text-slate-900 dark:text-white">{value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Zoning */}
      <motion.div
        className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <span className="text-xs text-slate-500 dark:text-gray-400">
          <span className="font-medium text-slate-700 dark:text-gray-300">Planstatus:</span> {project.zoningStatus}
        </span>
      </motion.div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h2 className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">Stedanalyse</h2>
          <div className="space-y-2">
            <ScoreCard score={project.analysis.sol.score}           label={project.analysis.sol.label}           description={project.analysis.sol.description}           icon={<Sun      size={14} />} delay={0.3} />
            <ScoreCard score={project.analysis.støy.score}          label={project.analysis.støy.label}          description={project.analysis.støy.description}          icon={<Volume2  size={14} />} delay={0.38} />
            <ScoreCard score={project.analysis.flom.score}          label={project.analysis.flom.label}          description={project.analysis.flom.description}          icon={<Droplets size={14} />} delay={0.46} />
            <ScoreCard score={project.analysis.fjernvirkning.score} label={project.analysis.fjernvirkning.label} description={project.analysis.fjernvirkning.description} icon={<Eye      size={14} />} delay={0.54} />
          </div>
        </motion.div>

        {/* 3D viewer */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">3D Massemodell</h2>
          <div className="h-[420px] bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden">
            <ThreeViewer project={project} />
          </div>
        </motion.div>
      </div>

      {/* Financial calculator */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.55 }}
      >
        <FinancialCalculator project={project} />
      </motion.div>

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.5 }}
      >
        <h2 className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          Dokumenter ({project.documents.length})
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
          {project.documents.map((doc, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.55 + i * 0.06 }}
              className={`flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                i < project.documents.length - 1 ? 'border-b border-slate-100 dark:border-gray-800' : ''
              }`}
            >
              <FileText size={15} className="text-slate-400 dark:text-gray-600 flex-none" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 dark:text-gray-200 font-medium truncate">{doc.name}</p>
                <p className="text-xs text-slate-400 dark:text-gray-600">{doc.date} · {doc.size}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${FILE_TYPE_COLORS[doc.type] || 'text-slate-500 bg-slate-100 border-slate-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700'}`}>
                {doc.type}
              </span>
              <Download size={13} className="text-slate-300 dark:text-gray-700 hover:text-slate-500 dark:hover:text-gray-400 transition-colors flex-none" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
