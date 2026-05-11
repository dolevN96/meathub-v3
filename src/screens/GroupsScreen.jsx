import { PRODUCTS, GROUPS, IMPORTERS } from '../data';
import { Icon } from '../components/Icon';
import { GradeBadge } from '../components/GradeBadge';
import { LiveProgressBar } from '../components/LiveProgressBar';
import { CountdownTimer } from '../components/CountdownTimer';

export const GroupsScreen = ({ onNavigate, bp }) => {
  const isDesktop = bp === 'desktop';

  return (
    <div className="fade-up">
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: 16 }} className="px-mobile">
        {GROUPS.map(g => {
          const p = PRODUCTS.find(pr => pr.id === g.productId);
          const imp = IMPORTERS.find(i => i.id === g.importer);
          return (
            <div key={g.id} onClick={() => onNavigate('group', { groupId: g.id })}
              style={{ background: '#EFF6D9', border: '1px solid rgba(140,88,89,.18)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all .22s cubic-bezier(0.23,1,0.32,1)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(140,88,89,.45)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(140,88,89,.18)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: 90, background: `linear-gradient(135deg,${p.color1},${p.color2})`, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 12px' }}>
                <GradeBadge grade={p.grade} />
                <CountdownTimer endsAt={g.endsAt} style={{ transform: 'scale(.85)', transformOrigin: 'right center' }} />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: '#1E0E0E' }}>{g.title}</div>
                <div style={{ fontSize: 12, color: '#8C6B5A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="map" size={12} color="#8C6B5A" />{g.location} · {g.pickup} · {imp?.name}
                </div>
                <LiveProgressBar filled={g.filledKg} total={g.totalKg} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <div style={{ display: 'flex' }}>
                    {g.avatars.slice(0, 4).map((a, i) => (
                      <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: ['#6E3F40', '#C9A44A', '#8B2210', '#22C55E'][i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 800, border: '2px solid #EEE9D6', marginRight: i > 0 ? -7 : 0 }}>{a}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 900, fontSize: 18, color: '#8C5859' }}>₪{p.priceGroup}</span>
                    <div style={{ background: '#8C5859', color: '#fff', fontWeight: 800, fontSize: 12, padding: '7px 16px', borderRadius: 10 }}>הצטרף</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
