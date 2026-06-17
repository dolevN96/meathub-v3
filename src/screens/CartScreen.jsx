import { useProducts, useGroups } from '../lib/db';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';

export const CartScreen = ({ onNavigate, cart, onRemove, bp }) => {
  const isDesktop = bp === 'desktop';
  const { data: products } = useProducts();
  const { data: groups } = useGroups();
  // Use pricePerKg stored at add-to-cart time; fall back to live product data
  const subtotal = cart.reduce((s, i) => {
    const pricePerKg = i.pricePerKg ?? (products || []).find(pr => pr.id === i.productId)?.price_group ?? 0;
    return s + pricePerKg * i.qty;
  }, 0);
  const fee = subtotal * 0.06;
  const total = subtotal + fee;

  const goToCheckout = () => onNavigate('checkout');

  return (
    <div className="fade-up">
      {cart.length === 0 ? (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '56px 24px 40px', textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, margin: '0 auto 20px', borderRadius: '50%', background: '#F8F7F5', border: '1px solid rgba(10,7,5,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>🛒</div>
          <h3 style={{ margin: '0 0 8px', color: '#0A0705', fontWeight: 800, fontSize: 20 }}>העגלה שלך ריקה</h3>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#9C8070', lineHeight: 1.6 }}>
            הצטרף לקבוצת קנייה והתחל לחסוך 40–60% על בשר פרימיום ישר מהיבואן
          </p>
          <button onClick={() => onNavigate('catalog')} style={{ padding: '14px 32px', background: '#8B1A1A', color: '#fff', border: 'none', borderRadius: 2, fontFamily: 'Heebo', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 32 }}>
            עבור לקטלוג ←
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
            {[
              { icon: '💰', label: 'חיסכון', value: '40–60%' },
              { icon: '🔒', label: 'חיוב', value: 'בסגירת קבוצה' },
              { icon: '🚚', label: 'איסוף', value: 'נקודה קרובה' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: 2, padding: '14px 8px' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: '#9C8070', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0705' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={isDesktop ? 'desktop-2col' : ''} style={{ gap: 24, alignItems: 'start' }}>
          {/* Left column: cart items */}
          <div style={{ display: 'flex', flexDirection: 'column' }} className="px-mobile">
            {cart.map(item => {
              const p = (products || []).find(pr => pr.id === item.productId);
              const g = (groups || []).find(gr => gr.id === item.groupId);
              const pricePerKg = item.pricePerKg ?? p?.price_group ?? 0;
              const productName = p?.name || 'מוצר';
              const groupLocation = g?.location || '';
              const groupPickup = g?.pickup || '';
              return (
                <div key={item.groupId} style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: 2, padding: '16px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: groupLocation || groupPickup ? 6 : 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0A0705', minWidth: 0 }}>{productName}</div>
                    <button onClick={() => onRemove(item.groupId)} style={{ color: '#9C8070', background: 'none', border: '1px solid #E5E0D8', borderRadius: 2, padding: '4px 10px', fontSize: 12, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>הסר</button>
                  </div>
                  {(groupLocation || groupPickup) && (
                    <div style={{ fontSize: 12, color: '#9C8070', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="map" size={12} color="#9C8070" />
                      {groupLocation}{groupPickup ? ` · ${groupPickup}` : ''}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, color: '#9C8070' }}>{item.qty} ק"ג × ₪{pricePerKg}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 17, color: '#0A0705' }}>₪{(pricePerKg * item.qty).toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right column: order summary sidebar */}
          <div style={{ position: isDesktop ? 'sticky' : 'static', top: 80 }} className="px-mobile">
            <div className="card">
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>סיכום הזמנה</h3>
              <div style={{ borderTop: '1px solid #E5E0D8', marginTop: 16, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#9C8070' }}>מוצרים</span>
                  <span>₪{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: '#9C8070' }}>דמי תפעול (6%)</span>
                  <span>₪{fee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                  <span>סה"כ</span>
                  <span>₪{total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ background: 'transparent', borderRadius: 0, padding: '9px 13px', margin: '16px 0 0', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(10,7,5,.10)' }}>
                <Icon name="lock" size={14} color="#1A5C3A" />
                <span style={{ fontSize: 12, color: '#1A5C3A', fontWeight: 600 }}>חיוב רק לאחר סגירת כל הקבוצות</span>
              </div>
              <button onClick={goToCheckout} style={{ width: '100%', marginTop: 20, padding: '14px', background: '#8B1A1A', color: '#fff', border: 'none', borderRadius: 2, fontFamily: 'Heebo', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                המשך לתשלום ←
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
