import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, ConfirmDialog } from '../components/Modal';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';

const statusOpts = [
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'em_producao', label: 'Em Produção' },
  { value: 'concluida', label: 'Concluída' },
];

const statusBadge = {
  em_producao: 'badge-blue',
  concluida: 'badge-green',
  aguardando: 'badge-amber',
};

const statusLabel = {
  em_producao: 'Em Produção',
  concluida: 'Concluída',
  aguardando: 'Aguardando',
};

function AeronaveModal({ aeronave, onClose, onSave }) {
  const isEdit = !!aeronave?.id;
  const [form, setForm] = useState({
    modelo: aeronave?.modelo || '',
    matricula: aeronave?.matricula || '',
    fabricante: aeronave?.fabricante || '',
    anoFabricacao: aeronave?.anoFabricacao || new Date().getFullYear(),
    status: aeronave?.status || 'aguardando',
    progresso: aeronave?.progresso || 0,
    responsavel: aeronave?.responsavel?.nome || aeronave?.responsavel || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.modelo.trim()) e.modelo = 'Informe o modelo.';
    if (!form.matricula.trim()) e.matricula = 'Informe a matrícula.';
    if (!form.fabricante.trim()) e.fabricante = 'Informe o fabricante.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  return (
    <Modal
      title={isEdit ? 'Editar Aeronave' : 'Cadastrar Aeronave'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </>
      }
    >
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Modelo *</label>
          <input className={`form-input${errors.modelo ? ' input-error' : ''}`} value={form.modelo}
            onChange={e => set('modelo', e.target.value)} placeholder="Ex: Embraer E175" />
          {errors.modelo && <span className="form-error">{errors.modelo}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Matrícula *</label>
          <input className={`form-input${errors.matricula ? ' input-error' : ''}`} value={form.matricula}
            onChange={e => set('matricula', e.target.value.toUpperCase())} placeholder="Ex: PR-AER" />
          {errors.matricula && <span className="form-error">{errors.matricula}</span>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Fabricante *</label>
          <input className={`form-input${errors.fabricante ? ' input-error' : ''}`} value={form.fabricante}
            onChange={e => set('fabricante', e.target.value)} placeholder="Ex: Embraer" />
          {errors.fabricante && <span className="form-error">{errors.fabricante}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Ano de Fabricação</label>
          <input className="form-input" type="number" value={form.anoFabricacao}
            onChange={e => set('anoFabricacao', parseInt(e.target.value))} min="1900" max="2100" />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {statusOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Progresso (%)</label>
          <input className="form-input" type="number" value={form.progresso}
            onChange={e => set('progresso', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} min="0" max="100" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Responsável</label>
        <input className="form-input" value={form.responsavel}
          onChange={e => set('responsavel', e.target.value)} placeholder="Nome do responsável" />
      </div>
    </Modal>
  );
}

export default function Aeronaves({ onViewDetail }) {
  const { aeronaves, addAeronave, updateAeronave, deleteAeronave } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = aeronaves.filter(a => {
    const matchSearch = a.modelo.toLowerCase().includes(search.toLowerCase()) ||
      a.matricula.toLowerCase().includes(search.toLowerCase()) ||
      a.fabricante.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = (data) => {
    if (editItem?.id) {
      updateAeronave(editItem.id, data);
    } else {
      addAeronave(data);
    }
    setModalOpen(false);
    setEditItem(null);
  };

  const openEdit = (a) => { setEditItem(a); setModalOpen(true); };
  const openNew = () => { setEditItem(null); setModalOpen(true); };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Aeronaves</h1>
          <p className="page-subtitle">{aeronaves.length} aeronave(s) cadastrada(s)</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nova Aeronave
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar aeronave..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`chip${filterStatus === 'all' ? ' active' : ''}`} onClick={() => setFilterStatus('all')}>Todas</button>
        {statusOpts.map(o => (
          <button key={o.value} className={`chip${filterStatus === o.value ? ' active' : ''}`}
            onClick={() => setFilterStatus(o.value)}>{o.label}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Matrícula</th>
                <th>Fabricante</th>
                <th>Ano</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>
                    Nenhuma aeronave encontrada.
                  </td>
                </tr>
              ) : filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{a.modelo}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{a.matricula}</td>
                  <td>{a.fabricante}</td>
                  <td>{a.anoFabricacao}</td>
                  <td>
                    <span className={`badge ${statusBadge[a.status] || 'badge-gray'}`}>
                      {statusLabel[a.status] || a.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 70 }}>
                        <div className="progress-fill" style={{ width: `${a.progresso}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.progresso}%</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{a.responsavel?.nome || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" title="Ver detalhes" onClick={() => onViewDetail(a.id)}>
                        <Eye size={15} />
                      </button>
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(a)}>
                        <Pencil size={15} />
                      </button>
                      <button className="btn-icon danger" title="Excluir" onClick={() => setDeleteItem(a)}>
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

      {modalOpen && (
        <AeronaveModal
          aeronave={editItem}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {deleteItem && (
        <ConfirmDialog
          title="Excluir Aeronave"
          message={`Tem certeza que deseja excluir a aeronave "${deleteItem.modelo} (${deleteItem.matricula})"? Esta ação não pode ser desfeita.`}
          onConfirm={() => { deleteAeronave(deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}