import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, ConfirmDialog } from '../components/Modal';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';

const tipoOpts = [
  { value: 'COMERCIAL', label: 'Comercial' },
  { value: 'MILITAR',   label: 'Militar' },
];

const tipoBadge = { COMERCIAL: 'badge-blue', MILITAR: 'badge-amber' };
const tipoLabel = { COMERCIAL: 'Comercial', MILITAR: 'Militar' };

function AeronaveModal({ aeronave, onClose, onSave }) {
  const isEdit = !!aeronave?.id;
  const [form, setForm] = useState({
    codigo:    aeronave?.codigo    || '',
    modelo:    aeronave?.modelo    || '',
    tipo:      aeronave?.tipo      || 'COMERCIAL',
    capacidade: aeronave?.capacidade || '',
    alcance:   aeronave?.alcance   || '',
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!isEdit && !form.codigo.trim()) e.codigo = 'Informe o código.';
    if (!form.modelo.trim())  e.modelo  = 'Informe o modelo.';
    if (!form.capacidade)     e.capacidade = 'Informe a capacidade.';
    if (!form.alcance)        e.alcance = 'Informe o alcance.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal title={isEdit ? 'Editar Aeronave' : 'Cadastrar Aeronave'} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? 'Salvar Alterações' : 'Cadastrar'}</button></>}>

      {!isEdit && (
        <div className="form-group">
          <label className="form-label">Código *</label>
          <input className={`form-input${errors.codigo ? ' input-error' : ''}`} value={form.codigo}
            onChange={e => set('codigo', e.target.value)} placeholder="Ex: E175-001" />
          {errors.codigo && <span className="form-error">{errors.codigo}</span>}
        </div>
      )}

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Modelo *</label>
          <input className={`form-input${errors.modelo ? ' input-error' : ''}`} value={form.modelo}
            onChange={e => set('modelo', e.target.value)} placeholder="Ex: Embraer E175" />
          {errors.modelo && <span className="form-error">{errors.modelo}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            {tipoOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Capacidade (passageiros) *</label>
          <input className={`form-input${errors.capacidade ? ' input-error' : ''}`} type="number" value={form.capacidade}
            onChange={e => set('capacidade', e.target.value)} placeholder="Ex: 180" min="1" />
          {errors.capacidade && <span className="form-error">{errors.capacidade}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Alcance (km) *</label>
          <input className={`form-input${errors.alcance ? ' input-error' : ''}`} type="number" value={form.alcance}
            onChange={e => set('alcance', e.target.value)} placeholder="Ex: 5000" min="1" />
          {errors.alcance && <span className="form-error">{errors.alcance}</span>}
        </div>
      </div>
    </Modal>
  );
}

export default function Aeronaves({ onViewDetail }) {
  const { aeronaves, addAeronave, updateAeronave, deleteAeronave } = useApp();
  const [search, setSearch]       = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = aeronaves.filter(a => {
    const matchSearch = a.modelo.toLowerCase().includes(search.toLowerCase()) ||
      a.codigo.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === 'all' || a.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  const handleSave = (data) => {
    if (editItem?.id) updateAeronave(editItem.id, data);
    else addAeronave(data);
    setModalOpen(false);
    setEditItem(null);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Aeronaves</h1>
          <p className="page-subtitle">{aeronaves.length} aeronave(s) cadastrada(s)</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <Plus size={16} /> Nova Aeronave
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar por código ou modelo..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`chip${filterTipo === 'all' ? ' active' : ''}`} onClick={() => setFilterTipo('all')}>Todas</button>
        <button className={`chip${filterTipo === 'COMERCIAL' ? ' active' : ''}`} onClick={() => setFilterTipo('COMERCIAL')}>Comercial</button>
        <button className={`chip${filterTipo === 'MILITAR' ? ' active' : ''}`} onClick={() => setFilterTipo('MILITAR')}>Militar</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th><th>Modelo</th><th>Tipo</th>
                <th>Capacidade</th><th>Alcance</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>Nenhuma aeronave encontrada.</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: 'var(--navy-700)' }}>{a.codigo}</td>
                  <td style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{a.modelo}</td>
                  <td><span className={`badge ${tipoBadge[a.tipo] || 'badge-gray'}`}>{tipoLabel[a.tipo] || a.tipo}</span></td>
                  <td>{a.capacidade} pax</td>
                  <td>{a.alcance} km</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" title="Ver detalhes" onClick={() => onViewDetail(a.id)}><Eye size={15} /></button>
                      <button className="btn-icon" title="Editar" onClick={() => { setEditItem(a); setModalOpen(true); }}><Pencil size={15} /></button>
                      <button className="btn-icon danger" title="Excluir" onClick={() => setDeleteItem(a)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <AeronaveModal aeronave={editItem}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSave={handleSave} />
      )}
      {deleteItem && (
        <ConfirmDialog title="Excluir Aeronave"
          message={`Tem certeza que deseja excluir a aeronave "${deleteItem.modelo} (${deleteItem.codigo})"?`}
          onConfirm={() => { deleteAeronave(deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)} />
      )}
    </div>
  );
}
