import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)

  // Restaura sessão do localStorage ao carregar
  useEffect(() => {
    const token = localStorage.getItem('aerocode_token')
    const user  = localStorage.getItem('aerocode_user')
    if (token && user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const login = async (email, senha) => {
    try {
      const data = await authAPI.login(email, senha)
      localStorage.setItem('aerocode_token', data.token)
      localStorage.setItem('aerocode_user', JSON.stringify(data.user))
      setCurrentUser(data.user)
      setLoginError('')
      return true
    } catch (err) {
      setLoginError(err.message || 'Usuário ou senha inválidos.')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('aerocode_token')
    localStorage.removeItem('aerocode_user')
    setCurrentUser(null)
  }

  const isAdmin      = currentUser?.nivelPermissao === 'ADMINISTRADOR'
  const isEngenheiro = ['ADMINISTRADOR','ENGENHEIRO'].includes(currentUser?.nivelPermissao)
  const canSeeEmployees = isAdmin

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loginError, isAdmin, isEngenheiro, canSeeEmployees, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
