import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, ConfirmDialog } from '../components/Modal';
import { ArrowLeft, Plus, Pencil, Trash2, CheckCircle, XCircle, Clock, Package, FlaskConical, ListOrdered } from 'lucide-react';

// ─── STATUS HELPERS ────────────────────────────────────────────────────────
const pecaStatusMap = {
  aprovado: { badge: 'badge-green', label: 'Aprovado' },
  em_teste: { badge: 'badge-blue', label: 'Em Teste' },
  pendente: { badge: 'badge-amber', label: 'Pendente' },
  reprovado: { badge: 'badge-red', label: 'Reprovado' },
};

const testeResMap = {
  aprovado: { badge: 'badge-green', label: 'Aprovado', icon: CheckCircle },
  reprovado: { badge: 'badge-red', label: 'Reprovado', icon: XCircle },
  pendente: { badge: 'badge-amber', label: 'Pendente', icon: Clock },
};

const etapaStatusMap = {
  concluida: { badge: 'badge-green', label: 'Concluída', cls: 'concluida' },
  em_andamento: { badge: 'badge-blue', label: 'Em Andamento', cls: 'em_andamento' },
  pendente: { badge: 'badge-gray', label: 'Pendente', cls: 'pendente' },
};

// ─── PEÇA MODAL ─────────────────────────────────────────────────────────────
function PecaModal({ peca, onClose, onSave }) {
  const isEdit = !!peca?.id;
  const [form, setForm] = useState({
    nome: peca?.nome || '',
    numero: peca?.numero || '',
    quantidade: peca?.quantidade || 1,
    status: peca?.status || 'pendente',
    fornecedor: peca?.fornecedor || '',
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome.';
    if (!form.numero.trim()) e.numero = 'Informe o número.';
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
          <label className="form-label">Número / Código *</label>
          <input className={`form-input${errors.numero ? ' input-error' : ''}`} value={form.numero}
            onChange={e => set('numero', e.target.value.toUpperCase())} placeholder="ENG-001" />
          {errors.numero && <span className="form-error">{errors.numero}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Quantidade</label>
          <input className="form-input" type="number" value={form.quantidade} min="1"
            onChange={e => set('quantidade', parseInt(e.target.value) || 1)} />
        </div>
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {Object.entries(pecaStatusMap).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Fornecedor</label>
          <input className="form-input" value={form.fornecedor}
            onChange={e => set('fornecedor', e.target.value)} placeholder="Nome do fornecedor" />
        </div>
      </div>
    </Modal>
  );
}

// ─── TESTE MODAL ─────────────────────────────────────────────────────────────
function TesteModal({ teste, onClose, onSave }) {
  const isEdit = !!teste?.id;
  const [form, setForm] = useState({
    nome: teste?.nome || '',
    tipo: teste?.tipo || 'motor',
    resultado: teste?.resultado || 'pendente',
    dataRealizacao: teste?.dataRealizacao || '',
    responsavel: teste?.responsavel || '',
    observacoes: teste?.observacoes || '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title={isEdit ? 'Editar Teste' : 'Registrar Teste'} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={() => onSave(form)}>{isEdit ? 'Salvar' : 'Registrar'}</button></>}>
      <div className="form-group">
        <label className="form-label">Nome do Teste *</label>
        <input className="form-input" value={form.nome}
          onChange={e => set('nome', e.target.value)} placeholder="Ex: Teste de Pressurização" />
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            <option value="motor">Motor</option>
            <option value="pressao">Pressurização</option>
            <option value="eletrico">Elétrico</option>
            <option value="estrutural">Estrutural</option>
            <option value="voo">Voo</option>
            <option value="hidraulico">Hidráulico</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Resultado</label>
          <select className="form-select" value={form.resultado} onChange={e => set('resultado', e.target.value)}>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="reprovado">Reprovado</option>
          </select>
        </div>
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Data de Realização</label>
          <input className="form-input" type="date" value={form.dataRealizacao}
            onChange={e => set('dataRealizacao', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Responsável</label>
          <input className="form-input" value={form.responsavel}
            onChange={e => set('responsavel', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Observações</label>
        <textarea className="form-textarea" value={form.observacoes}
          onChange={e => set('observacoes', e.target.value)} placeholder="Observações e detalhes do teste..." />
      </div>
    </Modal>
  );
}

// ─── ETAPA MODAL ─────────────────────────────────────────────────────────────
function EtapaModal({ etapa, onClose, onSave }) {
  const isEdit = !!etapa?.id;
  const [form, setForm] = useState({
    nome: etapa?.nome || '',
    descricao: etapa?.descricao || '',
    status: etapa?.status || 'pendente',
    dataInicio: etapa?.dataInicio || '',
    dataFim: etapa?.dataFim || '',
    responsavel: etapa?.responsavel || '',
    ordem: etapa?.ordem || 1,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title={isEdit ? 'Editar Etapa' : 'Nova Etapa'} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={() => onSave(form)}>{isEdit ? 'Salvar' : 'Criar'}</button></>}>
      <div className="form-group">
        <label className="form-label">Nome da Etapa *</label>
        <input className="form-input" value={form.nome}
          onChange={e => set('nome', e.target.value)} placeholder="Ex: Montagem da Estrutura" />
      </div>
      <div className="form-group">
        <label className="form-label">Descrição</label>
        <textarea className="form-textarea" value={form.descricao}
          onChange={e => set('descricao', e.target.value)} />
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Ordem</label>
          <input className="form-input" type="number" value={form.ordem} min="1"
            onChange={e => set('ordem', parseInt(e.target.value) || 1)} />
        </div>
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Data de Início</label>
          <input className="form-input" type="date" value={form.dataInicio}
            onChange={e => set('dataInicio', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Data de Conclusão</label>
          <input className="form-input" type="date" value={form.dataFim}
            onChange={e => set('dataFim', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Responsável</label>
        <input className="form-input" value={form.responsavel}
          onChange={e => set('responsavel', e.target.value)} />
      </div>
    </Modal>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AeronaveDetalhe({ aeronaveId, onBack }) {
  const { aeronaves, updateAeronave,
    addPeca, updatePeca, deletePeca,
    addTeste, updateTeste, deleteTeste,
    addEtapa, updateEtapa, deleteEtapa } = useApp();

  const aeronave = aeronaves.find(a => a.id === aeronaveId);
  const [tab, setTab] = useState('pecas');
  const [modal, setModal] = useState(null); // { type, item }
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, item }

  if (!aeronave) return <div className="page-wrapper"><p>Aeronave não encontrada.</p></div>;

  const closeModal = () => setModal(null);

  const handleSavePeca = (data) => {
    if (modal.item?.id) updatePeca(aeronaveId, modal.item.id, data);
    else addPeca(aeronaveId, data);
    closeModal();
  };

  const handleSaveTeste = (data) => {
    if (modal.item?.id) updateTeste(aeronaveId, modal.item.id, data);
    else addTeste(aeronaveId, data);
    closeModal();
  };

  const handleSaveEtapa = (data) => {
    if (modal.item?.id) updateEtapa(aeronaveId, modal.item.id, data);
    else addEtapa(aeronaveId, data);
    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === 'peca') deletePeca(aeronaveId, item.id);
    if (type === 'teste') deleteTeste(aeronaveId, item.id);
    if (type === 'etapa') deleteEtapa(aeronaveId, item.id);
    setDeleteTarget(null);
  };

  const statusInfo = {
    em_producao: { badge: 'badge-blue', label: 'Em Produção' },
    concluida: { badge: 'badge-green', label: 'Concluída' },
    aguardando: { badge: 'badge-amber', label: 'Aguardando' },
  }[aeronave.status] || { badge: 'badge-gray', label: aeronave.status };

  const etapasSorted = [...aeronave.etapas].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Voltar para Aeronaves
      </button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--navy-800)' }}>
                {aeronave.modelo}
              </h1>
              <span className={`badge ${statusInfo.badge}`}>{statusInfo.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 14, color: 'var(--gray-500)', flexWrap: 'wrap' }}>
              <span><strong>Matrícula:</strong> {aeronave.matricula}</span>
              <span><strong>Fabricante:</strong> {aeronave.fabricante}</span>
              <span><strong>Ano:</strong> {aeronave.anoFabricacao}</span>
              {aeronave.responsavel && <span><strong>Responsável:</strong> {aeronave.responsavel?.nome || aeronave.responsavel}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Progresso geral</span>
            <div className="progress-bar" style={{ width: 120 }}>
              <div className="progress-fill" style={{ width: `${aeronave.progresso}%` }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--navy-800)' }}>
              {aeronave.progresso}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn${tab === 'pecas' ? ' active' : ''}`} onClick={() => setTab('pecas')}>
          <Package size={14} style={{ display: 'inline', marginRight: 6 }} />
          Peças ({aeronave.pecas.length})
        </button>
        <button className={`tab-btn${tab === 'testes' ? ' active' : ''}`} onClick={() => setTab('testes')}>
          <FlaskConical size={14} style={{ display: 'inline', marginRight: 6 }} />
          Testes ({aeronave.testes.length})
        </button>
        <button className={`tab-btn${tab === 'etapas' ? ' active' : ''}`} onClick={() => setTab('etapas')}>
          <ListOrdered size={14} style={{ display: 'inline', marginRight: 6 }} />
          Etapas ({aeronave.etapas.length})
        </button>
      </div>

      {/* ─── PEÇAS ─── */}
      {tab === 'pecas' && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Peças e Componentes</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'peca', item: null })}>
              <Plus size={15} /> Nova Peça
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>Nº / Código</th><th>Qtd</th><th>Fornecedor</th><th>Status</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {aeronave.pecas.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>Nenhuma peça cadastrada.</td></tr>
                ) : aeronave.pecas.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.nome}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.numero}</td>
                    <td>{p.quantidade}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{p.fornecedor || '—'}</td>
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

      {/* ─── TESTES ─── */}
      {tab === 'testes' && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Testes Realizados</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'teste', item: null })}>
              <Plus size={15} /> Novo Teste
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>Tipo</th><th>Resultado</th><th>Data</th><th>Responsável</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {aeronave.testes.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>Nenhum teste registrado.</td></tr>
                ) : aeronave.testes.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.nome}</td>
                    <td style={{ textTransform: 'capitalize', fontSize: 13, color: 'var(--gray-500)' }}>{t.tipo}</td>
                    <td><span className={`badge ${testeResMap[t.resultado]?.badge || 'badge-gray'}`}>{testeResMap[t.resultado]?.label || t.resultado}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{t.dataRealizacao ? new Date(t.dataRealizacao + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                    <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{t.responsavel || '—'}</td>
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

      {/* ─── ETAPAS ─── */}
      {tab === 'etapas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'etapa', item: null })}>
              <Plus size={15} /> Nova Etapa
            </button>
          </div>
          {etapasSorted.length === 0 ? (
            <div className="empty-state"><p>Nenhuma etapa cadastrada.</p></div>
          ) : (
            <div className="etapas-list">
              {etapasSorted.map(e => {
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
                            {e.dataInicio && <span style={{ marginLeft: 12 }}>📅 Início: {new Date(e.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                            {e.dataFim && <span style={{ marginLeft: 12 }}>✅ Conclusão: {new Date(e.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
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

      {/* ─── MODALS ─── */}
      {modal?.type === 'peca' && <PecaModal peca={modal.item} onClose={closeModal} onSave={handleSavePeca} />}
      {modal?.type === 'teste' && <TesteModal teste={modal.item} onClose={closeModal} onSave={handleSaveTeste} />}
      {modal?.type === 'etapa' && <EtapaModal etapa={modal.item} onClose={closeModal} onSave={handleSaveEtapa} />}

      {deleteTarget && (
        <ConfirmDialog
          title={`Excluir ${deleteTarget.type === 'peca' ? 'Peça' : deleteTarget.type === 'teste' ? 'Teste' : 'Etapa'}`}
          message={`Tem certeza que deseja excluir "${deleteTarget.item.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}