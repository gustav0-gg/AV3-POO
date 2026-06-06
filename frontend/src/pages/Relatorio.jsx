import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar } from 'lucide-react';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const statusLabel = {
  em_producao: 'Em Produção',
  concluida:   'Concluída',
  aguardando:  'Aguardando',
};

const pecaStatusLabel = {
  aprovado:  'Pronta',
  pronta:    'Pronta',
  em_teste:  'Em Teste',
  pendente:  'Pendente',
  reprovado: 'Reprovada',
  em_producao: 'Em Produção',
  em_transporte: 'Em Transporte',
};

const tipoLabel = {
  motor: 'Motor', pressao: 'Pressurização', eletrico: 'Elétrico',
  estrutural: 'Estrutural', voo: 'Voo', hidraulico: 'Hidráulico', aerodinamico: 'Aerodinâmico',
};

function pad(n) { return String(n).padStart(4, '0'); }

// ─── GERA TEXTO DO RELATÓRIO ──────────────────────────────────────────────────
function gerarTextoRelatorio(aeronave, idx, cliente, dataEntrega) {
  const codigo = `AV-${String(idx + 1).padStart(3, '0')}`;
  const tipo   = aeronave.tipo === "MILITAR" ||
                 aeronave.modelo?.toLowerCase().includes('f-16') ? 'MILITAR' : 'COMERCIAL';

  const etapasConcluidas = aeronave.etapas.filter(e => e.status === 'concluida').length;
  const totalEtapas      = aeronave.etapas.length;
  const testesAprov      = aeronave.testes.filter(t => t.resultado === 'aprovado').length;
  const testesReprov     = aeronave.testes.filter(t => t.resultado === 'reprovado').length;

  const dots = (label, val, width = 45) => {
    const dotCount = width - label.length - val.length;
    return `${label} ${'.'.repeat(Math.max(2, dotCount))} ${val}`;
  };

  let txt = '';
  txt += '='.repeat(60) + '\n';
  txt += '  AEROCODE — Relatório Final de Produção\n';
  txt += '='.repeat(60) + '\n\n';

  txt += `Aeronave: ${codigo} | ${aeronave.modelo} | ${tipo}\n`;
  if (cliente)     txt += `Cliente: ${cliente}\n`;
  if (dataEntrega) txt += `Data de entrega: ${dataEntrega}\n`;
  txt += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

  txt += '-'.repeat(60) + '\n';
  txt += `ETAPAS DE PRODUÇÃO (${etapasConcluidas}/${totalEtapas})\n`;
  txt += '-'.repeat(60) + '\n';
  [...aeronave.etapas].sort((a, b) => a.ordem - b.ordem).forEach((e, i) => {
    const status = e.status === 'concluida' ? 'Concluída' : e.status === 'em_andamento' ? 'Em Andamento' : 'Pendente';
    txt += dots(`${i + 1}. ${e.nome}`, status) + '\n';
  });

  txt += '\n';
  txt += `Testes aprovados: ${testesAprov} | Reprovados: ${testesReprov}\n`;

  if (aeronave.pecas.length > 0) {
    const pecasResumo = aeronave.pecas
      .slice(0, 4)
      .map(p => `${p.nome} (${pecaStatusLabel[p.status] || p.status})`)
      .join(', ');
    const mais = aeronave.pecas.length > 4 ? `... +${aeronave.pecas.length - 4} mais` : '';
    txt += `Peças: ${pecasResumo}${mais}\n`;
  }

  txt += '\n';
  txt += '-'.repeat(60) + '\n';
  txt += 'TESTES DETALHADOS\n';
  txt += '-'.repeat(60) + '\n';
  if (aeronave.testes.length === 0) {
    txt += 'Nenhum teste registrado.\n';
  } else {
    aeronave.testes.forEach(t => {
      const res = t.resultado === 'aprovado' ? 'Aprovado' : t.resultado === 'reprovado' ? 'Reprovado' : 'Pendente';
      const data = 
      txt += dots(`${t.nome} (${tipoLabel[t.tipo] || t.tipo})`, `${res} — ${data}`) + '\n';
      
    });
  }

  txt += '\n';
  txt += '-'.repeat(60) + '\n';
  txt += 'PEÇAS E COMPONENTES\n';
  txt += '-'.repeat(60) + '\n';
  if (aeronave.pecas.length === 0) {
    txt += 'Nenhuma peça cadastrada.\n';
  } else {
    aeronave.pecas.forEach(p => {
      const status = pecaStatusLabel[p.status] || p.status;
      txt += dots(`${p.nome} [${p.fornecedor}`, status) + '\n';
      if (p.fornecedor) txt += `   Fornecedor: ${p.fornecedor}\n`;
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
  const tipo   = aeronave.tipo === "MILITAR" ||
                 aeronave.modelo?.toLowerCase().includes('f-16') ? 'MILITAR' : 'COMERCIAL';

  const etapasConcluidas = aeronave.etapas.filter(e => e.status === 'concluida').length;
  const totalEtapas      = aeronave.etapas.length;
  const testesAprov      = aeronave.testes.filter(t => t.resultado === 'aprovado').length;
  const testesReprov     = aeronave.testes.filter(t => t.resultado === 'reprovado').length;

  const nomeArquivo = `relatorio_${codigo}_${Date.now()}.txt`;
  const pecasResumo = aeronave.pecas.slice(0, 3).map(p => `${p.nome} (${pecaStatusLabel[p.status] || p.status})`).join(', ');
  const maisStr     = aeronave.pecas.length > 3 ? `...` : '';

  return (
    <div style={{
      border: '1.5px solid #E0E4F0',
      borderRadius: 12,
      padding: '20px 22px',
      background: '#FAFAFF',
      marginTop: 4,
    }}>
      {/* Tag PRÉVIA */}
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        color: '#9BAAD6', marginBottom: 14,
      }}>
        PRÉVIA DO RELATÓRIO
      </div>

      {/* Título */}
      <div style={{ fontWeight: 800, fontSize: 15, color: '#1E2749', marginBottom: 6 }}>
        AEROCODE — Relatório Final de Produção
      </div>

      {/* Meta */}
      <div style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>
        Aeronave: {codigo} | {aeronave.modelo} | {tipo}
        {aeronave.pecas.length > 0 && ` | ${aeronave.pecas.length} peças`}
      </div>
      <div style={{ fontSize: 13, color: '#374151', marginBottom: 12 }}>
        {cliente && `Cliente: ${cliente}`}
        {cliente && dataEntrega && ' | '}
        {dataEntrega && `Data de entrega: ${dataEntrega}`}
      </div>

      {/* Etapas */}
      <div style={{ fontWeight: 700, fontSize: 13, color: '#1E2749', marginBottom: 6 }}>
        Etapas de produção ({etapasConcluidas}/{totalEtapas})
      </div>
      {[...aeronave.etapas].sort((a, b) => a.ordem - b.ordem).slice(0, 4).map((e, i) => {
        const s = e.status === 'concluida' ? 'Concluída' : e.status === 'em_andamento' ? 'Em Andamento' : 'Pendente';
        return (
          <div key={e.id} style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>
            {i + 1}. {e.nome}
            <span style={{ color: '#9CA3AF' }}>
              {' '}{'·'.repeat(Math.max(2, 38 - e.nome.length))}
            </span>
            {' '}{s}
          </div>
        );
      })}
      {aeronave.etapas.length > 4 && (
        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>
          + {aeronave.etapas.length - 4} etapa(s) no arquivo completo
        </div>
      )}

      {/* Testes + Peças resumo */}
      <div style={{ fontSize: 13, color: '#374151', marginTop: 8 }}>
        Testes aprovados: {testesAprov} | Reprovados: {testesReprov}
      </div>
      {aeronave.pecas.length > 0 && (
        <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>
          Peças: {pecasResumo}{maisStr}
        </div>
      )}

      {/* Link do arquivo */}
      <div style={{ marginTop: 14, fontSize: 12, color: '#9BAAD6' }}>
        ↓ Relatório completo disponível no arquivo .txt gerado
      </div>
      <div style={{ fontSize: 12, color: '#9BAAD6' }}>
        {nomeArquivo}
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

  const aeronaveIdx     = aeronaves.findIndex(a => a.id === parseInt(aeronaveId));
  const aeronaveSel     = aeronaveIdx >= 0 ? aeronaves[aeronaveIdx] : null;

  const mostrarPrevia = aeronaveSel !== null;

  const handleLimpar = () => {
    setAeronaveId('');
    setDataEntrega('');
    setCliente('');
    setErrors({});
  };

  const handleGerar = () => {
    const e = {};
    if (!aeronaveId)        e.aeronaveId  = 'Selecione a aeronave.';
    if (!dataEntrega)       e.dataEntrega = 'Informe a data de entrega.';
    if (!cliente.trim())    e.cliente     = 'Informe o nome do cliente.';
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
    <div style={{
      padding: '32px',
      maxWidth: 860,
      fontFamily: 'var(--font-body, DM Sans, sans-serif)',
    }}>

      {/* ── Título ── */}
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

      {/* ── Linha 1: Aeronave + Data de entrega ── */}
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
              placeholder="2025-12-31"
            />
            <Calendar
              size={16}
              style={{
                position: 'absolute', right: 13, top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF', pointerEvents: 'none',
              }}
            />
          </div>
          {errors.dataEntrega && <span style={errStyle}>{errors.dataEntrega}</span>}
        </div>
      </div>

      {/* ── Linha 2: Nome do cliente ── */}
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

      {/* ── Prévia do relatório ── */}
      {mostrarPrevia && (
        <PreviewRelatorio
          aeronave={aeronaveSel}
          idx={aeronaveIdx}
          cliente={cliente}
          dataEntrega={dataEntrega}
        />
      )}

      {/* ── Botões ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginTop: mostrarPrevia ? 24 : 16,
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