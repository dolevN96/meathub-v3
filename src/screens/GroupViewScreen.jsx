import { useState, useEffect } from 'react';
import { PRODUCTS, GROUPS, IMPORTERS } from '../data';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { GradeBadge } from '../components/GradeBadge';
import { LiveProgressBar } from '../components/LiveProgressBar';
import { CountdownTimer } from '../components/CountdownTimer';
import { ImporterCard } from '../components/ImporterCard';

export const GroupViewScreen = ({ onNavigate, groupId, onAddToCart, cart, bp }) => {
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);
  const group = GROUPS.find(g => g.id === groupId) || GROUPS[0];
  const product = PRODUCTS.find(p => p.id === group.productId);
  const [filled, setFilled] = useState(group.filledKg);
  const inCart = cart.some(i => i.groupId === group.id);
  const isDesktop = bp === 'desktop';

  useEffect(() => {
    const t = setInterval(() => {
      setFilled(f => f < group.totalKg ? +(f + (Math.random() * .3)).toFixed(1) : f);
    }, 8000);
    return () => clearInterval(t);
  }, [group]);

  const pct = Math.min(100, Math.round((filled / group.totalKg) * 100));
  const saving = Math.round((1 - product.priceGroup / product.priceRetail) * 100);
  const total = (product.priceGroup * qty).toFixed(0);

  const handleJoin = () => {
    if (inCart) { onNavigate('cart'); return; }
    onAddToCart({ groupId: group.id, productId: product.id, qty, pricePerKg: product.priceGroup });
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const Details = () => (
    <>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: '#7A5F50', marginBottom: 4 }}>מחיר קבוצה</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 900, fontSize: 30, color: '#E8361A' }}>₪{product.priceGroup}</span>
            <span style={{ fontSize: 14, color: '#7A5F50', textDecoration: 'line-through' }}>₪{product.priceRetail}</span>
          </div>
          <div style={{ fontSize: 11, color: '#7A5F50' }}>לק"ג · כולל מע"מ</div>
        </div>
        <div style={{ background: 'rgba(232,54,26,.12)', borderRadius: 12, padding: '10px 18px', textAlign: 'center', border: '1px solid rgba(232,54,26,.25)' }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#E8361A' }}>-{saving}%</div>
          <div style={{ fontSize: 11, color: '#7A5F50' }}>חיסכון</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#F5EDE4' }}>מצב מילוי הקבוצה</div>
          <CountdownTimer endsAt={group.endsAt} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }} />
              <span style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)', color: '#22C55E', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, letterSpacing: 1 }}>LIVE</span>
              <span style={{ color: '#7A5F50', fontSize: 12 }}>{filled.toFixed(1)} / {group.totalKg} ק"ג</span>
            </div>
            <span style={{ color: '#E8361A', fontWeight: 900, fontSize: 18 }}>{pct}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 999, height: 14, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#B82A12,#E8361A)', borderRadius: 999, transition: 'width 1.5s cubic-bezier(0.23,1,0.32,1)', position: 'relative', overflow: 'hidden', boxShadow: '0 0 16px rgba(232,54,26,.6)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(255,255,255,.1) 8px,rgba(255,255,255,.1) 16px)', animation: 'stripes 1s linear infinite' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            {group.avatars.map((a, i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: ['#B82A12', '#F0C060', '#8B2210', '#7A4010', '#22C55E'][i % 5], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, border: '2px solid #0D0908', marginRight: i > 0 ? -8 : 0, zIndex: 10 - i }}>{a}</div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#7A5F50' }}><strong style={{ color: '#C4A990' }}>{group.participants}</strong> משתתפים</span>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        {[{ icon: 'map', label: 'נקודת איסוף', val: group.location }, { icon: 'clock', label: 'מועד איסוף', val: group.pickup }].map(r => (
          <div key={r.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name={r.icon} size={20} color="#E8361A" />
            <div><div style={{ fontSize: 11, color: '#7A5F50' }}>{r.label}</div><div style={{ fontWeight: 700, fontSize: 14, color: '#F5EDE4' }}>{r.val}</div></div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}><ImporterCard importerId={group.importer} /></div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#F5EDE4' }}>כמות (ק"ג)</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', overflow: 'hidden' }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="minus" size={18} color="#E8361A" /></button>
            <div style={{ width: 50, textAlign: 'center', fontWeight: 800, fontSize: 18, color: '#F5EDE4' }}>{qty}</div>
            <button onClick={() => setQty(q => Math.min(20, q + 1))} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="plus" size={18} color="#E8361A" /></button>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: '#7A5F50' }}>סה"כ</div>
            <div style={{ fontWeight: 900, fontSize: 26, color: '#E8361A' }}>₪{total}</div>
            <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>חיסכון ₪{((product.priceRetail - product.priceGroup) * qty).toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(34,197,94,.06)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(34,197,94,.2)', marginBottom: isDesktop ? 0 : 80 }}>
        <Icon name="lock" size={16} color="#22C55E" />
        <span style={{ fontSize: 12, color: '#C4A990' }}>החיוב מבוצע <strong style={{ color: '#22C55E' }}>רק לאחר סגירת הקבוצה</strong>. ביטול חינם עד 24 שעות.</span>
      </div>
    </>
  );

  return (
    <div className="fade-up">
      {toast && (
        <div style={{ position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)', background: '#22C55E', color: '#fff', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14, zIndex: 300, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(34,197,94,.4)', whiteSpace: 'nowrap' }}>
          <Icon name="check" size={18} color="#fff" />הצטרפת לקבוצה!
        </div>
      )}

      <div style={{ height: isDesktop ? 260 : 200, background: `linear-gradient(160deg,${product.color1},${product.color2})`, borderRadius: isDesktop ? 16 : 0, marginBottom: 20, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.03) 30px,rgba(255,255,255,.03) 60px)' }} />
        <div style={{ position: 'absolute', top: 16, right: 16 }}><GradeBadge grade={product.grade} size="lg" /></div>
        {isDesktop && <button onClick={() => onNavigate('catalog')} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 10, padding: '8px 14px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(8px)' }}><Icon name="back" size={16} color="#fff" />חזרה</button>}
        <div style={{ position: 'relative' }}>
          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, marginBottom: 4 }}>{IMPORTERS.find(i => i.id === group.importer)?.name} · {IMPORTERS.find(i => i.id === group.importer)?.origin}</div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: isDesktop ? 28 : 22, marginBottom: 6 }}>{product.name}</div>
          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 13 }}>{product.description}</div>
        </div>
      </div>

      {isDesktop ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <Details />
          <div style={{ position: 'sticky', top: 16 }}>
            <div className="card">
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, color: '#F5EDE4' }}>הצטרף לקבוצה</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 900, fontSize: 28, color: '#E8361A' }}>₪{total}</span>
                <span style={{ background: 'rgba(232,54,26,.15)', color: '#E8361A', fontWeight: 800, fontSize: 14, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(232,54,26,.3)' }}>-{saving}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="minus" size={16} color="#E8361A" /></button>
                  <div style={{ width: 44, textAlign: 'center', fontWeight: 800, fontSize: 16, color: '#F5EDE4' }}>{qty}</div>
                  <button onClick={() => setQty(q => Math.min(20, q + 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="plus" size={16} color="#E8361A" /></button>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#7A5F50' }}>{qty} ק"ג</span>
              </div>
              <Btn full size="lg" onClick={handleJoin}>{inCart ? '← עבור לעגלה' : `הצטרף · ₪${total}`}</Btn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                <Icon name="lock" size={13} color="#7A5F50" /><span style={{ fontSize: 11, color: '#7A5F50' }}>חיוב רק לאחר סגירת הקבוצה</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: '0 16px' }}><Details /></div>
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(13,9,8,.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,.1)', padding: '12px 16px', zIndex: 99 }}>
            <Btn full size="lg" onClick={handleJoin} style={{ fontSize: 17 }}>{inCart ? '← עבור לעגלה' : `הצטרף · ₪${total}`}</Btn>
          </div>
        </>
      )}
    </div>
  );
};
