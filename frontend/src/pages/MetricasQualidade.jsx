import React, { useState, useEffect } from 'react'
import { metricsAPI } from '../services/api'
import { Activity, Zap, Clock, RefreshCw, Play, BarChart2 } from 'lucide-react'

const COLORS = {
  latency:    '#6366f1',
  processing: '#f59e0b',
  response:   '#10b981',
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ background: 'var(--lavender-200)', borderRadius: 99, height: 8, width: '100%', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
    </div>
  )
}

function BarChart({ data, metricKey, color, label, unit = 'ms' }) {
  if (!data || data.length === 0) return (
    <div style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)', fontSize: 13 }}>
      Sem dados. Execute a simulação primeiro.
    </div>
  )
  const maxVal = Math.max(...data.map(d => d[metricKey] || 0), 1)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, padding: '0 4px' }}>
        {data.map((d, i) => {
          const h = Math.max(((d[metricKey] || 0) / maxVal) * 140, 4)
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 10, color: 'var(--gray-500)', fontWeight: 600 }}>
                {(d[metricKey] || 0).toFixed(1)}
              </div>
              <div style={{
                width: '100%', height: h, background: color,
                borderRadius: '4px 4px 0 0', opacity: 0.85,
                transition: 'height 0.4s ease',
              }} />
              <div style={{ fontSize: 9, color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.2 }}>
                {d.userCount}u
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
        {label} ({unit}) · por número de usuários
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, title, value, color, bg, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div className="stat-label">{title}</div>
        <div className="stat-value" style={{ fontSize: 20 }}>{value} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-500)' }}>ms</span></div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

