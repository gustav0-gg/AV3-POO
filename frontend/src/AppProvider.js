import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { aeronavesAPI, funcionariosAPI } from './services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [aeronaves, setAeronaves]       = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [loadingData, setLoadingData]   = useState(false)

  // ── Carrega dados do backend ───────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoadingData(true)
    try {
      const [avs, funcs] = await Promise.all([
        aeronavesAPI.listar(),
        funcionariosAPI.listar(),
      ])
      setAeronaves(avs)
      setFuncionarios(funcs)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('aerocode_token')) {
      fetchAll()
    }
  }, []) // eslint-disable-line

  // ── Aeronaves ──────────────────────────────────────────────────────────────
  const addAeronave = async (data) => {
    const nova = await aeronavesAPI.criar(data)
    setAeronaves(prev => [nova, ...prev])
    return nova
  }
  const updateAeronave = async (id, data) => {
    const updated = await aeronavesAPI.atualizar(id, data)
    setAeronaves(prev => prev.map(a => a.id === id ? updated : a))
  }
  const deleteAeronave = async (id) => {
    await aeronavesAPI.deletar(id)
    setAeronaves(prev => prev.filter(a => a.id !== id))
  }

  // ── Peças ──────────────────────────────────────────────────────────────────
  const addPeca = async (aeronaveId, data) => {
    const nova = await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/pecas`, {
      method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` },
      body: JSON.stringify(data)
    }).then(r => r.json())
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, pecas: [...a.pecas, nova] } : a))
  }
  const updatePeca = async (aeronaveId, pecaId, data) => {
    const updated = await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/pecas/${pecaId}`, {
      method: 'PUT', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` },
      body: JSON.stringify(data)
    }).then(r => r.json())
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, pecas: a.pecas.map(p => p.id === pecaId ? updated : p) } : a))
  }
  const deletePeca = async (aeronaveId, pecaId) => {
    await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/pecas/${pecaId}`, {
      method: 'DELETE', headers: { Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` }
    })
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, pecas: a.pecas.filter(p => p.id !== pecaId) } : a))
  }

  // ── Testes ─────────────────────────────────────────────────────────────────
  const addTeste = async (aeronaveId, data) => {
    const novo = await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/testes`, {
      method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` },
      body: JSON.stringify(data)
    }).then(r => r.json())
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, testes: [...a.testes, novo] } : a))
  }
  const updateTeste = async (aeronaveId, testeId, data) => {
    const updated = await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/testes/${testeId}`, {
      method: 'PUT', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` },
      body: JSON.stringify(data)
    }).then(r => r.json())
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, testes: a.testes.map(t => t.id === testeId ? updated : t) } : a))
  }
  const deleteTeste = async (aeronaveId, testeId) => {
    await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/testes/${testeId}`, {
      method: 'DELETE', headers: { Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` }
    })
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, testes: a.testes.filter(t => t.id !== testeId) } : a))
  }

  // ── Etapas ─────────────────────────────────────────────────────────────────
  const addEtapa = async (aeronaveId, data) => {
    const nova = await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/etapas`, {
      method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` },
      body: JSON.stringify(data)
    }).then(r => r.json())
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, etapas: [...a.etapas, nova] } : a))
  }
  const updateEtapa = async (aeronaveId, etapaId, data) => {
    const updated = await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/etapas/${etapaId}`, {
      method: 'PUT', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` },
      body: JSON.stringify(data)
    }).then(r => r.json())
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? updated : e) } : a))
  }
  const deleteEtapa = async (aeronaveId, etapaId) => {
    await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:3001/api'}/aeronaves/${aeronaveId}/etapas/${etapaId}`, {
      method: 'DELETE', headers: { Authorization:`Bearer ${localStorage.getItem('aerocode_token')}` }
    })
    setAeronaves(prev => prev.map(a => a.id === aeronaveId ? { ...a, etapas: a.etapas.filter(e => e.id !== etapaId) } : a))
  }

  // ── Funcionários ───────────────────────────────────────────────────────────
  const addFuncionario = async (data) => {
    const novo = await funcionariosAPI.criar(data)
    setFuncionarios(prev => [...prev, novo])
  }
  const updateFuncionario = async (id, data) => {
    const updated = await funcionariosAPI.atualizar(id, data)
    setFuncionarios(prev => prev.map(f => f.id === id ? updated : f))
  }
  const deleteFuncionario = async (id) => {
    await funcionariosAPI.deletar(id)
    setFuncionarios(prev => prev.filter(f => f.id !== id))
  }

  return (
    <AppContext.Provider value={{
      aeronaves, addAeronave, updateAeronave, deleteAeronave,
      addPeca, updatePeca, deletePeca,
      addTeste, updateTeste, deleteTeste,
      addEtapa, updateEtapa, deleteEtapa,
      funcionarios, addFuncionario, updateFuncionario, deleteFuncionario,
      loadingData, fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
