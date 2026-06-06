import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/Modal';
import { Plus, Search } from 'lucide-react';

const permissaoOpts = [
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'ENGENHEIRO',    label: 'Engenheiro' },
  { value: 'OPERADOR',      label: 'Operador' },
];

const permissaoBadge = {
  ADMINISTRADOR: { label: 'ADMINISTRADOR', bg: '#E8EAF6', color: '#3730A3' },
  ENGENHEIRO:    { label: 'ENGENHEIRO',    bg: '#E0F5EA', color: '#065F46' },
  OPERADOR:      { label: 'OPERADOR',      bg: '#FEF3C7', color: '#92400E' },
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
function FuncionarioModal({ func, onClose, onSave }) {
  const isEdit = !!func?.id;
  const [form, setForm] = useState({
    id:             func?.id             || '',
    nome:           func?.nome           || '',
    telefone:       func?.telefone       || '',
    endereco:       func?.endereco       || '',
    usuario:        func?.usuario        || '',
    senha:          '',
    nivelPermissao: func?.nivelPermissao || '',
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!isEdit && !form.id.trim())      e.id             = 'Informe o ID único.';
    if (!form.nome.trim())               e.nome           = 'Informe o nome completo.';
    if (!form.telefone.trim())           e.telefone       = 'Informe o telefone.';
    if (!form.endereco.trim())           e.endereco       = 'Informe o endereço.';
    if (!form.usuario.trim())            e.usuario        = 'Informe o usuário de login.';
    if (!form.nivelPermissao)            e.nivelPermissao = 'Selecione o nível de permissão.';
    if (!isEdit && form.senha.length < 6) e.senha         = 'Mínimo 6 caracteres.';
    if (isEdit && form.senha && form.senha.length < 6) e.senha = 'Mínimo 6 caracteres.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const inp = (hasErr) => ({
    width: '100%', padding: '13px 16px',
    border: `1.5px solid ${hasErr ? '#DC2626' : '#E0E4F0'}`,
    borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
    background: '#F4F5FF', color: '#1E2749', outline: 'none', boxSizing: 'border-box',
  });
  const lbl = { fontSize: 13, fontWeight: 600, color: '#1E2749', marginBottom: 7, display: 'block' };
  const err = { fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'var(--font-body)' }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 720, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
        <div style={{ background: '#1E2749', padding: '22px 28px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>
            {isEdit ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
          </h2>
        </div>

        <div style={{ padding: '28px 28px 8px' }}>
          {/* ID + Nível de permissão */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={lbl}>ID único *</label>
              <input style={inp(!!errors.id)} placeholder="Ex: 0010" value={form.id}
                onChange={e => set('id', e.target.value)} disabled={isEdit} />
              {errors.id && <span style={err}>{errors.id}</span>}
            </div>
            <div>
              <label style={lbl}>Nível de permissão *</label>
              <select style={{ ...inp(!!errors.nivelPermissao), appearance: 'none' }}
                value={form.nivelPermissao} onChange={e => set('nivelPermissao', e.target.value)}>
                <option value="">Selecionar ▾</option>
                {permissaoOpts.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              {errors.nivelPermissao && <span style={err}>{errors.nivelPermissao}</span>}
            </div>
          </div>

          {/* Nome */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Nome completo *</label>
            <input style={inp(!!errors.nome)} placeholder="Ex: João da Silva" value={form.nome}
              onChange={e => set('nome', e.target.value)} />
            {errors.nome && <span style={err}>{errors.nome}</span>}
          </div>

          {/* Telefone + Endereço */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Telefone *</label>
              <input style={inp(!!errors.telefone)} placeholder="(00) 00000-0000" value={form.telefone}
                onChange={e => set('telefone', e.target.value)} />
              {errors.telefone && <span style={err}>{errors.telefone}</span>}
            </div>
            <div>
              <label style={lbl}>Endereço *</label>
              <input style={inp(!!errors.endereco)} placeholder="Rua, número, cidade" value={form.endereco}
                onChange={e => set('endereco', e.target.value)} />
              {errors.endereco && <span style={err}>{errors.endereco}</span>}
            </div>
          </div>

          {/* Usuário + Senha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
            <div>
              <label style={lbl}>Usuário (login) *</label>
              <input style={inp(!!errors.usuario)} placeholder="Nome de usuário único" value={form.usuario}
                onChange={e => set('usuario', e.target.value)} />
              {errors.usuario && <span style={err}>{errors.usuario}</span>}
            </div>
            <div>
              <label style={lbl}>Senha *</label>
              <input style={inp(!!errors.senha)} type="password"
                placeholder={isEdit ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}
                value={form.senha} onChange={e => set('senha', e.target.value)} />
              {errors.senha && <span style={err}>{errors.senha}</span>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 28px 24px' }}>
          <button onClick={onClose} style={{ padding: '14px', border: '1.5px solid #E0E4F0', borderRadius: 12, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} style={{ padding: '14px', border: 'none', borderRadius: 12, background: '#1E2749', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Salvar funcionário
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function FuncionarioCard({ func, onEdit, onDelete }) {
  const initials = func.nome ? func.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '??';
  const perm = permissaoBadge[func.nivelPermissao] || { label: func.nivelPermissao, bg: '#F3F4F6', color: '#374151' };

  return (
    <div style={{ background: '#fff', border: '1px solid #E8EAF0', borderRadius: 14, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 2px 8px rgba(30,39,73,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1E2749', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#C4B5FD', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1E2749', marginBottom: 4 }}>{func.nome}</div>
          <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', background: perm.bg, color: perm.color, marginBottom: 6 }}>
            {perm.label}
          </span>
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
            <div>ID: {func.id}</div>
            {func.telefone && <div>{func.telefone}</div>}
            {func.endereco && <div style={{ fontSize: 12, color: '#9CA3AF' }}>{func.endereco}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button onClick={onEdit} style={{ padding: '5px 16px', border: 'none', borderRadius: 6, background: '#FEF9C3', color: '#854D0E', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Editar</button>
        <button onClick={onDelete} style={{ padding: '5px 16px', border: 'none', borderRadius: 6, background: '#FEE2E2', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Excluir</button>
      </div>
    </div>
  );
}

function NovoCard({ onClick }) {
  return (
    <div onClick={onClick} style={{ border: '2px dashed #C4B5FD', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 160, cursor: 'pointer', background: 'transparent', color: '#9BAAD6' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px dashed #C4B5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#C4B5FD' }}>+</div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#9BAAD6' }}>Novo</span>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Funcionarios() {
  const { funcionarios, addFuncionario, updateFuncionario, deleteFuncionario } = useApp();
  const [search, setSearch]         = useState('');
  const [filterPerm, setFilterPerm] = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = funcionarios.filter(f => {
    const matchSearch = f.nome.toLowerCase().includes(search.toLowerCase()) ||
      (f.id || '').toLowerCase().includes(search.toLowerCase());
    const matchPerm = !filterPerm || f.nivelPermissao === filterPerm;
    return matchSearch && matchPerm;
  });

  const handleSave = (data) => {
    if (editItem?.id) {
      updateFuncionario(editItem.id, data);
    } else {
      addFuncionario(data);
    }
    setModalOpen(false);
    setEditItem(null);
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'var(--font-body)', minHeight: '100vh', background: 'var(--lavender-100, #F0EEFF)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--navy-800)', margin: 0 }}>Funcionários</h1>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#1E2749', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Cadastrar funcionário
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          <input placeholder="Buscar por nome ou ID..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid #E0E4F0', borderRadius: 10, fontSize: 14, background: '#fff', color: '#1E2749', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select value={filterPerm} onChange={e => setFilterPerm(e.target.value)}
          style={{ padding: '10px 14px', border: '1.5px solid #E0E4F0', borderRadius: 10, fontSize: 14, background: '#fff', color: filterPerm ? '#1E2749' : '#9CA3AF', fontFamily: 'inherit', outline: 'none', minWidth: 160 }}>
          <option value="">Filtrar permissão ▾</option>
          {permissaoOpts.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {filtered.map(f => (
          <FuncionarioCard key={f.id} func={f}
            onEdit={() => { setEditItem(f); setModalOpen(true); }}
            onDelete={() => setDeleteItem(f)} />
        ))}
        {!search && !filterPerm && <NovoCard onClick={() => { setEditItem(null); setModalOpen(true); }} />}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF', fontSize: 14 }}>Nenhum funcionário encontrado.</div>
      )}

      {modalOpen && (
        <FuncionarioModal func={editItem}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSave={handleSave} />
      )}

      {deleteItem && (
        <ConfirmDialog
          title="Excluir Funcionário"
          message={`Tem certeza que deseja excluir "${deleteItem.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => { deleteFuncionario(deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)} />
      )}
    </div>
  );
}
