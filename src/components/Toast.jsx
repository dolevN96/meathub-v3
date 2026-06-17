import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastCtx = createContext(null);

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,.25)" />
      <path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,.25)" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="rgba(0,0,0,.15)" />
      <path d="M8 7v5M8 5.5v.5" stroke="#1E0E0E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

const BG = { success: '#22C55E', error: '#EF4444', info: '#C9A44A' };
const COLOR = { success: '#fff', error: '#fff', info: '#1E0E0E' };

function ToastItem({ id, type, message, onDismiss }) {
  return (
    <div
      onClick={() => onDismiss(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: BG[type], color: COLOR[type],
        borderRadius: 12, padding: '12px 18px',
        fontWeight: 700, fontSize: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,.18)',
        cursor: 'pointer', animation: 'toastIn .28s cubic-bezier(0.23,1,0.32,1) both',
        maxWidth: 360, userSelect: 'none',
        border: type === 'info' ? '1px solid rgba(0,0,0,.1)' : 'none',
      }}
    >
      {ICONS[type]}
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);

  const show = useCallback((message, type = 'info') => {
    const id = ++counter.current;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const toast = {
    success: msg => show(msg, 'success'),
    error: msg => show(msg, 'error'),
    info: msg => show(msg, 'info'),
  };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10,
        alignItems: 'center', pointerEvents: 'none',
      }}>
        <style>{`
          @keyframes toastIn {
            from { opacity: 0; transform: translateY(-12px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0)      scale(1); }
          }
          @media (min-width: 768px) {
            .toast-container {
              left: auto !important;
              right: 24px !important;
              transform: none !important;
              align-items: flex-end !important;
            }
          }
        `}</style>
        <div className="toast-container" style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          alignItems: 'center', pointerEvents: 'auto',
        }}>
          {toasts.map(t => (
            <ToastItem key={t.id} {...t} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
