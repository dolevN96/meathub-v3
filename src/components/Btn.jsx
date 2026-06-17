import { useState } from 'react';

export const Btn = ({ children, onClick, disabled, full, size = 'md', variant = 'primary', style: s = {} }) => {
  const [hov, setHov] = useState(false);
  const [act, setAct] = useState(false);
  const h = { sm: 38, md: 52, lg: 56 }[size];

  const styles = {
    primary: {
      background: disabled ? '#C4B0AA' : hov ? '#6B1212' : '#8B1A1A',
      color: disabled ? '#FFFFFF' : '#FFFFFF',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: '#4A3728',
      border: '1px solid rgba(10,7,5,.20)',
    },
    ghost: {
      background: 'transparent',
      color: hov ? '#6B1212' : '#8B1A1A',
      border: '1px solid #8B1A1A',
    },
  }[variant] || {};

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setAct(false); }}
      onMouseDown={() => setAct(true)}
      onMouseUp={() => setAct(false)}
      style={{
        ...styles,
        borderRadius: 2,
        height: h,
        padding: '0 24px',
        fontFamily: 'inherit',
        fontWeight: 600,
        fontSize: size === 'sm' ? 13 : 15,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: full ? '100%' : 'auto',
        transition: 'background 150ms ease, opacity 150ms ease, transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: act ? 'scale(0.96)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...s,
      }}
    >{children}</button>
  );
};
