import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Aeronaves from './pages/Aeronaves'
import AeronaveDetalhe from './pages/Aeronavedetalhe'
import Etapas from './pages/Etapasproducao'
import Pecas from './pages/Pecas'
import Testes from './pages/Testes'
import Funcionarios from './pages/Funcionarios'
import Relatorio from './pages/Relatorio'
import MetricasQualidade from './pages/MetricasQualidade'
import './style/index.css'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedAeronaveId, setSelectedAeronaveId] = useState(null)

  if (loading) return null

  if (!isAuthenticated) return <Login />

  const handleViewDetail = (id) => {
    setSelectedAeronaveId(id)
    setCurrentPage('aeronave-detalhe')
  }
  const handleBack = () => setCurrentPage('aeronaves')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':        return <Dashboard onNavigate={setCurrentPage} />
      case 'aeronaves':        return <Aeronaves onViewDetail={handleViewDetail} />
      case 'aeronave-detalhe': return <AeronaveDetalhe aeronaveId={selectedAeronaveId} onBack={handleBack} />
      case 'etapas':           return <Etapas />
      case 'pecas':            return <Pecas />
      case 'testes':           return <Testes />
      case 'funcionarios':     return <Funcionarios />
      case 'relatorio':        return <Relatorio />
      case 'metricas':         return <MetricasQualidade />
      default:                 return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main style={{ flex: 1, overflow: 'auto', marginLeft: '220px' }}>
        {renderPage()}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  )
}