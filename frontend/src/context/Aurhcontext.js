import React, { createContext, useContext, useState } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  const login = (email, senha) => {
    const user = users.find(u => u.email === email && u.senha === senha);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      return true;
    }
    setLoginError('E-mail ou senha incorretos.');
    return false;
  };

  const logout = () => setCurrentUser(null);

  const isAdmin = currentUser?.role === 'admin';
  const canSeeEmployees = isAdmin;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loginError, isAdmin, canSeeEmployees }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);