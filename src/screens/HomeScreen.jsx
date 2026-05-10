import { PRODUCTS, GROUPS, CATEGORIES } from '../data';
import { Icon } from '../components/Icon';
import { Tag } from '../components/Tag';
import { GradeBadge } from '../components/GradeBadge';
import { ProductCard } from '../components/ProductCard';
import { LiveProgressBar } from '../components/LiveProgressBar';
import { CountdownTimer } from '../components/CountdownTimer';

export const HomeScreen = ({ onNavigate, cart, bp }) => {
  const hero = GROUPS[0];
  const hp = PRODUCTS.find(p => p.id === hero.productId);
  const isDesktop = bp === 'desktop';

  return (
    <div className="fade-up">
      <div className="page-hero" onClick={() => onNavigate('group', { groupId: hero.id })} style={{ cursor: 'pointer' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 999, padding: '5px 12px', marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }} />
                <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>קבוצה פעילה עכשיו</span>
              </div>
              <div style={{ color: '#F5EDE4', fontWeight: 900, fontSize: isDesktop ? 28 : 22, lineHeight: 1.25, marginBottom: 6 }}>{hero.title}</div>
              <div style={{ color: '#C4A990', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="map" size={13} color="#7A5F50" />{hero.location} · {hero.pickup}
              </div>
            </div>
            <CountdownTimer endsAt={hero.endsAt} />
          </div>
          <div style={{ maxWidth: 480, marginBottom: 16 }}>
            <LiveProgressBar filled={hero.filledKg} total={hero.totalKg} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {hero.avatars.map((a, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: ['#B82A12', '#F0C060', '#8B2210', '#7A4010', '#22C55E'][i % 5], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, border: '2px solid #0D0908', marginRight: i > 0 ? -9 : 0, zIndex: 10 - i }}>{a}</div>
              ))}
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4A990', fontSize: 9, fontWeight: 700, border: '2px solid #0D0908', marginRight: -9 }}>+{hero.participants}</div>
            </div>
            <div style={{ background: '#F0C060', color: '#0D0908', fontWeight: 800, fontSize: 14, padding: '9px 22px', borderRadius: 12 }}>הצטרף עכשיו →</div>
          </div>
        </div>
      </div>

      <div className={isDesktop ? 'desktop-2col' : ''} style={{ gap: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }} className="px-mobile">
            <div className="section-title" style={{ marginBottom: 0 }}>קטלוג נתחים</div>
            <button onClick={() => onNavigate('catalog')} style={{ background: 'none', border: 'none', color: '#E8361A', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>הצג הכל</button>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 16 }} className="px-mobile">
            {CATEGORIES.slice(0, 6).map(c => <Tag key={c} active={c === 'הכל'} onClick={() => onNavigate('catalog', { category: c })}>{c}</Tag>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }} className="home-product-grid px-mobile">
            {PRODUCTS.slice(0, isDesktop ? 6 : 4).map(p => (
              <ProductCard key={p.id} product={p} onPress={() => onNavigate('group', { groupId: GROUPS.find(g => g.productId === p.id)?.id || GROUPS[0].id })} />
            ))}
          </div>
        </div>

        <div>
          <div className="section-title px-mobile" style={{ marginTop: isDesktop ? 0 : 24 }}>קבוצות פעילות</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="px-mobile">
            {GROUPS.map(g => {
              const p = PRODUCTS.find(pr => pr.id === g.productId);
              return (
                <div key={g.id} onClick={() => onNavigate('group', { groupId: g.id })}
                  style={{ background: '#1A100C', border: '1px solid rgba(240,192,96,.1)', borderRadius: 14, padding: 14, cursor: 'pointer', display: 'flex', gap: 12, transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,54,26,.35)'; e.currentTarget.style.background = '#211510'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,192,96,.1)'; e.currentTarget.style.background = '#1A100C'; }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 11, background: `linear-gradient(135deg,${p.color1},${p.color2})`, flexShrink: 0, display: 'flex', alignItems: 'flex-end', padding: 4 }}>
                    <GradeBadge grade={p.grade} size="sm" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#F5EDE4' }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: '#7A5F50', marginBottom: 6 }}>{g.location} · {g.pickup}</div>
                    <LiveProgressBar filled={g.filledKg} total={g.totalKg} showLabel={false} compact />
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: '#E8361A' }}>₪{p.priceGroup}</div>
                    <div style={{ fontSize: 10, color: '#7A5F50' }}>לק"ג</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
