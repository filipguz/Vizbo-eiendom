# Vizbo — Property Development Platform

A PropTech SaaS demo platform for tracking and analyzing property development projects in Norway.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS |
| Backend | Node.js, Express 4, TypeScript |
| Map | Leaflet + react-leaflet + CartoDB Dark tiles (no API key) |
| 3D Viewer | Three.js with OrbitControls |
| Routing | React Router v6 |
| Icons | lucide-react |

## Getting Started

```bash
npm install
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Features

- **Project Dashboard** — KPI overview + 4 project cards with status, BIM stats, and progress tracker
- **Interactive Map** — Dark-themed Leaflet map with color-coded markers by project status and an analysis panel
- **Analysis Panels** — Sol, støy, flom, and fjernvirkning scores with circular SVG gauges
- **3D Massing Viewer** — Three.js building model sized from project data, with orbit controls
- **Project Detail** — Full view with BIM data, zoning info, analysis cards, 3D viewer, and document list

## Project Statuses

| Status | Norwegian stage |
|---|---|
| Mulighetsstudie | Feasibility study |
| Regulering | Zoning/planning |
| Prosjektering | Design/engineering |
| Salg | Sales/launch |

## Mock Projects

| Project | Location | Status | BRA |
|---|---|---|---|
| Bjørvika Havnefront | Oslo | Regulering | 24 500 m² |
| Kvadraturen Parkside | Kristiansand | Mulighetsstudie | 8 200 m² |
| Majorstuen Kvartal | Oslo | Prosjektering | 15 800 m² |
| Lund Terrasse | Kristiansand | Salg | 11 200 m² |
