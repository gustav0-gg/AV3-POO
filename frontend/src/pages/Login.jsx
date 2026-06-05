import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    login(email, senha);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#fff',
      fontFamily: 'var(--font-body)',
    }}>
      {/* ── Lado esquerdo: imagem ── */}
      <div style={{
        width: '45%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0 0 0 0',
        flexShrink: 0,
      }}>
        {/* Placeholder — substitua pelo <img> quando tiver a foto */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #a8d4f5 0%, #c9e8f7 40%, #b0cfe8 100%)',
        }} />

        {/* Quando tiver a imagem, descomente isto e remova o div acima:
        <img
          src="/assets/airplane.jpg"
          alt="Aeronave"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        */}

        {/* Card AEROCODE */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)',
          textAlign: 'center',
        }}>
          <div style={{
            background: 'var(--navy-700)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: '0.12em',
            padding: '14px 36px',
            borderRadius: 10,
            marginBottom: 18,
            display: 'inline-block',
          }}>
            AEROCODE
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 14,
            lineHeight: 1.6,
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}>
            Sistema de Gestão de<br />Produção de Aeronaves
          </p>
        </div>
      </div>

      {/* ── Lado direito: formulário ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '48px 40px',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Título */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--navy-800)',
              marginBottom: 8,
            }}>
              Bem-vindo de volta
            </h1>
            <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Campo Usuário */}
            <div className="form-group">
              <label className="form-label">Usuário</label>
              <div style={{ position: 'relative' }}>
                <input
                  className={`form-input ${loginError ? 'input-error' : ''}`}
                  style={{ paddingRight: 42 }}
                  type="text"
                  placeholder="Digite seu usuário"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Eye
                  size={17}
                  style={{
                    position: 'absolute', right: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--gray-400)', pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  className={`form-input ${loginError ? 'input-error' : ''}`}
                  style={{ paddingRight: 42 }}
                  type={showSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(v => !v)}
                  style={{
                    position: 'absolute', right: 11, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--gray-400)', display: 'flex', alignItems: 'center',
                    padding: 2,
                  }}
                >
                  {showSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 50,
                background: 'var(--navy-700)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'var(--font-body)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                marginTop: 8,
                transition: 'background 0.15s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--navy-800)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--navy-700)'; }}
            >
              {loading ? 'Entrando...' : 'Entrar no sistema'}
            </button>

            {/* Erro */}
            {loginError && (
              <div style={{
                marginTop: 14,
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: 10,
                padding: '13px 16px',
                fontSize: 14,
                color: 'var(--red-700)',
                textAlign: 'center',
              }}>
                Usuário ou senha inválidos. Tente novamente.
              </div>
            )}
          </form>

          {/* Rodapé */}
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--gray-400)',
            marginTop: 32,
            lineHeight: 1.7,
          }}>
            Acesso exclusivo para funcionários cadastrados.<br />
            Entre em contato com o administrador para criar sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}