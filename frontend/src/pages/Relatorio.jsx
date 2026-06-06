import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar } from 'lucide-react';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const pecaStatusLabel = {
  PRONTA:        'Pronta',
  EM_PRODUCAO:   'Em Produção',
  EM_TRANSPORTE: 'Em Transporte',
};

const tipoTesteLabel = {
  ELETRICO:     'Elétrico',
  HIDRAULICO:   'Hidráulico',
  AERODINAMICO: 'Aerodinâmico',
};

function gerarTextoRelatorio(aeronave, idx, cliente, dataEntrega) {
  const codigo = `AV-${String(idx + 1).padStart(3, '0')}`;

  const etapasConcluidas = aeronave.etapas.filter(e =>
    e.status?.toUpperCase() === 'CONCLUIDA'
  ).length;
  const totalEtapas = aeronave.etapas.length;

  const testesAprov  = aeronave.testes.filter(t => t.resultado?.toUpperCase() === 'APROVADO').length;
  const testesReprov = aeronave.testes.filter(t => t.resultado?.toUpperCase() === 'REPROVADO').length;

  const dots = (label, val, width = 55) => {
    const dotCount = width - label.length - val.length;
    return `${label} ${'.'.repeat(Math.max(2, dotCount))} ${val}`;
  };

  const statusEtapaLabel = (s) => {
    const up = s?.toUpperCase();
    if (up === 'CONCLUIDA') return 'Concluída';
    if (up === 'ANDAMENTO') return 'Em Andamento';
    return 'Pendente';
  };

  let txt = '';
  txt += '='.repeat(60) + '\n';
  txt += '  AEROCODE — Relatório Final de Produção\n';
  txt += '='.repeat(60) + '\n\n';

  txt += `Aeronave : ${codigo} — ${aeronave.modelo} (${aeronave.tipo})\n`;
  if (cliente)     txt += `Cliente  : ${cliente}\n`;
  if (dataEntrega) txt += `Entrega  : ${dataEntrega}\n`;
  txt += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

  txt += '-'.repeat(60) + '\n';
  txt += `ETAPAS DE PRODUÇÃO (${etapasConcluidas}/${totalEtapas})\n`;
  txt += '-'.repeat(60) + '\n';

  if (aeronave.etapas.length === 0) {
    txt += 'Nenhuma etapa cadastrada.\n';
  } else {
    aeronave.etapas.forEach((e, i) => {
      txt += dots(`${i + 1}. ${e.nome}`, statusEtapaLabel(e.status)) + '\n';
      if (e.prazo) txt += `   Prazo: ${e.prazo}\n`;
    });
  }

  txt += '\n';
  txt += '-'.repeat(60) + '\n';
  txt += 'TESTES DETALHADOS\n';
  txt += '-'.repeat(60) + '\n';

  if (aeronave.testes.length === 0) {
    txt += 'Nenhum teste registrado.\n';
  } else {
    aeronave.testes.forEach(t => {
      const res  = t.resultado?.toUpperCase() === 'APROVADO' ? 'Aprovado' : 'Reprovado';
      const tipo = tipoTesteLabel[t.tipo?.toUpperCase()] || t.tipo || '—';
      txt += dots(`• ${tipo}`, res) + '\n';
    });
  }

  txt += `\nResumo: ${testesAprov} aprovado(s) | ${testesReprov} reprovado(s)\n`;

  txt += '\n';
  txt += '-'.repeat(60) + '\n';
  txt += 'PEÇAS E COMPONENTES\n';
  txt += '-'.repeat(60) + '\n';

  if (aeronave.pecas.length === 0) {
    txt += 'Nenhuma peça cadastrada.\n';
  } else {
    aeronave.pecas.forEach(p => {
      const status = pecaStatusLabel[p.status?.toUpperCase()] || p.status || '—';
      txt += dots(`• ${p.nome}`, status) + '\n';
      if (p.fornecedor) txt += `  Fornecedor: ${p.fornecedor}\n`;
    });
  }

  txt += '\n' + '='.repeat(60) + '\n';
  txt += '  Relatório gerado automaticamente pelo sistema AEROCODE\n';
  txt += '='.repeat(60) + '\n';

  return txt;
}

