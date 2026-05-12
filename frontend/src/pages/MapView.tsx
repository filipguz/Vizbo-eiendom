import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { MapPin, Sun, Volume2, Droplets, Eye, ArrowRight } from 'lucide-react'
import { projects } from '../data/projects'
import { Project } from '../types'
import StatusBadge from '../components/StatusBadge'
import ScoreCard from '../components/ScoreCard'

const STATUS_COLORS: Record<string, string> = {
  mulighetsstudie: '#8b5cf6',
  regulering: '#f59e0b',
  prosjektering: '#3b82f6',
  salg: '#10b981',
}

function FlyToProject({ project }: { project: Project | null }) {
  const map = useMap()
  useEffect(() => {
    if (project) {
      map.flyTo(project.coordinates, 14, { duration: 1.2 })
    }
  }, [project, map])
  return null
}

export default function MapView() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-72 flex-none flex flex-col bg-gray-900 border-r border-gray-800 overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-800">
          <h1 className="text-sm font-semibold text-white">Kartvisning</h1>
          <p className="text-xs text-gray-500 mt-0.5">Klikk et prosjekt for å se analyse</p>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p === selected ? null : p)}
              className={`w-full text-left rounded-xl p-3 border transition-all duration-150 ${
                selected?.id === p.id
                  ? 'bg-blue-600/15 border-blue-600/40'
                  : 'bg-gray-800/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <StatusBadge status={p.status} size="sm" />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: STATUS_COLORS[p.status], boxShadow: `0 0 6px ${STATUS_COLORS[p.status]}` }}
                />
              </div>
              <p className="text-sm font-semibold text-white leading-tight">{p.name}</p>
              <div className="flex items-center gap-1 text-gray-500 text-[11px] mt-1">
                <MapPin size={10} />
                <span>{p.location}</span>
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-gray-600">
                <span>{p.bra.toLocaleString('no')} m²</span>
                <span>·</span>
                <span>{p.units} enh.</span>
                <span>·</span>
                <span>{p.floors} et.</span>
              </div>
            </button>
          ))}
        </div>

        {/* Analysis panel */}
        {selected && (
          <div className="border-t border-gray-800 px-3 py-4 space-y-2 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Analyse</h2>
              <Link
                to={`/project/${selected.id}`}
                className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300"
              >
                Vis detaljer <ArrowRight size={10} />
              </Link>
            </div>
            <ScoreCard
              score={selected.analysis.sol.score}
              label={selected.analysis.sol.label}
              description={selected.analysis.sol.description}
              icon={<Sun size={14} />}
            />
            <ScoreCard
              score={selected.analysis.støy.score}
              label={selected.analysis.støy.label}
              description={selected.analysis.støy.description}
              icon={<Volume2 size={14} />}
            />
            <ScoreCard
              score={selected.analysis.flom.score}
              label={selected.analysis.flom.label}
              description={selected.analysis.flom.description}
              icon={<Droplets size={14} />}
            />
            <ScoreCard
              score={selected.analysis.fjernvirkning.score}
              label={selected.analysis.fjernvirkning.label}
              description={selected.analysis.fjernvirkning.description}
              icon={<Eye size={14} />}
            />
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[59.5, 9.5]}
          zoom={6}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
          <FlyToProject project={selected} />

          {projects.map((p) => (
            <CircleMarker
              key={p.id}
              center={p.coordinates}
              radius={selected?.id === p.id ? 10 : 7}
              pathOptions={{
                color: STATUS_COLORS[p.status],
                fillColor: STATUS_COLORS[p.status],
                fillOpacity: 0.9,
                weight: selected?.id === p.id ? 3 : 2,
                opacity: 1,
              }}
              eventHandlers={{
                click: () => setSelected(p === selected ? null : p),
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-semibold text-sm text-gray-100 mb-1">{p.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{p.address}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                    <span>BRA: {p.bra.toLocaleString('no')} m²</span>
                    <span>Enheter: {p.units}</span>
                    <span>Etasjer: {p.floors}</span>
                    <span>År: {p.completionYear}</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-5 right-5 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl p-3 z-[1000]">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">Status</p>
          {Object.entries({
            mulighetsstudie: 'Mulighetsstudie',
            regulering: 'Regulering',
            prosjektering: 'Prosjektering',
            salg: 'Salg',
          }).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2 mb-1 last:mb-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-none"
                style={{ background: STATUS_COLORS[key] }}
              />
              <span className="text-[11px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
