import { useState } from 'react';
import { IMPORTERS, GROUPS } from '../data';
import { GradeBadge } from './GradeBadge';

export const ProductCard = ({ product, onPress, wide = false }) => {
  const [hov, setHov] = useState(false);
  const imp = IMPORTERS.find(i => i.id === product.importer);
  const saving = Math.round((1 - product.priceGroup / product.priceRetail) * 100);
  const groups = GROUPS.filter(g => g.productId === product.id && g.status === 'active');

  return (
    <div
      onClick={() => onPress && onPress(product)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#EADDBA' : '#EFF6D9',
        border: `1px solid ${hov ? 'rgba(140,88,89,.45)' : 'rgba(140,88,89,.18)'}`,
        borderRadius: 16, overflow: 'hidden',
        boxShadow: hov ? '0 12px 40px rgba(140,88,89,.18), 0 0 0 1px rgba(140,88,89,.2)' : '0 2px 12px rgba(140,88,89,.10)',
        cursor: 'pointer',
        transition: 'all .22s cubic-bezier(0.23,1,0.32,1)',
        transform: hov ? 'translateY(-4px)' : 'none',
        display: wide ? 'flex' : 'block',
      }}
    >
      <div style={{ height: wide ? 'auto' : 130, width: wide ? 110 : 'auto', background: `linear-gradient(135deg,${product.color1},${product.color2})`, flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 10 }}>
        <GradeBadge grade={product.grade} />
        {groups.length > 0 && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(238,233,214,.88)', borderRadius: 6, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(74,124,89,.3)', backdropFilter: 'blur(6px)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: '#22C55E', fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>LIVE</span>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px 14px', flex: 1 }}>
        <div style={{ fontSize: 11, color: '#8C6B5A', marginBottom: 3 }}>{imp?.name} · {imp?.origin}</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1E0E0E', marginBottom: 8, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 900, fontSize: 17, color: '#8C5859' }}>₪{product.priceGroup}</span>
          <span style={{ fontSize: 12, color: '#8C6B5A', textDecoration: 'line-through' }}>₪{product.priceRetail}</span>
          <span style={{ background: 'rgba(140,88,89,.12)', border: '1px solid rgba(140,88,89,.3)', color: '#8C5859', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, marginRight: 'auto' }}>-{saving}%</span>
        </div>
        <div style={{ fontSize: 11, color: '#8C6B5A', marginTop: 3 }}>לק"ג</div>
      </div>
    </div>
  );
};
