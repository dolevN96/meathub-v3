import { IMPORTERS } from '../data';
import { Icon } from './Icon';

export const ImporterCard = ({ importerId }) => {
  const imp = IMPORTERS.find(i => i.id === importerId);
  if (!imp) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#EFF6D9', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(140,88,89,.18)' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#8C5859,#6E3F40)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{imp.logo}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1E0E0E' }}>{imp.name}</div>
        <div style={{ fontSize: 11, color: '#8C6B5A', display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map" size={11} color="#8C6B5A" />{imp.origin}</div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="star" size={13} color="#C9A44A" /><span style={{ fontWeight: 700, fontSize: 13, color: '#1E0E0E' }}>{imp.rating}</span></div>
        <div style={{ fontSize: 10, color: '#8C6B5A' }}>{imp.reviews} ביקורות</div>
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
