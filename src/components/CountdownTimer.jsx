import { useState, useEffect } from 'react';
import { Icon } from './Icon';

export const CountdownTimer = ({ endsAt, style: s = {} }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const upd = () => {
      const d = endsAt - Date.now();
      if (d <= 0) { setTime('נסגר'); return; }
      const h = Math.floor(d / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const sec = Math.floor((d % 60000) / 1000);
      setTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`);
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(140,88,89,.18)', border: '1px solid rgba(240,192,96,.25)', borderRadius: 999, padding: '5px 12px', ...s }}>
      <Icon name="clock" size={13} color="#C9A44A" />
      <span style={{ color: '#C9A44A', fontWeight: 800, fontSize: 13, letterSpacing: 1, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
    </div>
  );
};
