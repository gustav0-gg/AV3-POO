import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plane, Plus, Calendar } from 'lucide-react';

const etapaStatusMap = {
  concluida:    { badge: 'badge-green', label: 'Concluída',    cls: 'concluida' },
  em_andamento: { badge: 'badge-blue',  label: 'Em Andamento', cls: 'em_andamento' },
  pendente:     { badge: 'badge-gray',  label: 'Pendente',     cls: 'pendente' },
};

// ─── MODAL CADASTRAR ETAPA ────────────────────────────────────────────────────
function NovaEtapaModal({ aeronaves, funcionarios, onClose, onSave }) {
  const [form, setForm] = useState({
    aeronaveId:  aeronaves[0]?.id ?? '',
    nome:        '',
    prazo:       '',
    responsavel: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!form.aeronaveId)    e.aeronaveId  = 'Selecione a aeronave.';
    if (!form.nome.trim())   e.nome        = 'Informe o nome da etapa.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const inputStyle = (hasErr) => ({
    width: '100%',
    padding: '13px 16px',
    border: `1.5px solid ${hasErr ? '#DC2626' : '#E0E4F0'}`,
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    background: '#F4F5FF',
    color: '#1E2749',
    outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
  });

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#1E2749',
    marginBottom: 7,
    display: 'block',
  };

  const errStyle = { fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      fontFamily: 'var(--font-body, DM Sans, sans-serif)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        width: '100%',
        maxWidth: 720,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
      }}>
        {/* Header navy */}
        <div style={{ background: '#1E2749', padding: '22px 28px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>
            Cadastrar Nova Etapa de Produção
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 12px' }}>

          {/* Linha 1 — Código da aeronave + Nome da etapa */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Código da aeronave</label>
              <select
                style={inputStyle(!!errors.aeronaveId)}
                value={form.aeronaveId}
                onChange={e => set('aeronaveId', parseInt(e.target.value))}
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
              <label style={labelStyle}>Nome da etapa</label>
              <input
                style={inputStyle(!!errors.nome)}
                placeholder="Insira o nome da etapa"
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
              />
              {errors.nome && <span style={errStyle}>{errors.nome}</span>}
            </div>
          </div>

          {/* Linha 2 — Prazo + Funcionário responsável */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
            <div>
              <label style={labelStyle}>Prazo</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  style={{ ...inputStyle(false), paddingRight: 42 }}
                  value={form.prazo}
                  onChange={e => set('prazo', e.target.value)}
                  placeholder="Selecionar ▾"
                />
                <Calendar size={16} style={{
                  position: 'absolute', right: 13, top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF', pointerEvents: 'none',
                }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Funcionário responsável</label>
              <select
                style={inputStyle(false)}
                value={form.responsavel}
                onChange={e => set('responsavel', e.target.value)}
              >
                <option value="">Selecionar ▾</option>
                {funcionarios
                  .filter(f => f.status === 'ativo')
                  .map(f => (
                    <option key={f.id} value={f.nome}>{f.nome}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, padding: '12px 28px 24px',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '14px', border: '1.5px solid #E0E4F0', borderRadius: 12,
              background: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', color: '#374151',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '14px', border: 'none', borderRadius: 12,
              background: '#1E2749', color: '#fff', fontSize: 14,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Cadastrar Etapa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function EtapasProducao({ onViewAeronave }) {
  const { aeronaves, funcionarios, addEtapa } = useApp();
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen]     = useState(false);

  const aeronavesFiltradas = aeronaves.filter(a =>
    a.modelo.toLowerCase().includes(search.toLowerCase()) ||
    a.matricula.toLowerCase().includes(search.toLowerCase())
  );

  const allEtapas = aeronavesFiltradas.flatMap(a =>
    a.etapas
      .filter(e => filterStatus === 'all' || e.status === filterStatus)
      .map(e => ({ ...e, aeronave: a }))
  ).sort((a, b) => a.ordem - b.ordem);

  const totalConcluidas = allEtapas.filter(e => e.status === 'concluida').length;
  const totalAndamento  = allEtapas.filter(e => e.status === 'em_andamento').length;

  const handleSave = (form) => {
    const aeronave = aeronaves.find(a => a.id === form.aeronaveId);
    const proximaOrdem = aeronave ? aeronave.etapas.length + 1 : 1;

    addEtapa(form.aeronaveId, {
      nome:        form.nome,
      descricao:   '',
      status:      'pendente',
      responsavel: form.responsavel,
      dataInicio:  '',
      dataFim:     form.prazo,
      ordem:       proximaOrdem,
    });
    setModalOpen(false);
  };

  return (
    <div className="page-wrapper">

      {/* ── Cabeçalho ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Etapas de Produção</h1>
          <p className="page-subtitle">{totalConcluidas} concluídas · {totalAndamento} em andamento</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Nova Etapa
        </button>
      </div>

      {/* ── Filtros ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar aeronave..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`chip${filterStatus === 'all' ? ' active' : ''}`}          onClick={() => setFilterStatus('all')}>Todas</button>
        <button className={`chip${filterStatus === 'em_andamento' ? ' active' : ''}`} onClick={() => setFilterStatus('em_andamento')}>Em Andamento</button>
        <button className={`chip${filterStatus === 'pendente' ? ' active' : ''}`}     onClick={() => setFilterStatus('pendente')}>Pendentes</button>
        <button className={`chip${filterStatus === 'concluida' ? ' active' : ''}`}    onClick={() => setFilterStatus('concluida')}>Concluídas</button>
      </div>

      {/* ── Lista de aeronaves + etapas ── */}
      {aeronavesFiltradas.length === 0 ? (
        <div className="empty-state"><p>Nenhuma aeronave encontrada.</p></div>
      ) : (
        aeronavesFiltradas.map(aeronave => {
          const etapas = aeronave.etapas
            .filter(e => filterStatus === 'all' || e.status === filterStatus)
            .sort((a, b) => a.ordem - b.ordem);

          if (etapas.length === 0) return null;

          return (
            <div key={aeronave.id} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: 'var(--lavender-200)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plane size={16} color="var(--navy-700)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy-800)' }}>
                      {aeronave.modelo}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{aeronave.matricula} · {etapas.length} etapa(s)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress-bar" style={{ width: 100 }}>
                    <div className="progress-fill" style={{ width: `${aeronave.progresso}%` }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-700)' }}>{aeronave.progresso}%</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => onViewAeronave(aeronave.id)}>
                    Ver detalhes
                  </button>
                </div>
              </div>

              <div className="etapas-list">
                {etapas.map(e => {
                  const info = etapaStatusMap[e.status] || { badge: 'badge-gray', label: e.status, cls: 'pendente' };
                  return (
                    <div key={e.id} className="etapa-card">
                      <div className={`etapa-step ${info.cls}`}>{e.ordem}</div>
                      <div className="etapa-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div className="etapa-name">{e.nome}</div>
                            {e.descricao && <div className="etapa-desc">{e.descricao}</div>}
                            <div className="etapa-meta">
                              {e.responsavel && <span>👤 {e.responsavel}</span>}
                              {e.dataInicio && <span style={{ marginLeft: 12 }}>📅 {new Date(e.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                              {e.dataFim && <span style={{ marginLeft: 12 }}>→ {new Date(e.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                            </div>
                          </div>
                          <span className={`badge ${info.badge}`}>{info.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* ── Modal Nova Etapa ── */}
      {modalOpen && (
        <NovaEtapaModal
          aeronaves={aeronaves}
          funcionarios={funcionarios}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}