export default function MetricasQualidade() {
  const [metrics, setMetrics]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [simLoading, setSimLoad]  = useState(false)
  const [userSim, setUserSim]     = useState(1)
  const [reqSim, setReqSim]       = useState(10)
  const [error, setError]         = useState('')

  const fetchMetrics = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await metricsAPI.buscar()
      setMetrics(data)
    } catch (e) {
      setError('Não foi possível carregar as métricas. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const simulate = async (users) => {
    setSimLoad(true)
    setError('')
    try {
      await metricsAPI.simular(users, reqSim)
      await fetchMetrics()
    } catch (e) {
      setError('Erro ao simular carga.')
    } finally {
      setSimLoad(false)
    }
  }

  const simulateAll = async () => {
    setSimLoad(true)
    setError('')
    try {
      await metricsAPI.simular(1, reqSim)
      await metricsAPI.simular(5, reqSim)
      await metricsAPI.simular(10, reqSim)
      await fetchMetrics()
    } catch (e) {
      setError('Erro ao simular carga.')
    } finally {
      setSimLoad(false)
    }
  }

  useEffect(() => { fetchMetrics() }, [])

  // Monta array com dados por grupo de usuário para os gráficos
  const chartData = metrics ? [
    { userCount: 1,  ...metrics.by1User  },
    { userCount: 5,  ...metrics.by5Users },
    { userCount: 10, ...metrics.by10Users },
  ] : []

  const totalRequests = metrics?.total || 0

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Métricas de Qualidade</h1>
          <p className="page-subtitle">
            Relatório de desempenho — latência, processamento e tempo de resposta
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={fetchMetrics} disabled={loading}>
            <RefreshCw size={15} /> Atualizar
          </button>
          <button className="btn btn-primary" onClick={simulateAll} disabled={simLoading}>
            <Play size={15} /> {simLoading ? 'Simulando...' : 'Simular 1/5/10 usuários'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>
      )}

      {/* ── Cards de resumo ─────────────────────────────────────────────────── */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <MetricCard
          icon={Activity} title="Latência Média (1u)"
          value={metrics?.by1User?.avgLatency ?? '—'}
          color="var(--navy-700)" bg="var(--lavender-200)"
          subtitle="Tempo de rede estimado"
        />
        <MetricCard
          icon={Zap} title="Processamento Médio (1u)"
          value={metrics?.by1User?.avgProcessing ?? '—'}
          color="var(--amber-900)" bg="var(--amber-100)"
          subtitle="Tempo do servidor"
        />
        <MetricCard
          icon={Clock} title="Resp. Total Médio (1u)"
          value={metrics?.by1User?.avgResponse ?? '—'}
          color="var(--green-900)" bg="var(--green-100)"
          subtitle="Latência + Processamento"
        />
        <MetricCard
          icon={BarChart2} title="Total de Requisições"
          value={totalRequests}
          color="var(--blue-900)" bg="var(--blue-100)"
          subtitle="No buffer de métricas"
        />
      </div>

      {/* ── Simulador de carga ───────────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          Simulador de Carga
        </h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Nº de requisições por simulação</label>
            <input className="form-input" type="number" min={1} max={50} value={reqSim}
              onChange={e => setReqSim(parseInt(e.target.value) || 10)}
              style={{ width: 120 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => simulate(1)} disabled={simLoading}>
              <Play size={14} /> 1 usuário
            </button>
            <button className="btn btn-ghost" onClick={() => simulate(5)} disabled={simLoading}>
              <Play size={14} /> 5 usuários
            </button>
            <button className="btn btn-ghost" onClick={() => simulate(10)} disabled={simLoading}>
              <Play size={14} /> 10 usuários
            </button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 12 }}>
          A simulação injeta requisições reais no servidor e mede latência, tempo de processamento e tempo de resposta.
          Execute para cada cenário (1, 5 e 10 usuários) para popular os gráficos abaixo.
        </p>
      </div>

      {/* ── Gráficos ─────────────────────────────────────────────────────────── */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Gráfico 1: Latência */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.latency }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              Latência de Rede (ms)
            </h2>
          </div>
          <BarChart data={chartData} metricKey="avgLatency" color={COLORS.latency}
            label="Latência média" />
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.6 }}>
            Tempo que o dado leva para percorrer entre cliente e servidor. Medida entre o envio da
            requisição e o início da resposta. Escala: 1, 5 e 10 usuários simultâneos.
          </div>
        </div>

        {/* Gráfico 2: Processamento */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.processing }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              Tempo de Processamento (ms)
            </h2>
          </div>
          <BarChart data={chartData} metricKey="avgProcessing" color={COLORS.processing}
            label="Processamento médio" />
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.6 }}>
            Período em que o servidor processa a requisição: acesso ao banco de dados, regras
            de negócio e preparação da resposta. Medido em millisegundos com <code>process.hrtime</code>.
          </div>
        </div>
      </div>

      {/* Gráfico 3: Tempo de Resposta */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.response }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
            Tempo de Resposta Total (ms) — Experiência do Usuário
          </h2>
        </div>
        <div style={{ maxWidth: 600 }}>
          <BarChart data={chartData} metricKey="avgResponse" color={COLORS.response}
            label="Tempo de resposta total" />
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.6 }}>
          Soma da latência de rede + tempo de processamento. É o indicador mais próximo da
          experiência real do usuário. Quanto menor, mais responsiva é a aplicação.
          Fórmula: <strong>Tempo de Resposta = Latência + Processamento</strong>.
        </div>
      </div>

      {/* ── Tabela comparativa ───────────────────────────────────────────────── */}
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          Tabela Comparativa — Escalabilidade por Usuários
        </h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuários</th>
                <th>Requisições</th>
                <th>Latência Média</th>
                <th>Processamento Médio</th>
                <th>Resp. Total Médio</th>
                <th>Impacto vs 1 usuário</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '1 usuário',  data: metrics?.by1User  },
                { label: '5 usuários', data: metrics?.by5Users },
                { label: '10 usuários',data: metrics?.by10Users},
              ].map(({ label, data: d }, i) => {
                const base = metrics?.by1User?.avgResponse || 1
                const pct = d ? (((d.avgResponse - base) / base) * 100).toFixed(0) : '—'
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{label}</td>
                    <td>{d?.count ?? 0}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, color: COLORS.latency }}>{d?.avgLatency ?? '—'} ms</span>
                        <MiniBar value={d?.avgLatency || 0} max={20} color={COLORS.latency} />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, color: COLORS.processing }}>{d?.avgProcessing ?? '—'} ms</span>
                        <MiniBar value={d?.avgProcessing || 0} max={20} color={COLORS.processing} />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, color: COLORS.response }}>{d?.avgResponse ?? '—'} ms</span>
                        <MiniBar value={d?.avgResponse || 0} max={40} color={COLORS.response} />
                      </div>
                    </td>
                    <td>
                      {i === 0 ? (
                        <span className="badge badge-green">Linha base</span>
                      ) : d?.count > 0 ? (
                        <span className={`badge ${parseInt(pct) < 50 ? 'badge-green' : parseInt(pct) < 100 ? 'badge-amber' : 'badge-red'}`}>
                          +{pct}%
                        </span>
                      ) : <span className="badge badge-gray">Sem dados</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Metodologia ──────────────────────────────────────────────────── */}
        <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--lavender-50)', borderRadius: 10, border: '1px solid var(--lavender-200)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 8, color: 'var(--navy-800)' }}>
            📋 Metodologia de Medição
          </div>
          <ul style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.9, paddingLeft: 18 }}>
            <li><strong>Latência</strong>: estimada por ambiente (local ~2–5 ms, LAN ~10–30 ms). Cresce proporcionalmente com o número de usuários simultâneos.</li>
            <li><strong>Tempo de Processamento</strong>: medido via <code>process.hrtime.bigint()</code> no middleware Express, capturando o intervalo entre a entrada da requisição e o envio da resposta.</li>
            <li><strong>Tempo de Resposta</strong>: soma aritmética de latência + processamento, representando o tempo total percebido pelo usuário.</li>
            <li><strong>Escalabilidade</strong>: simulada com 1, 5 e 10 usuários simultâneos via header HTTP <code>X-User-Count</code> e endpoint <code>POST /api/metrics/simulate</code>.</li>
            <li><strong>Unidade</strong>: todas as medições em <strong>milissegundos (ms)</strong>, conforme especificado.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
