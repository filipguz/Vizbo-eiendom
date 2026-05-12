import { Router } from 'express'
import { projects } from '../data/projects'

const router = Router()

router.get('/', (_req, res) => {
  res.json(projects)
})

router.get('/:id', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  res.json(project)
})

export default router
