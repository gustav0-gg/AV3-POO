import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

// ─── MODAL BASE ────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const maxWidth = size === 'lg' ? 680 : 520;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ─────────────────────────────────────────────────────────
export function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = 'Excluir' }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal confirm-modal">
        <div className="modal-body">
          <div className="confirm-icon">
            <AlertTriangle size={28} color="var(--red-700)" />
          </div>
          <h2 className="confirm-title">{title}</h2>
          <p className="confirm-text">{message}</p>
          <div className="confirm-footer">
            <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
            <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}