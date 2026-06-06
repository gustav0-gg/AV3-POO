import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, ConfirmDialog } from '../components/Modal';
import { ArrowLeft, Plus, Pencil, Trash2, Package, FlaskConical, ListOrdered } from 'lucide-react';

// ─── STATUS MAPS ──────────────────────────────────────────────────────────────
const pecaStatusMap = {
  EM_PRODUCAO:  { badge: 'badge-amber', label: 'Em Produção' },
  EM_TRANSPORTE:{ badge: 'badge-blue',  label: 'Em Transporte' },
  PRONTA:       { badge: 'badge-green', label: 'Pronta' },
};

const testeResMap = {
  APROVADO:  { badge: 'badge-green', label: 'Aprovado' },
  REPROVADO: { badge: 'badge-red',   label: 'Reprovado' },
};

const etapaStatusMap = {
  CONCLUIDA: { badge: 'badge-green', label: 'Concluída',   cls: 'concluida' },
  ANDAMENTO: { badge: 'badge-blue',  label: 'Em Andamento',cls: 'em_andamento' },
  PENDENTE:  { badge: 'badge-gray',  label: 'Pendente',    cls: 'pendente' },
};

const tipoTesteLabel = { ELETRICO: 'Elétrico', HIDRAULICO: 'Hidráulico', AERODINAMICO: 'Aerodinâmico' };
const tipoPecaLabel  = { NACIONAL: 'Nacional', IMPORTADA: 'Importada' };

