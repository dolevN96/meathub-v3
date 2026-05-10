import { useState } from 'react';
import { PRODUCTS, GROUPS } from '../data';
import { Icon } from '../components/Icon';
import { LiveProgressBar } from '../components/LiveProgressBar';
import { CountdownTimer } from '../components/CountdownTimer';

export const DashboardScreen = ({ onNavigate, user, bp }) => {
  const [tab, setTab] = useState('active');
  const isDesktop = bp === 'desktop';
  const displayName = user?.name || 'משתמש';
  const activeOrders = [{ id: 'o1', groupId: 'g1', productId: 'p1', qty: 2 }, { id: 'o2', groupId: 'g2', productId: 'p2', qty: 1 }];
  const pastOrders = [{ id: 'o3', productId: 'p3', qty: 3, date: '28.4.25', total: 267 }, { id: 'o4', productId: 'p4', qty: 1.5, date: '12.4.25', total: 208 }, { id: 'o5', productId: 'p5', qty: 1, date: '3.4.25', total: 280 }];

  return (
    <div className="fade-up">
      <div style={{ background: 'linear-gradient(160deg,#1E0A06,#0D0908)', border: '1px solid rgba(232,54,26,.15)', borderRadius: isDesktop ? 16 : 0, padding: isDesktop ? '28px 28px 24px' : '32px 20px 24px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 20% 50%,rgba(232,54,26,.12),transparent)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#E8361A,#F0C060)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 22, border: '2px solid rgba(255,255,255,.15)', boxShadow: '0 4px 20px rgba(232,54,26,.4)' }}>{displayName.charAt(0)}</div>
          <div>
            <div style={{ color: '#7A5F50', fontSize: 12 }}>שלום,</div>
            <div style={{ color: '#F5EDE4', fontWeight: 800, fontSize: 20 }}>{displayName}</div>
            {user?.email && <div style={{ color: '#7A5F50', fontSize: 12, marginTop: 1 }}>{user.email}</div>}
          </div>
        </div>
      </div>

      <div className="px-mobile">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          {[{ l: 'הזמנות', v: 5 }, { l: 'ק"ג שנרכשו', v: '8.5' }, { l: 'חסכת', v: '₪820' }].map(s => (
            <div key={s.l} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: '#E8361A', marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: '#7A5F50' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {[{ k: 'active', l: 'הזמנות פעילות' }, { k: 'history', l: 'היסטוריה' }, { k: 'qr', l: 'QR איסוף' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, height: 38, borderRadius: 9, border: 'none', background: tab === t.k ? '#E8361A' : 'none', color: tab === t.k ? '#fff' : '#7A5F50', fontWeight: tab === t.k ? 700 : 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s', boxShadow: tab === t.k ? '0 2px 12px rgba(232,54,26,.4)' : 'none' }}>{t.l}</button>
          ))}
        </div>

        {tab === 'active' && (
          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: 12 }}>
            {activeOrders.map(o => {
              const p = PRODUCTS.find(pr => pr.id === o.productId);
              const g = GROUPS.find(gr => gr.id === o.groupId);
              if (!p || !g) return null;
              return (
                <div key={o.id} onClick={() => onNavigate('group', { groupId: g.id })} className="card" style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}>
                  <div style={{ height: 4, background: 'linear-gradient(90deg,#B82A12,#E8361A)' }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg,${p.color1},${p.color2})`, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: '#F5EDE4' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#7A5F50', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }} />
                          מחכה לסגירת קבוצה
                        </div>
                      </div>
                      <CountdownTimer endsAt={g.endsAt} style={{ transform: 'scale(.82)', transformOrigin: 'left center' }} />
                    </div>
                    <LiveProgressBar filled={g.filledKg} total={g.totalKg} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontSize: 12, color: '#7A5F50' }}>{o.qty} ק"ג · {g.location}</span>
                      <span style={{ fontWeight: 800, fontSize: 14, color: '#E8361A' }}>₪{(p.priceGroup * o.qty).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'history' && (
          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: 10 }}>
            {pastOrders.map(o => {
              const p = PRODUCTS.find(pr => pr.id === o.productId);
              if (!p) return null;
              return (
                <div key={o.id} className="card" style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg,${p.color1},${p.color2})`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#F5EDE4' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#7A5F50', marginTop: 2 }}>{o.qty} ק"ג · {o.date}</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#F5EDE4' }}>₪{o.total}</div>
                    <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', color: '#22C55E', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, marginTop: 4 }}>נאסף</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'qr' && (
          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: 12 }}>
            {activeOrders.map(o => {
              const p = PRODUCTS.find(pr => pr.id === o.productId);
              const g = GROUPS.find(gr => gr.id === o.groupId);
              if (!p || !g) return null;
              return (
                <div key={o.id} style={{ background: 'rgba(232,54,26,.05)', borderRadius: 16, padding: 20, textAlign: 'center', border: '2px dashed rgba(232,54,26,.3)' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#F5EDE4' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#7A5F50', marginBottom: 16 }}>{g.location} · {g.pickup}</div>
                  <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: 16, display: 'inline-block', marginBottom: 12 }}>
                    <Icon name="qr" size={72} color="#F5EDE4" />
                  </div>
                  <div style={{ fontSize: 11, color: '#7A5F50', fontWeight: 600 }}>הצג QR זה בנקודת האיסוף</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#E8361A', marginTop: 6, letterSpacing: 2 }}>#{o.id.toUpperCase()}-MH</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
