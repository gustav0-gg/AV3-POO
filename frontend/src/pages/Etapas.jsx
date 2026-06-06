import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/Modal';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

const statusOpts = [
  { value: 'PENDENTE',  label: 'Pendente' },
  { value: 'ANDAMENTO', label: 'Em Andamento' },
  { value: 'CONCLUIDA', label: 'Concluída' },
];
const statusBadge = { PENDENTE: 'badge-gray', ANDAMENTO: 'badge-blue', CONCLUIDA: 'badge-green' };
const statusLabel = { PENDENTE: 'Pendente', ANDAMENTO: 'Em Andamento', CONCLUIDA: 'Concluída' };

function EtapaModal({ etapa, aeronaves, funcionarios, aeronaveIdInicial, onClose, onSave }) {
  const isEdit = !!etapa?.id;
  const currentFuncIds = (etapa?.funcionarios || []).map(ef => ef.funcionario?.id || ef.funcionarioId);
  const [form, setForm] = useState({
    aeronaveId:    etapa ? (aeronaveIdInicial ?? '') : (aeronaveIdInicial ?? aeronaves[0]?.id ?? ''),
    nome:          etapa?.nome   || '',
    prazo:         etapa?.prazo  || '',
    status:        etapa?.status || 'PENDENTE',
    funcionarioIds: currentFuncIds,
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const toggleFunc = (fid) => {
    setForm(f => ({
      ...f,
      funcionarioIds: f.funcionarioIds.includes(fid)
        ? f.funcionarioIds.filter(id => id !== fid)
        : [...f.funcionarioIds, fid],
    }));
  };

  const handleSubmit = () => {
    const e = {};
    if (!isEdit && !form.aeronaveId) e.aeronaveId = 'Selecione a aeronave.';
    if (!form.nome.trim())           e.nome       = 'Informe o nome da etapa.';
    if (!form.prazo)                 e.prazo      = 'Informe o prazo.';
    if (!form.funcionarioIds.length) e.funcionarios = 'Associe ao menos um funcionário.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const inp = (hasErr) => ({ width: '100%', padding: '13px 16px', border: `1.5px solid ${hasErr ? '#DC2626' : '#E0E4F0'}`, borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: '#F4F5FF', color: '#1E2749', outline: 'none', boxSizing: 'border-box', appearance: 'none' });
  const lbl = { fontSize: 13, fontWeight: 600, color: '#1E2749', marginBottom: 7, display: 'block' };
  const err = { fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'var(--font-body)' }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 680, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
        <div style={{ background: '#1E2749', padding: '22px 28px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>{isEdit ? 'Editar Etapa' : 'Nova Etapa'}</h2>
        </div>
        <div style={{ padding: '28px 28px 12px' }}>
          {!isEdit && (
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Aeronave *</label>
              <select style={inp(!!errors.aeronaveId)} value={form.aeronaveId ?? ''}
                onChange={e => set('aeronaveId', parseInt(e.target.value))}>
                <option value="">Selecionar ▾</option>
                {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
              </select>
              {errors.aeronaveId && <span style={err}>{errors.aeronaveId}</span>}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Nome da Etapa *</label>
            <input style={inp(!!errors.nome)} value={form.nome}
              onChange={e => set('nome', e.target.value)} placeholder="Ex: Montagem da Estrutura" />
            {errors.nome && <span style={err}>{errors.nome}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Prazo *</label>
              <input type="date" style={inp(!!errors.prazo)} value={form.prazo}
                onChange={e => set('prazo', e.target.value)} />
              {errors.prazo && <span style={err}>{errors.prazo}</span>}
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select style={inp(false)} value={form.status} onChange={e => set('status', e.target.value)}>
                {statusOpts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={lbl}>Funcionários responsáveis *</label>
            <div style={{ border: '1.5px solid #E0E4F0', borderRadius: 10, padding: '10px 14px', background: '#F4F5FF', maxHeight: 160, overflowY: 'auto' }}>
              {funcionarios.length === 0
                ? <span style={{ fontSize: 13, color: '#9CA3AF' }}>Nenhum funcionário cadastrado.</span>
                : funcionarios.map(f => (
                  <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" checked={form.funcionarioIds.includes(f.id)}
                      onChange={() => toggleFunc(f.id)} />
                    [{f.id}] {f.nome} — {f.nivelPermissao}
                  </label>
                ))}
            </div>
            {errors.funcionarios && <span style={err}>{errors.funcionarios}</span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 28px 24px' }}>
          <button onClick={onClose} style={{ padding: '14px', border: '1.5px solid #E0E4F0', borderRadius: 12, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>Cancelar</button>
          <button onClick={handleSubmit} style={{ padding: '14px', border: 'none', borderRadius: 12, background: '#1E2749', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{isEdit ? 'Salvar Alterações' : 'Criar Etapa'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Etapas() {
  const { aeronaves, funcionarios, addEtapa, updateEtapa, deleteEtapa } = useApp();
  const [aeronaveId, setAeronaveId]   = useState('all');
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editItem, setEditItem]       = useState(null);
  const [editAeronaveId, setEditAeronaveId] = useState(null);
  const [deleteItem, setDeleteItem]   = useState(null);

  const todasEtapas = aeronaves.flatMap(a =>
    a.etapas.map(e => ({ ...e, aeronave: a }))
  );

  const filtered = todasEtapas.filter(e => {
    const matchAv     = aeronaveId === 'all' || e.aeronave.id === parseInt(aeronaveId);
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase());
    return matchAv && matchStatus && matchSearch;
  });

  const handleSave = (form) => {
    const { aeronaveId: avId, nome, prazo, status, funcionarioIds } = form;
    const data = { nome, prazo, status, funcionarioIds };
    if (editItem) updateEtapa(editAeronaveId, editItem.id, data);
    else addEtapa(avId, data);
    setModalOpen(false);
    setEditItem(null);
    setEditAeronaveId(null);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Etapas de Produção</h1>
          <p className="page-subtitle">{todasEtapas.length} etapa(s) em {aeronaves.length} aeronave(s)</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setEditAeronaveId(null); setModalOpen(true); }}>
          <Plus size={16} /> Nova Etapa
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}
          value={aeronaveId} onChange={e => setAeronaveId(e.target.value)}>
          <option value="all">Todas as aeronaves</option>
          {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
        </select>
        <button className={`chip${filterStatus === 'all' ? ' active' : ''}`} onClick={() => setFilterStatus('all')}>Todas</button>
        {statusOpts.map(s => (
          <button key={s.value} className={`chip${filterStatus === s.value ? ' active' : ''}`} onClick={() => setFilterStatus(s.value)}>{s.label}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nome</th><th>Aeronave</th><th>Prazo</th><th>Funcionários</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>Nenhuma etapa encontrada.</td></tr>
                : filtered.map(e => {
                  const funcs = (e.funcionarios || []).map(ef => ef.funcionario?.nome).filter(Boolean);
                  return (
                    <tr key={`${e.aeronave.id}-${e.id}`}>
                      <td style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{e.nome}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--navy-700)', fontWeight: 600 }}>{e.aeronave.codigo}</span>
                          <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{e.aeronave.modelo}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{e.prazo || '—'}</td>
                      <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                        {funcs.length ? funcs.join(', ') : <span style={{ color: 'var(--gray-400)' }}>—</span>}
                      </td>
                      <td><span className={`badge ${statusBadge[e.status] || 'badge-gray'}`}>{statusLabel[e.status] || e.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-icon" onClick={() => { setEditItem(e); setEditAeronaveId(e.aeronave.id); setModalOpen(true); }}><Pencil size={15} /></button>
                          <button className="btn-icon danger" onClick={() => setDeleteItem(e)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <EtapaModal etapa={editItem} aeronaves={aeronaves} funcionarios={funcionarios}
          aeronaveIdInicial={aeronaveId !== 'all' ? parseInt(aeronaveId) : aeronaves[0]?.id}
          onClose={() => { setModalOpen(false); setEditItem(null); setEditAeronaveId(null); }}
          onSave={handleSave} />
      )}
      {deleteItem && (
        <ConfirmDialog title="Excluir Etapa"
          message={`Tem certeza que deseja excluir a etapa "${deleteItem.nome}"?`}
          onConfirm={() => { deleteEtapa(deleteItem.aeronave.id, deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)} />
      )}
    </div>
  );
}
