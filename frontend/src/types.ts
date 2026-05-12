export type ProjectStatus = 'mulighetsstudie' | 'regulering' | 'prosjektering' | 'salg'

export interface AnalysisItem {
  score: number
  label: string
  description: string
}

export interface Project {
  id: string
  name: string
  location: string
  address: string
  coordinates: [number, number]
  status: ProjectStatus
  bra: number
  units: number
  floors: number
  zoningStatus: string
  zoningCode: string
  description: string
  completionYear: number
  investmentMNOK: number
  analysis: {
    sol: AnalysisItem
    støy: AnalysisItem
    flom: AnalysisItem
    fjernvirkning: AnalysisItem
  }
  documents: Array<{
    name: string
    type: 'PDF' | 'DWG' | 'IFC' | 'XLSX'
    date: string
    size: string
  }>
}
