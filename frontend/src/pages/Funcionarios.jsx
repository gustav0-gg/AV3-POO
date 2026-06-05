import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/Modal';
import { Plus, Search } from 'lucide-react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const permissaoOpts = [
  { value: 'admin',      label: 'Administrador' },
  { value: 'engenheiro', label: 'Engenheiro' },
  { value: 'operador',   label: 'Operador' },
];

const permissaoBadge = {
  admin:      { label: 'ADMINISTRADOR', bg: '#E8EAF6', color: '#3730A3' },
  engenheiro: { label: 'ENGENHEIRO',    bg: '#E0F5EA', color: '#065F46' },
  operador:   { label: 'OPERADOR',      bg: '#FEF3C7', color: '#92400E' },
};

// ─── MODAL FUNCIONÁRIO ────────────────────────────────────────────────────────
function FuncionarioModal({ func, onClose, onSave }) {
  const isEdit = !!func?.id;

  const [form, setForm] = useState({
    idUnico:    func?.idUnico    || '',
    permissao:  func?.permissao  || func?.role || '',
    nome:       func?.nome       || '',
    telefone:   func?.telefone   || '',
    endereco:   func?.endereco   || '',
    login:      func?.login      || func?.email || '',
    senha:      func?.senha      || '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!form.idUnico.trim())        e.idUnico   = 'Informe o ID único.';
    if (!form.permissao)             e.permissao = 'Selecione o nível de permissão.';
    if (!form.nome.trim())           e.nome      = 'Informe o nome completo.';
    if (!form.telefone.trim())       e.telefone  = 'Informe o telefone.';
    if (!form.endereco.trim())       e.endereco  = 'Informe o endereço.';
    if (!form.login.trim())          e.login     = 'Informe o usuário de login.';
    if (!isEdit && form.senha.length < 6) e.senha = 'Mínimo 6 caracteres.';
    if (isEdit && form.senha && form.senha.length < 6) e.senha = 'Mínimo 6 caracteres.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '13px 16px',
    border: `1.5px solid ${hasError ? '#DC2626' : '#E0E4F0'}`,
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    background: '#F4F5FF',
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
        <div style={{
          background: '#1E2749',
          padding: '22px 28px',
          textAlign: 'center',
        }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>
            {isEdit ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 8px' }}>

          {/* Linha 1 — ID único + Nível de permissão */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>ID único *</label>
              <input
                style={inputStyle(!!errors.idUnico)}
                placeholder="Ex: 0010"
                value={form.idUnico}
                onChange={e => set('idUnico', e.target.value)}
              />
              {errors.idUnico && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.idUnico}</span>}
            </div>
            <div>
              <label style={labelStyle}>Nível de permissão *</label>
              <select
                style={{ ...inputStyle(!!errors.permissao), appearance: 'none' }}
                value={form.permissao}
                onChange={e => set('permissao', e.target.value)}
              >
                <option value="">Selecionar ▾</option>
                {permissaoOpts.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {errors.permissao && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.permissao}</span>}
            </div>
          </div>

          {/* Linha 2 — Nome completo (full width) */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nome completo *</label>
            <input
              style={inputStyle(!!errors.nome)}
              placeholder="Ex: João da Silva"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
            />
            {errors.nome && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.nome}</span>}
          </div>

          {/* Linha 3 — Telefone + Endereço */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Telefone *</label>
              <input
                style={inputStyle(!!errors.telefone)}
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={e => set('telefone', e.target.value)}
              />
              {errors.telefone && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.telefone}</span>}
            </div>
            <div>
              <label style={labelStyle}>Endereço *</label>
              <input
                style={inputStyle(!!errors.endereco)}
                placeholder="Rua, número, cidade"
                value={form.endereco}
                onChange={e => set('endereco', e.target.value)}
              />
              {errors.endereco && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.endereco}</span>}
            </div>
          </div>

          {/* Linha 4 — Usuário (login) + Senha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
            <div>
              <label style={labelStyle}>Usuário (login) *</label>
              <input
                style={inputStyle(!!errors.login)}
                placeholder="Nome de usuário único"
                value={form.login}
                onChange={e => set('login', e.target.value)}
              />
              {errors.login && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.login}</span>}
            </div>
            <div>
              <label style={labelStyle}>Senha *</label>
              <input
                style={inputStyle(!!errors.senha)}
                type="password"
                placeholder={isEdit ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}
                value={form.senha}
                onChange={e => set('senha', e.target.value)}
              />
              {errors.senha && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.senha}</span>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: '16px 28px 24px',
        }}>
          <button
            onClick={onClose}
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
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
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
            Salvar funcionário
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CARD FUNCIONÁRIO ─────────────────────────────────────────────────────────
function FuncionarioCard({ func, onEdit, onDelete }) {
  const initials = func.nome
    ? func.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  const perm = permissaoBadge[func.permissao || func.role] || {
    label: (func.cargo || func.role || '').toUpperCase(),
    bg: '#F3F4F6', color: '#374151',
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8EAF0',
      borderRadius: 14,
      padding: '20px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      boxShadow: '0 2px 8px rgba(30,39,73,0.05)',
      transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,39,73,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,39,73,0.05)'}
    >
      {/* Avatar + info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 48, height: 48,
          borderRadius: '50%',
          background: '#1E2749',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700,
          color: '#C4B5FD',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1E2749', marginBottom: 4 }}>
            {func.nome}
          </div>
          {/* Badge permissão */}
          <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            background: perm.bg,
            color: perm.color,
            marginBottom: 6,
          }}>
            {perm.label}
          </span>
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
            {func.idUnico && <div>ID: {func.idUnico}</div>}
            {func.telefone && <div>{func.telefone}</div>}
            {func.email && !func.telefone && <div>{func.email}</div>}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button
          onClick={onEdit}
          style={{
            padding: '5px 16px',
            border: 'none',
            borderRadius: 6,
            background: '#FEF9C3',
            color: '#854D0E',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '5px 16px',
            border: 'none',
            borderRadius: 6,
            background: '#FEE2E2',
            color: '#DC2626',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

// ─── CARD NOVO (placeholder) ──────────────────────────────────────────────────
function NovoCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: '2px dashed #C4B5FD',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 160,
        cursor: 'pointer',
        background: 'transparent',
        transition: 'background 0.15s',
        color: '#9BAAD6',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#F0EEFF'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 40, height: 40,
        borderRadius: '50%',
        border: '2px dashed #C4B5FD',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color: '#C4B5FD',
      }}>
        +
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#9BAAD6' }}>Novo</span>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Funcionarios() {
  const { funcionarios, addFuncionario, updateFuncionario, deleteFuncionario } = useApp();

  const [search, setSearch]           = useState('');
  const [filterPerm, setFilterPerm]   = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editItem, setEditItem]       = useState(null);
  const [deleteItem, setDeleteItem]   = useState(null);

  const filtered = funcionarios.filter(f => {
    const matchSearch = f.nome.toLowerCase().includes(search.toLowerCase()) ||
      (f.idUnico || '').toLowerCase().includes(search.toLowerCase());
    const matchPerm = !filterPerm || (f.permissao || f.role) === filterPerm;
    return matchSearch && matchPerm;
  });

  const handleSave = (data) => {
    if (editItem?.id) {
      updateFuncionario(editItem.id, {
        ...data,
        role: data.permissao,
        cargo: permissaoOpts.find(p => p.value === data.permissao)?.label || data.permissao,
        email: data.login,
        status: 'ativo',
      });
    } else {
      addFuncionario({
        ...data,
        role: data.permissao,
        cargo: permissaoOpts.find(p => p.value === data.permissao)?.label || data.permissao,
        email: data.login,
        status: 'ativo',
      });
    }
    setModalOpen(false);
    setEditItem(null);
  };

  const openEdit = (f) => { setEditItem(f); setModalOpen(true); };
  const openNew  = () => { setEditItem(null); setModalOpen(true); };

  return (
    <div style={{
      padding: '32px',
      fontFamily: 'var(--font-body, DM Sans, sans-serif)',
      minHeight: '100vh',
      background: 'var(--lavender-100, #F0EEFF)',
    }}>

      {/* ── Cabeçalho ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display, DM Sans, sans-serif)',
          fontSize: 22, fontWeight: 800,
          color: 'var(--navy-800, #1E2749)',
          margin: 0,
        }}>
          Funcionários
        </h1>
        <button
          onClick={openNew}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: '#1E2749',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + Cadastrar funcionário
        </button>
      </div>

      {/* ── Filtros ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {/* Busca */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={15} style={{
            position: 'absolute', left: 13, top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF', pointerEvents: 'none',
          }} />
          <input
            placeholder="Buscar por nome ou ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              border: '1.5px solid #E0E4F0',
              borderRadius: 10,
              fontSize: 14,
              background: '#fff',
              color: '#1E2749',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Filtro permissão */}
        <select
          value={filterPerm}
          onChange={e => setFilterPerm(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1.5px solid #E0E4F0',
            borderRadius: 10,
            fontSize: 14,
            background: '#fff',
            color: filterPerm ? '#1E2749' : '#9CA3AF',
            fontFamily: 'inherit',
            outline: 'none',
            minWidth: 160,
          }}
        >
          <option value="">Filtrar permissão ▾</option>
          {permissaoOpts.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* ── Grid de cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {filtered.map(f => (
          <FuncionarioCard
            key={f.id}
            func={f}
            onEdit={() => openEdit(f)}
            onDelete={() => setDeleteItem(f)}
          />
        ))}

        {/* Card "Novo" — só aparece quando não está filtrando */}
        {!search && !filterPerm && (
          <NovoCard onClick={openNew} />
        )}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF', fontSize: 14 }}>
          Nenhum funcionário encontrado.
        </div>
      )}

      {/* ── Modal Cadastrar / Editar ── */}
      {modalOpen && (
        <FuncionarioModal
          func={editItem}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {/* ── Confirmar Exclusão ── */}
      {deleteItem && (
        <ConfirmDialog
          title="Excluir Funcionário"
          message={`Tem certeza que deseja excluir "${deleteItem.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => { deleteFuncionario(deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}