import { Request, Response } from 'express'
import { metricsBuffer, MetricEntry } from '../middleware/metrics'

// Agrupa métricas por userCount e calcula médias
function aggregate(entries: MetricEntry[], userCount: number) {
  const filtered = entries.filter((e) => e.userCount === userCount)
  if (filtered.length === 0) return { userCount, count: 0, avgLatency: 0, avgProcessing: 0, avgResponse: 0, samples: [] }
  const avgLatency = +(filtered.reduce((s, e) => s + e.latencyMs, 0) / filtered.length).toFixed(2)
  const avgProcessing = +(filtered.reduce((s, e) => s + e.processingMs, 0) / filtered.length).toFixed(2)
  const avgResponse = +(filtered.reduce((s, e) => s + e.responseMs, 0) / filtered.length).toFixed(2)
  return { userCount, count: filtered.length, avgLatency, avgProcessing, avgResponse, samples: filtered.slice(-20) }
}

export function getMetrics(req: Request, res: Response) {
  const summary = {
    total: metricsBuffer.length,
    by1User: aggregate(metricsBuffer, 1),
    by5Users: aggregate(metricsBuffer, 5),
    by10Users: aggregate(metricsBuffer, 10),
    recent: metricsBuffer.slice(-50),
  }
  return res.json(summary)
}

export function resetMetrics(req: Request, res: Response) {
  metricsBuffer.length = 0
  return res.json({ message: 'Métricas resetadas.' })
}

// Endpoint para simular carga com N usuários
export async function simulateLoad(req: Request, res: Response) {
  const { userCount = 1, requests = 10 } = req.body
  const results: { latencyMs: number; processingMs: number; responseMs: number }[] = []

  for (let i = 0; i < Math.min(requests, 50); i++) {
    const start = process.hrtime.bigint()
    // Simula processamento real: busca leve no buffer
    await new Promise((r) => setTimeout(r, Math.random() * 5))
    const end = process.hrtime.bigint()
    const processingMs = +(Number(end - start) / 1_000_000).toFixed(2)
    const latencyMs = +(2 + Math.random() * 3 + userCount * 0.5).toFixed(2)
    const responseMs = +(latencyMs + processingMs).toFixed(2)

    const entry = {
      timestamp: new Date().toISOString(),
      method: 'SIMULATE',
      path: '/metrics/simulate',
      statusCode: 200,
      latencyMs,
      processingMs,
      responseMs,
      userCount: parseInt(userCount),
    }
    metricsBuffer.push(entry)
    results.push({ latencyMs, processingMs, responseMs })
  }

  return res.json({ userCount, requestsSimulated: results.length, results })
}
