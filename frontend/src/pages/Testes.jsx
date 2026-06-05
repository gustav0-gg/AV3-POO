import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/Modal';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const tipoOpts = [
  { value: 'eletrico',   label: 'Elétrico' },
  { value: 'hidraulico', label: 'Hidráulico' },
  { value: 'aerodinamico', label: 'Aerodinâmico' },
];

const resultadoOpts = [
  { value: 'aprovado',  label: 'Aprovado' },
  { value: 'reprovado', label: 'Reprovado' },
];

const resultadoBadge = {
  aprovado:  'badge-green',
  reprovado: 'badge-red',
};

const resultadoLabel = {
  aprovado:  'Aprovado',
  reprovado: 'Reprovado',
};

const tipoLabel = {
  eletrico:     'Elétrico',
  hidraulico:   'Hidráulico',
  aerodinamico: 'Aerodinâmico',
};

// ─── MODAL TESTE ──────────────────────────────────────────────────────────────
function TesteModal({ teste, aeronaves, aeronaveIdInicial, onClose, onSave }) {
  const isEdit = !!teste?.id;
  const [form, setForm] = useState({
    aeronaveId: teste ? (aeronaveIdInicial ?? '') : (aeronaveIdInicial ?? aeronaves[0]?.id ?? ''),
    tipo:       teste?.tipo      || '',
    resultado:  teste?.resultado || '',
    // mantém campos extras ao editar
    nome:           teste?.nome           || '',
    dataRealizacao: teste?.dataRealizacao || '',
    observacoes:    teste?.observacoes    || '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!isEdit && !form.aeronaveId) e.aeronaveId = 'Selecione a aeronave.';
    if (!form.tipo)      e.tipo      = 'Selecione o tipo.';
    if (!form.resultado) e.resultado = 'Selecione o resultado.';
    if (Object.keys(e).length) { setErrors(e); return; }
    // gera nome automático se não tiver (ex: "Teste Elétrico")
    const nomeAuto = form.nome.trim() || `Teste ${tipoLabel[form.tipo] || form.tipo}`;
    onSave({ ...form, nome: nomeAuto });
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid #E0E4F0',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    background: '#F4F5FF',
    color: '#1E2749',
    outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
  };

  const inputErrStyle = { ...inputStyle, border: '1.5px solid #DC2626' };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#1E2749',
    marginBottom: 7,
    display: 'block',
  };

  const errMsg = {
    fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block',
  };

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
            {isEdit ? 'Editar Teste' : 'Cadastrar Novo Teste'}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 12px' }}>

          {/* Linha 1 — Código da aeronave + Tipo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Código da aeronave</label>
              <select
                style={errors.aeronaveId ? inputErrStyle : inputStyle}
                value={form.aeronaveId ?? ''}
                onChange={e => set('aeronaveId', parseInt(e.target.value))}
                disabled={isEdit}
              >
                <option value="">Selecionar ▾</option>
                {aeronaves.map((a, i) => (
                  <option key={a.id} value={a.id}>
                    AV-{String(i + 1).padStart(3, '0')} — {a.modelo}
                  </option>
                ))}
              </select>
              {errors.aeronaveId && <span style={errMsg}>{errors.aeronaveId}</span>}
            </div>

            <div>
              <label style={labelStyle}>Tipo</label>
              <select
                style={errors.tipo ? inputErrStyle : inputStyle}
                value={form.tipo}
                onChange={e => set('tipo', e.target.value)}
              >
                <option value="">Selecionar ▾</option>
                {tipoOpts.map((t, i) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.tipo && <span style={errMsg}>{errors.tipo}</span>}
            </div>
          </div>

          {/* Linha 2 — Resultado (centralizado) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{ width: '50%' }}>
              <label style={{ ...labelStyle, textAlign: 'center' }}>Resultado</label>
              <select
                style={errors.resultado ? inputErrStyle : inputStyle}
                value={form.resultado}
                onChange={e => set('resultado', e.target.value)}
              >
                <option value="">Selecionar ▾</option>
                {resultadoOpts.filter(r => r.value !== 'pendente').map((r, i) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {errors.resultado && <span style={{ ...errMsg, textAlign: 'center' }}>{errors.resultado}</span>}
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
            {isEdit ? 'Salvar Alterações' : 'Cadastrar Teste'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Testes() {
  const { aeronaves, addTeste, updateTeste, deleteTeste } = useApp();

  const [aeronaveId, setAeronaveId]           = useState('all');
  const [search, setSearch]                   = useState('');
  const [filterResultado, setFilterResultado] = useState('all');
  const [modalOpen, setModalOpen]             = useState(false);
  const [editItem, setEditItem]               = useState(null);
  const [editAeronaveId, setEditAeronaveId]   = useState(null);
  const [deleteItem, setDeleteItem]           = useState(null);

  // Flatten todos os testes com referência à aeronave
  const todosTestes = aeronaves.flatMap((a, idx) =>
    a.testes.map(t => ({
      ...t,
      aeronave: a,
      codigoAv: `AV-${String(idx + 1).padStart(3, '0')}`,
    }))
  );

  const filtered = todosTestes.filter(t => {
    const matchAv        = aeronaveId === 'all' || t.aeronave.id === parseInt(aeronaveId);
    const matchResultado = filterResultado === 'all' || t.resultado === filterResultado;
    const matchSearch    =
      t.nome.toLowerCase().includes(search.toLowerCase()) ||
      (tipoLabel[t.tipo] || t.tipo || '').toLowerCase().includes(search.toLowerCase());
    return matchAv && matchResultado && matchSearch;
  });

  const aprovados  = todosTestes.filter(t => t.resultado === 'aprovado').length;
  const reprovados = todosTestes.filter(t => t.resultado === 'reprovado').length;

  const handleSave = (form) => {
    const { aeronaveId: avId, nome, tipo, resultado, dataRealizacao, observacoes } = form;
    const data = { nome, tipo, resultado, dataRealizacao, observacoes };
    if (editItem) {
      updateTeste(editAeronaveId, editItem.id, data);
    } else {
      addTeste(avId, data);
    }
    setModalOpen(false);
    setEditItem(null);
    setEditAeronaveId(null);
  };

  const openEdit = (t) => {
    setEditItem(t);
    setEditAeronaveId(t.aeronave.id);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditItem(null);
    setEditAeronaveId(null);
    setModalOpen(true);
  };

  return (
    <div className="page-wrapper">

      {/* ── Cabeçalho ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Testes</h1>
          <p className="page-subtitle">
            {todosTestes.length} teste(s) · {aprovados} aprovado(s) · {reprovados} reprovado(s)
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Registrar Teste
        </button>
      </div>

      {/* ── Filtros ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            placeholder="Buscar teste..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}
          value={aeronaveId}
          onChange={e => setAeronaveId(e.target.value)}
        >
          <option value="all">Todas as aeronaves</option>
          {aeronaves.map((a, i) => (
            <option key={a.id} value={a.id}>
              AV-{String(i + 1).padStart(3, '0')} — {a.modelo}
            </option>
          ))}
        </select>

        <button className={`chip${filterResultado === 'all' ? ' active' : ''}`}      onClick={() => setFilterResultado('all')}>Todos</button>
        <button className={`chip${filterResultado === 'aprovado' ? ' active' : ''}`} onClick={() => setFilterResultado('aprovado')}>Aprovados</button>
        <button className={`chip${filterResultado === 'reprovado' ? ' active' : ''}`}onClick={() => setFilterResultado('reprovado')}>Reprovados</button>
      </div>

      {/* ── Tabela ── */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Aeronave</th>
                <th>Tipo</th>
                <th>Resultado</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>
                    Nenhum teste encontrado.
                  </td>
                </tr>
              ) : filtered.map(t => (
                <tr key={`${t.aeronave.id}-${t.id}`}>
                  <td style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{t.nome}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--navy-700)', fontWeight: 600 }}>
                        {t.codigoAv}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.aeronave.modelo}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 13,
                      color: 'var(--gray-500)',
                      textTransform: 'capitalize',
                    }}>
                      {tipoLabel[t.tipo] || t.tipo}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${resultadoBadge[t.resultado] || 'badge-gray'}`}>
                      {resultadoLabel[t.resultado] || t.resultado}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                    {t.dataRealizacao
                      ? new Date(t.dataRealizacao + 'T00:00:00').toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(t)}>
                        <Pencil size={15} />
                      </button>
                      <button className="btn-icon danger" title="Excluir" onClick={() => setDeleteItem(t)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Cadastrar / Editar ── */}
      {modalOpen && (
        <TesteModal
          teste={editItem}
          aeronaves={aeronaves}
          aeronaveIdInicial={aeronaveId !== 'all' ? parseInt(aeronaveId) : aeronaves[0]?.id}
          onClose={() => { setModalOpen(false); setEditItem(null); setEditAeronaveId(null); }}
          onSave={handleSave}
        />
      )}

      {/* ── Confirmar Exclusão ── */}
      {deleteItem && (
        <ConfirmDialog
          title="Excluir Teste"
          message={`Tem certeza que deseja excluir "${deleteItem.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => { deleteTeste(deleteItem.aeronave.id, deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}