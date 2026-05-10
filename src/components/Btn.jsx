import { useState } from 'react';

export const Btn = ({ children, onClick, disabled, full, size = 'md', variant = 'primary', style: s = {} }) => {
  const [hov, setHov] = useState(false);
  const [act, setAct] = useState(false);
  const h = { sm: 38, md: 52, lg: 56 }[size];
  const styles = {
    primary: {
      background: disabled ? '#3A2520' : hov ? '#B82A12' : '#E8361A',
      color: disabled ? '#6A4040' : '#fff',
      boxShadow: disabled ? 'none' : hov ? '0 6px 28px rgba(232,54,26,.5)' : '0 4px 20px rgba(232,54,26,.35)',
    },
    secondary: {
      background: hov ? 'rgba(240,192,96,.15)' : 'rgba(240,192,96,.08)',
      color: '#F0C060',
      boxShadow: 'none',
      border: '1px solid rgba(240,192,96,.3)',
    },
    ghost: {
      background: hov ? 'rgba(255,255,255,.08)' : 'transparent',
      color: '#C4A990',
      boxShadow: 'none',
      border: '1px solid rgba(255,255,255,.12)',
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
        border: styles.border || 'none',
        borderRadius: 14,
        height: h,
        padding: '0 24px',
        fontFamily: 'inherit',
        fontWeight: 800,
        fontSize: size === 'sm' ? 13 : 15,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: full ? '100%' : 'auto',
        transition: 'all .18s cubic-bezier(0.23,1,0.32,1)',
        transform: act ? 'scale(0.97)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...s,
      }}
    >{children}</button>
  );
};
