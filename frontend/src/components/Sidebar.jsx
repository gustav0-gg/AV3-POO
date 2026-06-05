import React from 'react'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Plane, ClipboardList,
  Users, FileBarChart2, LogOut, Activity
} from 'lucide-react'

const navItems = [
  { id: 'dashboard',   label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'aeronaves',   label: 'Aeronaves',           icon: Plane },
  { id: 'etapas',      label: 'Etapas de Produção',  icon: ClipboardList },
  { id: 'funcionarios',label: 'Funcionários',         icon: Users },
  { id: 'relatorio',   label: 'Relatórios',           icon: FileBarChart2 },
  { id: 'metricas',    label: 'Métricas Qualidade',   icon: Activity },
]

export default function Sidebar({ currentPage, onNavigate }) {
  const { currentUser, logout, canSeeEmployees } = useAuth()

  const initials = currentUser?.nome
    ? currentUser.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const roleLabel = {
    ADMINISTRADOR: 'ADMINISTRADOR',
    ENGENHEIRO: 'ENGENHEIRO',
    OPERADOR: 'OPERADOR',
  }[currentUser?.nivelPermissao] || ''

  const visibleItems = navItems.filter(item =>
    item.id !== 'funcionarios' || canSeeEmployees
  )

  return (
    <aside className="sidebar">
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          background: 'var(--navy-700)', color: '#fff', fontWeight: 800,
          fontSize: 15, letterSpacing: '0.12em', padding: '10px 0',
          borderRadius: 8, textAlign: 'center', width: '100%',
        }}>
          AEROCODE
        </div>
      </div>

      <div style={{
        padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'var(--lavender-300)', flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser?.nome}
          </div>
          <div style={{ fontSize: 10, color: 'var(--navy-400)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {roleLabel}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu Principal</div>
        {visibleItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item${currentPage === item.id ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={17} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--navy-400)', fontSize: 13, fontWeight: 500,
            fontFamily: 'var(--font-body)', padding: '8px 12px', borderRadius: 8, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--navy-400)' }}
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </aside>
  )
}
