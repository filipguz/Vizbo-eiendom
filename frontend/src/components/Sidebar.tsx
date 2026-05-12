import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Building2, Settings, ChevronRight } from 'lucide-react'
import { projects } from '../data/projects'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Oversikt' },
  { to: '/map', icon: Map, label: 'Kartvisning' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 flex-none flex flex-col bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <Building2 size={15} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">Vizbo</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-[38px]">Eiendomsutvikling</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-2 mb-2">
          Navigasjon
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-2 mb-2">
            Prosjekter
          </p>
          {projects.map((p) => (
            <NavLink
              key={p.id}
              to={`/project/${p.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-gray-800 text-gray-100'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'
                }`
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-none ${statusDot(p.status)}`}
              />
              <span className="truncate flex-1 text-xs">{p.name}</span>
              <ChevronRight size={12} className="flex-none opacity-0 group-hover:opacity-50 transition-opacity" />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white flex-none">
            FG
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-300 truncate">Filip Gustaven</p>
            <p className="text-[10px] text-gray-600 truncate">Prosjektleder</p>
          </div>
          <Settings size={13} className="text-gray-600 hover:text-gray-400 cursor-pointer flex-none" />
        </div>
      </div>
    </aside>
  )
}

function statusDot(status: string) {
  switch (status) {
    case 'mulighetsstudie': return 'bg-violet-400'
    case 'regulering': return 'bg-amber-400'
    case 'prosjektering': return 'bg-blue-400'
    case 'salg': return 'bg-emerald-400'
    default: return 'bg-gray-400'
  }
}
