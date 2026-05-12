import express from 'express'
import cors from 'cors'
import projectsRouter from './routes/projects'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use('/api/projects', projectsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vizbo-api', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Vizbo API running on http://localhost:${PORT}`)
})
