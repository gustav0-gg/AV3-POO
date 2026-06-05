import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, ConfirmDialog } from '../components/Modal';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const statusOpts = [
  { value: 'pronta',        label: 'Pronta' },
  { value: 'em_transporte', label: 'Em Transporte' },
  { value: 'em_producao',   label: 'Em Produção' },
];

const statusBadge = {
  pronta:        'badge-green',
  em_transporte: 'badge-blue',
  em_producao:   'badge-amber',
};

const statusLabel = {
  pronta:      'Pronta',
  em_transporte: 'Em Transporte',
  em_producao:   'Em Produção',
};

const tipoOpts = [
  { value: 'importada', label: 'Importada' },
  { value: 'nacional',  label: 'Nacional' },
];

const tipoBadge = {
  importada: 'badge-blue',
  nacional:  'badge-gray',
};

// ─── MODAL PEÇA ───────────────────────────────────────────────────────────────
function PecaModal({ peca, aeronaves, aeronaveIdInicial, onClose, onSave }) {
  const isEdit = !!peca?.id;
  const [form, setForm] = useState({
    aeronaveId: peca ? null : (aeronaveIdInicial ?? aeronaves[0]?.id ?? ''),
    nome:       peca?.nome       || '',
    tipo:       peca?.tipo       || '',
    fornecedor: peca?.fornecedor || '',
    status:     peca?.status     || 'pendente',
    numero:     peca?.numero     || '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome da peça.';
    if (!isEdit && !form.aeronaveId) e.aeronaveId = 'Selecione a aeronave.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal
      title={isEdit ? 'Editar Peça' : 'Adicionar Nova Peça'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? 'Salvar Alterações' : 'Cadastrar Peça'}
          </button>
        </>
      }
    >
      {!isEdit && (
        <div className="form-group">
          <label className="form-label">Aeronave *</label>
          <select
            className={`form-select${errors.aeronaveId ? ' input-error' : ''}`}
            value={form.aeronaveId ?? ''}
            onChange={e => set('aeronaveId', parseInt(e.target.value))}
          >
            <option value="">Selecionar aeronave...</option>
            {aeronaves.map((a, i) => (
              <option key={a.id} value={a.id}>
                AV-{String(i + 1).padStart(3, '0')} — {a.modelo}
              </option>
            ))}
          </select>
          {errors.aeronaveId && <span className="form-error">{errors.aeronaveId}</span>}
        </div>
      )}

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Nome da Peça *</label>
          <input
            className={`form-input${errors.nome ? ' input-error' : ''}`}
            value={form.nome}
            onChange={e => set('nome', e.target.value)}
            placeholder="Ex: Motor CFM56"
          />
          {errors.nome && <span className="form-error">{errors.nome}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Número / Código</label>
          <input
            className="form-input"
            value={form.numero}
            onChange={e => set('numero', e.target.value.toUpperCase())}
            placeholder="ENG-001"
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            <option value="">Selecionar...</option>
            {tipoOpts.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="form-group">
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Fornecedor</label>
          <input
            className="form-input"
            value={form.fornecedor}
            onChange={e => set('fornecedor', e.target.value)}
            placeholder="Nome do fornecedor"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {statusOpts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Pecas() {
  const { aeronaves, addPeca, updatePeca, deletePeca } = useApp();

  const [aeronaveId, setAeronaveId]     = useState('all');
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen]       = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [editAeronaveId, setEditAeronaveId] = useState(null);
  const [deleteItem, setDeleteItem]     = useState(null);

  // Flatten todas as peças com referência à aeronave
  const todasPecas = aeronaves.flatMap((a, idx) =>
    a.pecas.map(p => ({
      ...p,
      aeronave: a,
      codigoAv: `AV-${String(idx + 1).padStart(3, '0')}`,
    }))
  );

  const filtered = todasPecas.filter(p => {
    const matchAv     = aeronaveId === 'all' || p.aeronave.id === parseInt(aeronaveId);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchSearch =
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      (p.fornecedor || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.numero || '').toLowerCase().includes(search.toLowerCase());
    return matchAv && matchStatus && matchSearch;
  });

  const handleSave = (form) => {
    const { aeronaveId: avId, nome, tipo, fornecedor, status, numero} = form;
    const data = {
      nome, tipo, fornecedor, status,
      numero: numero || nome.slice(0, 6).toUpperCase().replace(/\s/g, '-'),
    };
    if (editItem) {
      updatePeca(editAeronaveId, editItem.id, data);
    } else {
      addPeca(avId, data);
    }
    setModalOpen(false);
    setEditItem(null);
    setEditAeronaveId(null);
  };

  const openEdit = (p) => {
    setEditItem(p);
    setEditAeronaveId(p.aeronave.id);
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
          <h1 className="page-title">Peças</h1>
          <p className="page-subtitle">
            {todasPecas.length} peça(s) em {aeronaves.length} aeronave(s)
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nova Peça
        </button>
      </div>

      {/* ── Filtros ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            placeholder="Buscar peça..."
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

        <button className={`chip${filterStatus === 'pronta' ? ' active' : ''}`} onClick={() => setFilterStatus('pronta')}>Pronta</button>
        <button className={`chip${filterStatus === 'em_transporte' ? ' active' : ''}`} onClick={() => setFilterStatus('em_transporte')}>Em Transporte</button>
        <button className={`chip${filterStatus === 'em_producao' ? ' active' : ''}`} onClick={() => setFilterStatus('em_producao')}>Em produção</button>
      </div>

      {/* ── Tabela ── */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Peça</th>
                <th>Aeronave</th>
                <th>Tipo</th>
                <th>Nº / Código</th>
                <th>Fornecedor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>
                    Nenhuma peça encontrada.
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={`${p.aeronave.id}-${p.id}`}>
                  <td style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{p.nome}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--navy-700)', fontWeight: 600 }}>
                        {p.codigoAv}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{p.aeronave.modelo}</span>
                    </div>
                  </td>
                  <td>
                    {p.tipo ? (
                      <span className={`badge ${tipoBadge[p.tipo] || 'badge-gray'}`}>
                        {p.tipo === 'importada' ? 'Importada' : 'Nacional'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--gray-400)', fontSize: 13 }}>—</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.numero || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{p.fornecedor || '—'}</td>
                  <td>
                    <span className={`badge ${statusBadge[p.status] || 'badge-gray'}`}>
                      {statusLabel[p.status] || p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(p)}>
                        <Pencil size={15} />
                      </button>
                      <button className="btn-icon danger" title="Excluir" onClick={() => setDeleteItem(p)}>
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
        <PecaModal
          peca={editItem}
          aeronaves={aeronaves}
          aeronaveIdInicial={aeronaveId !== 'all' ? parseInt(aeronaveId) : aeronaves[0]?.id}
          onClose={() => { setModalOpen(false); setEditItem(null); setEditAeronaveId(null); }}
          onSave={handleSave}
        />
      )}

      {/* ── Confirmar Exclusão ── */}
      {deleteItem && (
        <ConfirmDialog
          title="Excluir Peça"
          message={`Tem certeza que deseja excluir "${deleteItem.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => { deletePeca(deleteItem.aeronave.id, deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}