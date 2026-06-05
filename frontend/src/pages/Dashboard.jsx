import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Plane, GitBranch, FlaskConical, Users } from 'lucide-react';

const statusBadge = {
  em_producao: { label: 'Em curso', style: { background: '#E0F0FF', color: '#1565C0' } },
  concluida:   { label: 'Concluído', style: { background: '#E0F5EA', color: '#1B5E20' } },
  aguardando:  { label: 'Pendente', style: { background: '#EDE7F6', color: '#4527A0' } },
};

// Determina o prazo/criticidade de uma etapa em andamento
function etapaCriticidade(etapa) {
  if (!etapa.dataFim) return { label: 'No prazo', style: { background: '#E0F5EA', color: '#1B5E20' } };
  const hoje = new Date();
  const fim = new Date(etapa.dataFim + 'T00:00:00');
  const diff = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Vencido', style: { background: '#FCE4EC', color: '#B71C1C' } };
  if (diff <= 5) return { label: `Prazo: ${diff}d`, style: { background: '#FFF8E1', color: '#E65100' } };
  return { label: 'No prazo', style: { background: '#E0F5EA', color: '#1B5E20' } };
}

export default function Dashboard({ onNavigate }) {
  const { aeronaves, funcionarios } = useApp();
  const { currentUser } = useAuth();

  const emProducao    = aeronaves.filter(a => a.status === 'em_producao').length;
  const etapasAndando = aeronaves.reduce((s, a) => s + a.etapas.filter(e => e.status === 'em_andamento').length, 0);
  const testesAprov   = aeronaves.reduce((s, a) => s + a.testes.filter(t => t.resultado === 'aprovado').length, 0);
  const funcAtivos    = funcionarios.filter(f => f.status === 'ativo').length;

  // Etapas críticas (em andamento ou vencidas) — até 3
  const etapasCriticas = aeronaves
    .flatMap(a => a.etapas
      .filter(e => e.status === 'em_andamento' || (e.dataFim && new Date(e.dataFim + 'T00:00:00') < new Date()))
      .map(e => ({ ...e, aeronave: a }))
    )
    .slice(0, 3);

  // Últimos testes — até 3
  const ultimosTestes = aeronaves
    .flatMap(a => a.testes.map(t => ({ ...t, aeronave: a })))
    .filter(t => t.resultado !== 'pendente')
    .slice(0, 3);

  const testeResBadge = {
    aprovado:  { label: 'Aprovado',  style: { background: '#E0F5EA', color: '#1B5E20' } },
    reprovado: { label: 'Reprovado', style: { background: '#FCE4EC', color: '#B71C1C' } },
    pendente:  { label: 'Pendente',  style: { background: '#FFF8E1', color: '#E65100' } },
  };

  const stats = [
    { label: 'Aeronaves cadastradas', value: aeronaves.length,  color: '#E8EAF6' },
    { label: 'Etapas em andamento',   value: etapasAndando,    color: '#FFF8E1' },
    { label: 'Testes aprovados (mês)', value: testesAprov,     color: '#E0F5EA' },
    { label: 'Funcionários ativos',   value: funcAtivos,       color: '#EDE7F6' },
  ];

  return (
    <div style={{ padding: '32px 32px 40px', maxWidth: 1100, fontFamily: 'var(--font-body)' }}>

      {/* ── Título ── */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        fontWeight: 800,
        color: 'var(--navy-800)',
        marginBottom: 24,
      }}>
        Dashboard
      </h1>

      {/* ── Stat cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 28,
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: '#fff',
            border: '1px solid var(--lavender-200)',
            borderRadius: 14,
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 6 }}>{s.label}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--navy-800)',
                lineHeight: 1,
              }}>{s.value}</div>
            </div>
            <div style={{
              width: 40, height: 40,
              borderRadius: 10,
              background: s.color,
              flexShrink: 0,
            }} />
          </div>
        ))}
      </div>

      {/* ── Linha principal ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* ── Aeronaves recentes ── */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--lavender-200)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy-800)' }}>
              Aeronaves recentes
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['CÓDIGO', 'MODELO', 'TIPO', 'ETAPAS', 'STATUS'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: 'var(--gray-500)',
                      borderBottom: '1px solid var(--lavender-200)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aeronaves.slice(0, 5).map((a, i) => {
                  const badge = statusBadge[a.status] || { label: a.status, style: {} };
                  const concluidas = a.etapas.filter(e => e.status === 'concluida').length;
                  const total      = a.etapas.length;
                  const tipo       = a.fabricante?.toLowerCase().includes('boeing') ||
                                     a.fabricante?.toLowerCase().includes('lockheed') ||
                                     a.modelo?.toLowerCase().includes('f-16') ? 'MILITAR' : 'COMERCIAL';
                  const codigo     = `AV-${String(i + 1).padStart(3, '0')}`;
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--lavender-200)' }}>
                      <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--gray-500)' }}>{codigo}</td>
                      <td style={{ padding: '13px 16px', fontWeight: 600, color: 'var(--navy-800)' }}>{a.modelo}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--gray-500)' }}>{tipo}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--gray-500)' }}>{concluidas}/{total}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 12px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          ...badge.style,
                        }}>{badge.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--lavender-200)' }}>
            <button
              onClick={() => onNavigate('aeronaves')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, color: 'var(--navy-700)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Ver todas as aeronaves →
            </button>
          </div>
        </div>

        {/* ── Coluna direita ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Etapas críticas */}
          <div style={{
            background: '#fff',
            border: '1px solid var(--lavender-200)',
            borderRadius: 14,
            padding: '18px 20px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--navy-800)',
              marginBottom: 14,
            }}>
              Etapas críticas
            </div>

            {etapasCriticas.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>Nenhuma etapa crítica.</p>
            ) : etapasCriticas.map(e => {
              const crit = etapaCriticidade(e);
              return (
                <div key={e.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--navy-800)', flex: 1, marginRight: 8 }}>
                    <span style={{ color: 'var(--gray-400)', marginRight: 4, fontSize: 12 }}>
                      AV-{String(aeronaves.findIndex(a => a.id === e.aeronave.id) + 1).padStart(3,'0')} ·
                    </span>
                    {e.nome}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    ...crit.style,
                  }}>{crit.label}</span>
                </div>
              );
            })}
          </div>

          {/* Últimos testes */}
          <div style={{
            background: '#fff',
            border: '1px solid var(--lavender-200)',
            borderRadius: 14,
            padding: '18px 20px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--navy-800)',
              marginBottom: 14,
            }}>
              Últimos testes
            </div>

            {ultimosTestes.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>Nenhum teste registrado.</p>
            ) : ultimosTestes.map(t => {
              const badge = testeResBadge[t.resultado] || testeResBadge.pendente;
              return (
                <div key={t.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--navy-800)', flex: 1, marginRight: 8 }}>
                    <span style={{ color: 'var(--gray-400)', marginRight: 4, fontSize: 12 }}>
                      AV-{String(aeronaves.findIndex(a => a.id === t.aeronave.id) + 1).padStart(3,'0')} ·
                    </span>
                    {t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    ...badge.style,
                  }}>{badge.label}</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}