import express from 'express'
import cors from 'cors'
import { metricsMiddleware } from './middleware/metrics'
import routes from './routes'

const app = express()
const PORT = process.env.PORT || 3001

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}))
app.use(express.json())
app.use(metricsMiddleware)   // coleta métricas em todas as rotas

// ── Rota de healthcheck ───────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '3.0.0',
  })
})

// ── API ───────────────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err)
  res.status(500).json({ error: 'Erro interno no servidor.' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 AeroCode Backend rodando na porta ${PORT}`)
  console.log(`   Ambiente : ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health   : http://localhost:${PORT}/health`)
  console.log(`   API      : http://localhost:${PORT}/api\n`)
})

export default app
