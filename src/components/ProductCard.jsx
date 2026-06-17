import { useState } from 'react';
import { GradeBadge } from './GradeBadge';

export const ProductCard = ({ product, onPress, wide = false, hasActiveGroup = false }) => {
  const [hov, setHov] = useState(false);
  const imp = product.importer;
  const saving = Math.round((1 - product.price_group / product.price_retail) * 100);

  return (
    <div
      onClick={() => onPress && onPress(product)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${hov ? 'rgba(10,7,5,.24)' : 'rgba(10,7,5,.14)'}`,
        borderRadius: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 180ms ease',
        display: wide ? 'flex' : 'block',
      }}
    >
      {/* Image area */}
      <div style={wide
        ? { width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden' }
        : { aspectRatio: '16/10', width: '100%', overflow: 'hidden', position: 'relative' }
      }>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: product.color1 || '#9C8070' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingInlineStart: 12, paddingInlineEnd: 12, paddingBottom: 12 }}>
          <GradeBadge grade={product.grade} gradeLabel={product.grade_label} />
          {hasActiveGroup && (
            <div className="live-badge">
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1A5C3A', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
              <span>LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Info area */}
      <div style={{ paddingInlineStart: 14, paddingInlineEnd: 14, paddingTop: 12, paddingBottom: 14, flex: 1 }}>
        <div style={{ fontSize: 11, color: '#9C8070', marginBottom: 3 }}>
          {imp?.name}{imp?.origin ? ` · ${imp.origin}` : ''}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0A0705', marginBottom: 8, lineHeight: 1.3 }}>
          {product.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 900, fontSize: 17, color: '#8B1A1A' }}>₪{product.price_group}</span>
          <span style={{ fontSize: 12, color: '#9C8070', textDecoration: 'line-through' }}>₪{product.price_retail}</span>
          <span style={{ background: 'rgba(139,26,26,.08)', border: '1px solid rgba(139,26,26,.20)', color: '#8B1A1A', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 2, marginInlineStart: 'auto' }}>-{saving}%</span>
        </div>
        <div style={{ fontSize: 11, color: '#9C8070', marginTop: 3 }}>לק"ג</div>
      </div>
    </div>
  );
};