// ─── COMPONENTE PRÉVIA ────────────────────────────────────────────────────────
function PreviewRelatorio({ aeronave, idx, cliente, dataEntrega }) {
  if (!aeronave) return null;

  const codigo = `AV-${String(idx + 1).padStart(3, '0')}`;

  const etapasConcluidas = aeronave.etapas.filter(e =>
    e.status?.toUpperCase() === 'CONCLUIDA'
  ).length;
  const totalEtapas  = aeronave.etapas.length;
  const testesAprov  = aeronave.testes.filter(t => t.resultado?.toUpperCase() === 'APROVADO').length;
  const testesReprov = aeronave.testes.filter(t => t.resultado?.toUpperCase() === 'REPROVADO').length;

  const statusEtapaLabel = (s) => {
    const up = s?.toUpperCase();
    if (up === 'CONCLUIDA') return 'Concluída';
    if (up === 'ANDAMENTO') return 'Em Andamento';
    return 'Pendente';
  };

  const pecasResumo = aeronave.pecas
    .slice(0, 3)
    .map(p => `${p.nome} (${pecaStatusLabel[p.status] || p.status})`)
    .join(', ');
  const maisStr = aeronave.pecas.length > 3 ? ` +${aeronave.pecas.length - 3} mais` : '';

  return (
    <div style={{
      border: '1.5px solid #E0E4F0',
      borderRadius: 12,
      padding: '20px 22px',
      background: '#FAFAFF',
      marginTop: 4,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#9BAAD6', marginBottom: 14 }}>
        PRÉVIA DO RELATÓRIO
      </div>

      <div style={{ fontWeight: 800, fontSize: 15, color: '#1E2749', marginBottom: 6 }}>
        AEROCODE — Relatório Final de Produção
      </div>

      <div style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>
        Aeronave: {codigo} | {aeronave.modelo} | {aeronave.tipo}
        {aeronave.pecas.length > 0 && ` | ${aeronave.pecas.length} peças`}
      </div>
      <div style={{ fontSize: 13, color: '#374151', marginBottom: 12 }}>
        {cliente && `Cliente: ${cliente}`}
        {cliente && dataEntrega && ' | '}
        {dataEntrega && `Entrega: ${dataEntrega}`}
      </div>

      <div style={{ fontWeight: 700, fontSize: 13, color: '#1E2749', marginBottom: 6 }}>
        Etapas de produção ({etapasConcluidas}/{totalEtapas})
      </div>

      {aeronave.etapas.slice(0, 4).map((e, i) => (
        <div key={e.id} style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>
          {i + 1}. {e.nome}
          <span style={{ color: '#9CA3AF' }}>
            {' '}{'·'.repeat(Math.max(2, 36 - (e.nome?.length || 0)))}
          </span>
          {' '}{statusEtapaLabel(e.status)}
        </div>
      ))}
      {aeronave.etapas.length > 4 && (
        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>
          + {aeronave.etapas.length - 4} etapa(s) no arquivo completo
        </div>
      )}

      <div style={{ fontSize: 13, color: '#374151', marginTop: 8 }}>
        Testes aprovados: {testesAprov} | Reprovados: {testesReprov}
      </div>
      {aeronave.pecas.length > 0 && (
        <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>
          Peças: {pecasResumo}{maisStr}
        </div>
      )}

      <div style={{ marginTop: 14, fontSize: 12, color: '#9BAAD6' }}>
        ↓ Relatório completo disponível no arquivo .txt gerado
      </div>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Relatorio() {
  const { aeronaves } = useApp();

  const [aeronaveId, setAeronaveId] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [cliente, setCliente] = useState('');
  const [errors, setErrors] = useState({});

  const aeronaveIdx = aeronaves.findIndex(a => a.id === parseInt(aeronaveId));
  const aeronaveSel = aeronaveIdx >= 0 ? aeronaves[aeronaveIdx] : null;

  const handleLimpar = () => {
    setAeronaveId('');
    setDataEntrega('');
    setCliente('');
    setErrors({});
  };

  const handleGerar = () => {
    const e = {};
    if (!aeronaveId)     e.aeronaveId  = 'Selecione a aeronave.';
    if (!dataEntrega)    e.dataEntrega = 'Informe a data de entrega.';
    if (!cliente.trim()) e.cliente     = 'Informe o nome do cliente.';
    if (Object.keys(e).length) { setErrors(e); return; }

    const texto    = gerarTextoRelatorio(aeronaveSel, aeronaveIdx, cliente, dataEntrega);
    const codigo   = `AV-${String(aeronaveIdx + 1).padStart(3, '0')}`;
    const filename = `relatorio_${codigo}_${Date.now()}.txt`;

    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = (hasErr) => ({
    width: '100%',
    padding: '13px 16px',
    border: `1.5px solid ${hasErr ? '#DC2626' : '#E0E4F0'}`,
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    background: '#fff',
    color: '#1E2749',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  });

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#1E2749',
    marginBottom: 7,
    display: 'block',
  };

  const errStyle = {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
    display: 'block',
  };

  return (
    <div style={{ padding: '32px', maxWidth: 860, fontFamily: 'var(--font-body, DM Sans, sans-serif)' }}>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        fontWeight: 800,
        color: 'var(--navy-800, #1E2749)',
        marginBottom: 8,
      }}>
        Gerar Relatório Final
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
        Preencha os dados abaixo para gerar o relatório de produção da aeronave.
      </p>

      {/* Linha 1: Aeronave + Data */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Aeronave *</label>
          <select
            style={{ ...inputStyle(!!errors.aeronaveId), appearance: 'none' }}
            value={aeronaveId}
            onChange={e => { setAeronaveId(e.target.value); setErrors(v => ({ ...v, aeronaveId: '' })); }}
          >
            <option value="">Selecionar ▾</option>
            {aeronaves.map((a, i) => (
              <option key={a.id} value={a.id}>
                AV-{String(i + 1).padStart(3, '0')} — {a.modelo}
              </option>
            ))}
          </select>
          {errors.aeronaveId && <span style={errStyle}>{errors.aeronaveId}</span>}
        </div>

        <div>
          <label style={labelStyle}>Data de entrega *</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inputStyle(!!errors.dataEntrega), paddingRight: 42 }}
              type="date"
              value={dataEntrega}
              onChange={e => { setDataEntrega(e.target.value); setErrors(v => ({ ...v, dataEntrega: '' })); }}
            />
            <Calendar size={16} style={{
              position: 'absolute', right: 13, top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF', pointerEvents: 'none',
            }} />
          </div>
          {errors.dataEntrega && <span style={errStyle}>{errors.dataEntrega}</span>}
        </div>
      </div>

      {/* Linha 2: Cliente */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Nome do cliente *</label>
        <input
          style={inputStyle(!!errors.cliente)}
          placeholder="Ex: LATAM Airlines"
          value={cliente}
          onChange={e => { setCliente(e.target.value); setErrors(v => ({ ...v, cliente: '' })); }}
        />
        {errors.cliente && <span style={errStyle}>{errors.cliente}</span>}
      </div>

      {/* Prévia */}
      {aeronaveSel && (
        <PreviewRelatorio
          aeronave={aeronaveSel}
          idx={aeronaveIdx}
          cliente={cliente}
          dataEntrega={dataEntrega}
        />
      )}

      {/* Botões */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginTop: aeronaveSel ? 24 : 16,
        maxWidth: 560,
      }}>
        <button
          onClick={handleLimpar}
          style={{
            padding: '14px',
            border: '1.5px solid #E0E4F0',
            borderRadius: 12,
            background: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            color: '#374151',
          }}
        >
          Limpar
        </button>
        <button
          onClick={handleGerar}
          style={{
            padding: '14px',
            border: 'none',
            borderRadius: 12,
            background: '#1E2749',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Gerar e baixar relatório
        </button>
      </div>
    </div>
  );
}