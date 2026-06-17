import { useState, useEffect } from 'react';
import { Icon } from './Icon';

export const CountdownTimer = ({ endsAt, style: s = {} }) => {
  const [time, setTime] = useState('');
  const [totalSeconds, setTotalSeconds] = useState(Infinity);

  useEffect(() => {
    const upd = () => {
      const d = new Date(endsAt) - Date.now();
      if (d <= 0) { setTime('נסגר'); setTotalSeconds(0); return; }
      const secs = Math.floor(d / 1000);
      setTotalSeconds(secs);
      const h = Math.floor(d / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const sec = Math.floor((d % 60000) / 1000);
      setTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`);
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const isUrgent = totalSeconds < 30 * 60;
  const color = isUrgent ? '#B45309' : '#C9A44A';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(140,88,89,.18)', border: '1px solid rgba(240,192,96,.25)', borderRadius: 999, padding: '5px 12px', ...s }}>
      <Icon name="clock" size={13} color={color} />
      <span style={{ color, fontWeight: 800, fontSize: 13, letterSpacing: 1, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
    </div>
  );
};
