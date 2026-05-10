import { IMPORTERS } from '../data';
import { Icon } from './Icon';

export const ImporterCard = ({ importerId }) => {
  const imp = IMPORTERS.find(i => i.id === importerId);
  if (!imp) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(240,192,96,.1)' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#E8361A,#B82A12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{imp.logo}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#F5EDE4' }}>{imp.name}</div>
        <div style={{ fontSize: 11, color: '#7A5F50', display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map" size={11} color="#7A5F50" />{imp.origin}</div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="star" size={13} color="#F0C060" /><span style={{ fontWeight: 700, fontSize: 13, color: '#F5EDE4' }}>{imp.rating}</span></div>
        <div style={{ fontSize: 10, color: '#7A5F50' }}>{imp.reviews} ביקורות</div>
      </div>
      {imp.verified && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(34,197,94,.1)', borderRadius: 6, padding: '3px 8px', border: '1px solid rgba(34,197,94,.25)' }}>
          <Icon name="check" size={11} color="#22C55E" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#22C55E' }}>מאומת</span>
        </div>
      )}
    </div>
  );
};
