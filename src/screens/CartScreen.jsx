import { PRODUCTS, GROUPS } from '../data';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { GradeBadge } from '../components/GradeBadge';

export const CartScreen = ({ onNavigate, cart, onRemove, bp }) => {
  const isDesktop = bp === 'desktop';
  const total = cart.reduce((s, i) => {
    const p = PRODUCTS.find(pr => pr.id === i.productId);
    return s + (p ? p.priceGroup * i.qty : 0);
  }, 0);

  return (
    <div className="fade-up">
      {cart.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(140,88,89,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid rgba(140,88,89,.18)' }}><Icon name="cart" size={36} color="#8C6B5A" /></div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: '#1E0E0E' }}>העגלה ריקה</div>
          <div style={{ fontSize: 14, color: '#8C6B5A', marginBottom: 24 }}>הצטרף לקבוצת רכישה כדי להתחיל</div>
          <Btn onClick={() => onNavigate('catalog')}>גלה קבוצות פעילות</Btn>
        </div>
      ) : (
        <div className={isDesktop ? 'desktop-2col' : ''} style={{ gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="px-mobile">
            {cart.map(item => {
              const p = PRODUCTS.find(pr => pr.id === item.productId);
              const g = GROUPS.find(gr => gr.id === item.groupId);
              if (!p || !g) return null;
              return (
                <div key={item.groupId} style={{ background: '#EFF6D9', border: '1px solid rgba(140,88,89,.18)', borderRadius: 16, padding: 16, display: 'flex', gap: 14 }}>
                  <div style={{ width: 65, height: 65, borderRadius: 13, background: `linear-gradient(135deg,${p.color1},${p.color2})`, flexShrink: 0, display: 'flex', alignItems: 'flex-end', padding: 5 }}><GradeBadge grade={p.grade} size="sm" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3, color: '#1E0E0E' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#8C6B5A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map" size={12} color="#8C6B5A" />{g.location} · {g.pickup}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <span style={{ fontWeight: 900, fontSize: 17, color: '#8C5859' }}>₪{(p.priceGroup * item.qty).toFixed(0)}</span>
                        <span style={{ fontSize: 12, color: '#8C6B5A', marginRight: 6 }}>{item.qty} ק"ג × ₪{p.priceGroup}</span>
                      </div>
                      <button onClick={() => onRemove(item.groupId)} style={{ background: 'none', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '4px 12px', color: '#EF4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>הסר</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: isDesktop ? 'sticky' : 'static', top: 16 }} className="px-mobile">
            <div className="card">
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: '#1E0E0E' }}>סיכום הזמנה</div>
              {[{ l: 'סכום ביניים', v: `₪${total.toFixed(0)}` }, { l: 'עמלת תפעול (6%)', v: `₪${(total * .06).toFixed(0)}` }].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#8C6B5A', fontSize: 14 }}>{r.l}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#5C3535' }}>{r.v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(140,88,89,.10)', margin: '14px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#1E0E0E' }}>סה"כ</span>
                <span style={{ fontWeight: 900, fontSize: 20, color: '#8C5859' }}>₪{(total * 1.06).toFixed(0)}</span>
              </div>
              <div style={{ background: 'rgba(34,197,94,.08)', borderRadius: 9, padding: '9px 13px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(34,197,94,.2)' }}>
                <Icon name="lock" size={14} color="#22C55E" />
                <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>חיוב רק לאחר סגירת כל הקבוצות</span>
              </div>
              <Btn full size="lg" onClick={() => onNavigate('checkout')}>המשך לתשלום →</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
