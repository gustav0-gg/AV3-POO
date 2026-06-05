import { Request, Response, NextFunction } from 'express'

export interface MetricEntry {
  timestamp: string
  method: string
  path: string
  statusCode: number
  latencyMs: number        // tempo de rede estimado (fixo por ambiente de teste)
  processingMs: number     // tempo que o servidor levou para processar
  responseMs: number       // latency + processing = tempo total percebido
  userCount: number        // simulado via header X-User-Count
}

// Buffer em memória — guarda as últimas 500 medições
export const metricsBuffer: MetricEntry[] = []

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const startHR = process.hrtime.bigint()

  res.on('finish', () => {
    const endHR = process.hrtime.bigint()
    const processingMs = Number(endHR - startHR) / 1_000_000

    // Latência estimada: em ambiente local ~2-5 ms; em LAN ~10-30 ms
    // Usamos um valor aleatório simulado proporcional ao contexto
    const userCount = parseInt(req.headers['x-user-count'] as string) || 1
    const baseLatency = 2 + Math.random() * 3          // 2–5 ms base
    const latencyMs = +(baseLatency + userCount * 0.5).toFixed(2)

    const entry: MetricEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      latencyMs,
      processingMs: +processingMs.toFixed(2),
      responseMs: +(latencyMs + processingMs).toFixed(2),
      userCount,
    }

    metricsBuffer.push(entry)
    if (metricsBuffer.length > 500) metricsBuffer.shift()
  })

  next()
}