// ─── PEÇA MODAL ──────────────────────────────────────────────────────────────
function PecaModal({ peca, onClose, onSave }) {
  const isEdit = !!peca?.id;
  const [form, setForm] = useState({
    nome:      peca?.nome      || '',
    tipo:      peca?.tipo      || 'NACIONAL',
    fornecedor:peca?.fornecedor|| '',
    status:    peca?.status    || 'EM_PRODUCAO',
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!form.nome.trim())      e.nome      = 'Informe o nome.';
    if (!form.fornecedor.trim()) e.fornecedor = 'Informe o fornecedor.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal title={isEdit ? 'Editar Peça' : 'Cadastrar Peça'} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? 'Salvar' : 'Cadastrar'}</button></>}>
      <div className="form-group">
        <label className="form-label">Nome da Peça *</label>
        <input className={`form-input${errors.nome ? ' input-error' : ''}`} value={form.nome}
          onChange={e => set('nome', e.target.value)} placeholder="Ex: Motor CFM56-7B" />
        {errors.nome && <span className="form-error">{errors.nome}</span>}
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            <option value="NACIONAL">Nacional</option>
            <option value="IMPORTADA">Importada</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {Object.entries(pecaStatusMap).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Fornecedor *</label>
        <input className={`form-input${errors.fornecedor ? ' input-error' : ''}`} value={form.fornecedor}
          onChange={e => set('fornecedor', e.target.value)} placeholder="Nome do fornecedor" />
        {errors.fornecedor && <span className="form-error">{errors.fornecedor}</span>}
      </div>
    </Modal>
  );
}

// ─── TESTE MODAL ─────────────────────────────────────────────────────────────
function TesteModal({ teste, onClose, onSave }) {
  const isEdit = !!teste?.id;
  const [form, setForm] = useState({
    tipo:      teste?.tipo      || 'ELETRICO',
    resultado: teste?.resultado || 'APROVADO',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title={isEdit ? 'Editar Teste' : 'Registrar Teste'} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={() => onSave(form)}>{isEdit ? 'Salvar' : 'Registrar'}</button></>}>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            <option value="ELETRICO">Elétrico</option>
            <option value="HIDRAULICO">Hidráulico</option>
            <option value="AERODINAMICO">Aerodinâmico</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Resultado</label>
          <select className="form-select" value={form.resultado} onChange={e => set('resultado', e.target.value)}>
            <option value="APROVADO">Aprovado</option>
            <option value="REPROVADO">Reprovado</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ─── ETAPA MODAL ─────────────────────────────────────────────────────────────
function EtapaModal({ etapa, funcionarios, onClose, onSave }) {
  const isEdit = !!etapa?.id;
  const currentFuncIds = (etapa?.funcionarios || []).map(ef => ef.funcionario?.id || ef.funcionarioId);
  const [form, setForm] = useState({
    nome:            etapa?.nome   || '',
    prazo:           etapa?.prazo  || '',
    status:          etapa?.status || 'PENDENTE',
    funcionarioIds:  currentFuncIds,
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
    if (!form.nome.trim())  e.nome  = 'Informe o nome da etapa.';
    if (!form.prazo)        e.prazo = 'Informe o prazo.';
    if (!form.funcionarioIds.length) e.funcionarios = 'Associe ao menos um funcionário.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal title={isEdit ? 'Editar Etapa' : 'Nova Etapa'} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? 'Salvar' : 'Criar'}</button></>}>
      <div className="form-group">
        <label className="form-label">Nome da Etapa *</label>
        <input className={`form-input${errors.nome ? ' input-error' : ''}`} value={form.nome}
          onChange={e => set('nome', e.target.value)} placeholder="Ex: Montagem da Estrutura" />
        {errors.nome && <span className="form-error">{errors.nome}</span>}
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Prazo *</label>
          <input className={`form-input${errors.prazo ? ' input-error' : ''}`} type="date" value={form.prazo}
            onChange={e => set('prazo', e.target.value)} />
          {errors.prazo && <span className="form-error">{errors.prazo}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="PENDENTE">Pendente</option>
            <option value="ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDA">Concluída</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Funcionários responsáveis *</label>
        <div style={{ border: '1.5px solid #E0E4F0', borderRadius: 10, padding: '10px 14px', background: '#F4F5FF', maxHeight: 160, overflowY: 'auto' }}>
          {funcionarios.length === 0
            ? <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>Nenhum funcionário cadastrado.</span>
            : funcionarios.map(f => (
                <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.funcionarioIds.includes(f.id)}
                    onChange={() => toggleFunc(f.id)} />
                  [{f.id}] {f.nome} — {f.nivelPermissao}
                </label>
              ))
          }
        </div>
        {errors.funcionarios && <span className="form-error">{errors.funcionarios}</span>}
      </div>
    </Modal>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AeronaveDetalhe({ aeronaveId, onBack }) {
  const { aeronaves, funcionarios,
    addPeca, updatePeca, deletePeca,
    addTeste, updateTeste, deleteTeste,
    addEtapa, updateEtapa, deleteEtapa } = useApp();

  const aeronave = aeronaves.find(a => a.id === aeronaveId);
  const [tab, setTab]           = useState('pecas');
  const [modal, setModal]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!aeronave) return <div className="page-wrapper"><p>Aeronave não encontrada.</p></div>;

  const closeModal = () => setModal(null);

  const handleSavePeca  = (data) => { modal.item?.id ? updatePeca(aeronaveId, modal.item.id, data) : addPeca(aeronaveId, data); closeModal(); };
  const handleSaveTeste = (data) => { modal.item?.id ? updateTeste(aeronaveId, modal.item.id, data) : addTeste(aeronaveId, data); closeModal(); };
  const handleSaveEtapa = (data) => { modal.item?.id ? updateEtapa(aeronaveId, modal.item.id, data) : addEtapa(aeronaveId, data); closeModal(); };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === 'peca')  deletePeca(aeronaveId, item.id);
    if (type === 'teste') deleteTeste(aeronaveId, item.id);
    if (type === 'etapa') deleteEtapa(aeronaveId, item.id);
    setDeleteTarget(null);
  };

  const tipoLabel = { COMERCIAL: 'Comercial', MILITAR: 'Militar' };

  return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> Voltar para Aeronaves</button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--navy-800)' }}>{aeronave.modelo}</h1>
              <span className="badge badge-blue">{tipoLabel[aeronave.tipo] || aeronave.tipo}</span>
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 14, color: 'var(--gray-500)', flexWrap: 'wrap' }}>
              <span><strong>Código:</strong> {aeronave.codigo}</span>
              <span><strong>Capacidade:</strong> {aeronave.capacidade} pax</span>
              <span><strong>Alcance:</strong> {aeronave.alcance} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn${tab === 'pecas' ? ' active' : ''}`} onClick={() => setTab('pecas')}>
          <Package size={14} style={{ display: 'inline', marginRight: 6 }} />Peças ({aeronave.pecas.length})
        </button>
        <button className={`tab-btn${tab === 'testes' ? ' active' : ''}`} onClick={() => setTab('testes')}>
          <FlaskConical size={14} style={{ display: 'inline', marginRight: 6 }} />Testes ({aeronave.testes.length})
        </button>
        <button className={`tab-btn${tab === 'etapas' ? ' active' : ''}`} onClick={() => setTab('etapas')}>
          <ListOrdered size={14} style={{ display: 'inline', marginRight: 6 }} />Etapas ({aeronave.etapas.length})
        </button>
      </div>

      {/* PEÇAS */}
      {tab === 'pecas' && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Peças e Componentes</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'peca', item: null })}><Plus size={15} /> Nova Peça</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nome</th><th>Tipo</th><th>Fornecedor</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {aeronave.pecas.length === 0
                  ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>Nenhuma peça cadastrada.</td></tr>
                  : aeronave.pecas.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.nome}</td>
                      <td><span className="badge badge-gray">{tipoPecaLabel[p.tipo] || p.tipo}</span></td>
                      <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{p.fornecedor}</td>
                      <td><span className={`badge ${pecaStatusMap[p.status]?.badge || 'badge-gray'}`}>{pecaStatusMap[p.status]?.label || p.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-icon" onClick={() => setModal({ type: 'peca', item: p })}><Pencil size={14} /></button>
                          <button className="btn-icon danger" onClick={() => setDeleteTarget({ type: 'peca', item: p })}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TESTES */}
      {tab === 'testes' && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Testes Realizados</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'teste', item: null })}><Plus size={15} /> Novo Teste</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tipo</th><th>Resultado</th><th>Ações</th></tr></thead>
              <tbody>
                {aeronave.testes.length === 0
                  ? <tr><td colSpan="3" style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>Nenhum teste registrado.</td></tr>
                  : aeronave.testes.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{tipoTesteLabel[t.tipo] || t.tipo}</td>
                      <td><span className={`badge ${testeResMap[t.resultado]?.badge || 'badge-gray'}`}>{testeResMap[t.resultado]?.label || t.resultado}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-icon" onClick={() => setModal({ type: 'teste', item: t })}><Pencil size={14} /></button>
                          <button className="btn-icon danger" onClick={() => setDeleteTarget({ type: 'teste', item: t })}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ETAPAS */}
      {tab === 'etapas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'etapa', item: null })}><Plus size={15} /> Nova Etapa</button>
          </div>
          {aeronave.etapas.length === 0
            ? <div className="empty-state"><p>Nenhuma etapa cadastrada.</p></div>
            : (
              <div className="etapas-list">
                {[...aeronave.etapas].map((e, idx) => {
                  const info = etapaStatusMap[e.status] || { badge: 'badge-gray', label: e.status, cls: 'pendente' };
                  const funcs = (e.funcionarios || []).map(ef => ef.funcionario?.nome).filter(Boolean);
                  return (
                    <div key={e.id} className="etapa-card">
                      <div className={`etapa-step ${info.cls}`}>{idx + 1}</div>
                      <div className="etapa-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div className="etapa-name">{e.nome}</div>
                            <div className="etapa-meta">
                              {e.prazo && <span>📅 Prazo: {e.prazo}</span>}
                              {funcs.length > 0 && <span style={{ marginLeft: 12 }}>👤 {funcs.join(', ')}</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className={`badge ${info.badge}`}>{info.label}</span>
                            <button className="btn-icon" onClick={() => setModal({ type: 'etapa', item: e })}><Pencil size={14} /></button>
                            <button className="btn-icon danger" onClick={() => setDeleteTarget({ type: 'etapa', item: e })}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      )}

      {/* MODALS */}
      {modal?.type === 'peca'  && <PecaModal  peca={modal.item}  onClose={closeModal} onSave={handleSavePeca} />}
      {modal?.type === 'teste' && <TesteModal teste={modal.item} onClose={closeModal} onSave={handleSaveTeste} />}
      {modal?.type === 'etapa' && <EtapaModal etapa={modal.item} funcionarios={funcionarios} onClose={closeModal} onSave={handleSaveEtapa} />}

      {deleteTarget && (
        <ConfirmDialog
          title={`Excluir ${deleteTarget.type === 'peca' ? 'Peça' : deleteTarget.type === 'teste' ? 'Teste' : 'Etapa'}`}
          message={`Tem certeza que deseja excluir "${deleteTarget.item.nome || tipoTesteLabel[deleteTarget.item.tipo]}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
