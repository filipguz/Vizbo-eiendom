import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CommandPaletteProvider } from './context/CommandPaletteContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MapView from './pages/MapView'
import ProjectDetail from './pages/ProjectDetail'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CommandPaletteProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CommandPaletteProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
