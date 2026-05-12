import express from 'express'
import cors from 'cors'
import path from 'path'
import projectsRouter from './routes/projects'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)
const isProd = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())

app.use('/api/projects', projectsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vizbo-api', timestamp: new Date().toISOString() })
})

if (isProd) {
  const frontendDist = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Vizbo API running on http://localhost:${PORT}`)
})
