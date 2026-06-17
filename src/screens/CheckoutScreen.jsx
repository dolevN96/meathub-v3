import { useState } from 'react';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts, useGroups } from '../lib/db';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { checkout } from '../lib/orders';
import { useToast } from '../components/Toast';

const Spinner = () => (
  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginLeft: 8 }} />
);

export const CheckoutScreen = ({ onNavigate, cart, onClearCart, bp }) => {
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState('visa');
  const [cardNum, setCardNum] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [pickupCode, setPickupCode] = useState(null);
  const [paidTotal, setPaidTotal] = useState(null);
  const toast = useToast();
  const isDesktop = bp === 'desktop';
  const queryClient = useQueryClient();
  const { data: products } = useProducts();
  const { data: groups } = useGroups();
  const subtotal = cart.reduce((s, i) => {
    const pricePerKg = i.pricePerKg ?? (products || []).find(pr => pr.id === i.productId)?.price_group ?? 0;
    return s + pricePerKg * i.qty;
  }, 0);
  const total = subtotal * 1.06;
  // steps: 0=סיכום, 1=תשלום, 2=אישור (but step 2 renders separately)
  const stepDefs = [{ label: 'סיכום', num: 1 }, { label: 'תשלום', num: 2 }, { label: 'אישור', num: 3 }];

  const handlePay = async () => {
    if (pay === 'visa' && cardNum.replace(/\s/g, '').length < 12) { setErr('נא להזין מספר כרטיס תקין'); return; }
    setErr('');
    setLoading(true);
    try {
      // Enrich each cart item with priceGroup from the local products catalogue
      const enrichedCart = cart.map(item => {
        const pricePerKg = item.pricePerKg ?? (products || []).find(pr => pr.id === item.productId)?.price_group ?? 0;
        return { ...item, priceGroup: pricePerKg };
      });
      const result = await checkout(enrichedCart);
      setOrderId(result.order_id);
      setPaidTotal(result.total ?? total);
      if (result.pickup_code) setPickupCode(result.pickup_code);

      // Refresh everything the order just changed: my order history, and the
      // live fill-level of every group I just bought into.
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      [...new Set(cart.map(i => i.groupId))].forEach(gid => {
        queryClient.invalidateQueries({ queryKey: ['group-products', gid] });
        queryClient.invalidateQueries({ queryKey: ['group', gid] });
      });

      onClearCart && onClearCart();
      toast.success('ההזמנה בוצעה בהצלחה! 🥩');
      setStep(2);
    } catch (e) {
      const msg = e.message || 'אירעה שגיאה, נסה שוב';
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', textAlign: 'center', minHeight: '60vh' }} className="fade-up">
      {/* Check mark */}
      <div style={{ width: 64, height: 64, border: '2px solid #1A5C3A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon name="check" size={32} color="#1A5C3A" />
      </div>
      <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 6, color: '#0A0705' }}>ההזמנה אושרה!</div>
      <div style={{ fontSize: 14, color: '#9C8070', marginBottom: 32 }}>תקבל התראה כשהקבוצה תסגר</div>

      <div style={{ width: '100%', maxWidth: 380, border: '1px solid rgba(10,7,5,.14)', marginBottom: 24, background: '#FFFFFF' }}>
        {/* Order number header */}
        <div style={{ borderBottom: '1px solid rgba(10,7,5,.08)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#9C8070', letterSpacing: '0.04em', textTransform: 'uppercase' }}>מספר הזמנה</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 13, color: '#0A0705', letterSpacing: '0.1em' }}>
            #{orderId ? orderId.slice(0, 8).toUpperCase() : '--------'}
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Pickup code */}
          {pickupCode && (
            <>
              <div style={{ fontSize: 12, color: '#9C8070', marginBottom: 8, textAlign: 'center' }}>קוד איסוף</div>
              <div className="pickup-code">
                {pickupCode}
              </div>
              <div style={{ fontSize: 12, color: '#9C8070', textAlign: 'center', marginBottom: 20 }}>
                שמור את הקוד — תצטרך אותו באיסוף
              </div>
            </>
          )}

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#4A3728' }}>סה"כ שולם</span>
            <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 17, color: '#0A0705' }}>₪{Number(paidTotal ?? 0).toFixed(0)}</span>
          </div>
        </div>
      </div>

      <Btn onClick={() => onNavigate('home')} style={{ minWidth: 200 }}>חזור לדף הבית</Btn>
    </div>
  );

  // Step indicator using CSS classes
  const StepIndicator = () => (
    <div className="checkout-steps">
      {stepDefs.map((s, i) => (
        <React.Fragment key={s.num}>
          {i > 0 && <div className={`checkout-step-line${step > i ? ' done' : ''}`} />}
          <div className={`checkout-step${step === i ? ' active' : step > i ? ' done' : ''}`}>
            <div className="checkout-step-dot">
              {step > i ? '✓' : s.num}
            </div>
            <span className="checkout-step-label">{s.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const inp = { width: '100%', height: 46, borderRadius: 2, border: '1px solid rgba(10,7,5,.14)', background: '#FFFFFF', padding: '0 14px', fontSize: 14, fontFamily: 'inherit', color: '#0A0705', outline: 'none', marginBottom: 12, display: 'block' };

  // Mini order summary for sidebar
  const MiniOrderSummary = () => (
    <div className="card">
      <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>סיכום הזמנה</h3>
      {cart.map(item => {
        const p = (products || []).find(pr => pr.id === item.productId);
        const pricePerKg = item.pricePerKg ?? p?.price_group ?? 0;
        return (
          <div key={item.groupId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#4A3728' }}>{p?.name || 'מוצר'} ({item.qty} ק"ג)</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>₪{(pricePerKg * item.qty).toFixed(0)}</span>
          </div>
        );
      })}
      <div style={{ height: 1, background: 'rgba(10,7,5,.10)', margin: '12px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#9C8070', fontSize: 13 }}>דמי תפעול (6%)</span>
        <span style={{ fontSize: 13 }}>₪{(total - subtotal).toFixed(0)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
        <span>סה"כ</span>
        <span>₪{total.toFixed(0)}</span>
      </div>
    </div>
  );

  return (
    <div className="fade-up">
      <StepIndicator />
      <button onClick={() => step === 0 ? onNavigate('cart') : setStep(0)} className="px-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#4A3728', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '4px 0', marginBottom: 12 }}>
        <Icon name="back" size={16} color="#4A3728" />{step === 0 ? 'חזרה לעגלה' : 'חזרה לסיכום'}
      </button>
      {step === 0 && isDesktop ? (
        // Desktop two-column layout for summary step
        <div className="desktop-2col" style={{ gap: 24, alignItems: 'start' }}>
          <div className="px-mobile">
            {cart.map(item => {
              const p = (products || []).find(pr => pr.id === item.productId);
              const g = (groups || []).find(gr => gr.id === item.groupId);
              const pricePerKg = item.pricePerKg ?? p?.price_group ?? 0;
              return (
                <div key={item.groupId} style={{ marginBottom: 8, display: 'flex', gap: 12, border: '1px solid rgba(10,7,5,.14)', padding: '14px 16px', background: '#FFFFFF' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0A0705' }}>{p?.name || 'מוצר'}</div>
                    <div style={{ fontSize: 12, color: '#9C8070', marginTop: 2 }}>{item.qty} ק"ג{g?.location ? ` · ${g.location}` : ''}</div>
                  </div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 15, color: '#0A0705' }}>₪{(pricePerKg * item.qty).toFixed(0)}</div>
                </div>
              );
            })}
            <Btn full size="lg" onClick={() => setStep(1)}>המשך לתשלום ←</Btn>
          </div>
          <div style={{ position: 'sticky', top: 80 }}>
            <MiniOrderSummary />
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: isDesktop ? 560 : 9999, margin: '0 auto' }} className="px-mobile">
          {step === 0 && (
            <>
              {cart.map(item => {
                const p = (products || []).find(pr => pr.id === item.productId);
                const g = (groups || []).find(gr => gr.id === item.groupId);
                const pricePerKg = item.pricePerKg ?? p?.price_group ?? 0;
                return (
                  <div key={item.groupId} style={{ marginBottom: 8, display: 'flex', gap: 12, border: '1px solid rgba(10,7,5,.14)', padding: '14px 16px', background: '#FFFFFF' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#0A0705' }}>{p?.name || 'מוצר'}</div>
                      <div style={{ fontSize: 12, color: '#9C8070', marginTop: 2 }}>{item.qty} ק"ג{g?.location ? ` · ${g.location}` : ''}</div>
                    </div>
                    <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 15, color: '#0A0705' }}>₪{(pricePerKg * item.qty).toFixed(0)}</div>
                  </div>
                );
              })}
              <div style={{ border: '1px solid rgba(10,7,5,.14)', padding: '16px', marginBottom: 14, background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#9C8070', fontSize: 13 }}>סכום ביניים</span>
                  <span style={{ fontWeight: 600, color: '#4A3728' }}>{subtotal.toFixed(0)}₪</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#9C8070', fontSize: 13 }}>עמלת תפעול (6%)</span>
                  <span style={{ fontWeight: 600, color: '#4A3728' }}>{(total - subtotal).toFixed(0)}₪</span>
                </div>
                <div style={{ height: 1, background: 'rgba(10,7,5,.10)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, color: '#0A0705' }}>סה"כ</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 18, color: '#0A0705' }}>₪{total.toFixed(0)}</span>
                </div>
              </div>
              <Btn full size="lg" onClick={() => setStep(1)}>המשך לתשלום ←</Btn>
            </>
          )}
          {step === 1 && (
            <>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, color: '#0A0705' }}>אמצעי תשלום</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[{ k: 'visa', l: 'כרטיס אשראי', s: 'Visa, Mastercard, Amex', disabled: false }, { k: 'bit', l: 'Bit', s: 'ביט', disabled: true }, { k: 'paybox', l: 'PayBox', s: 'פייבוקס', disabled: true }].map(m => (
                  <div
                    key={m.k}
                    onClick={() => !m.disabled && setPay(m.k)}
                    title={m.k === 'bit' ? 'בקרוב — תשלום דרך Bit' : m.k === 'paybox' ? 'בקרוב — תשלום דרך PayBox' : undefined}
                    style={{ background: '#FFFFFF', borderRadius: 0, padding: '14px 16px', border: `1px solid ${pay === m.k ? '#8B1A1A' : 'rgba(10,7,5,.14)'}`, cursor: m.disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color 150ms ease', opacity: m.disabled ? 0.5 : 1 }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 0, border: `2px solid ${pay === m.k ? '#8B1A1A' : 'rgba(10,7,5,.20)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {pay === m.k && <div style={{ width: 8, height: 8, background: '#8B1A1A' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#0A0705' }}>{m.l}</div>
                      <div style={{ fontSize: 11, color: '#9C8070' }}>{m.s}{m.disabled ? ' — בקרוב' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
              {pay === 'visa' && (
                <div style={{ border: '1px solid rgba(10,7,5,.14)', padding: '16px', marginBottom: 14, background: '#FFFFFF' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#9C8070', display: 'block', marginBottom: 6 }}>מספר כרטיס</label>
                  <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/[^\d\s]/g, '').substring(0, 19))} placeholder="0000 0000 0000 0000" style={{ ...inp, direction: 'ltr', textAlign: 'left', border: `1px solid ${err ? '#8B1A1A' : 'rgba(10,7,5,.14)'}` }} />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#9C8070', display: 'block', marginBottom: 6 }}>תוקף</label>
                      <input value={exp} onChange={e => setExp(e.target.value)} placeholder="MM/YY" style={{ ...inp, direction: 'ltr', textAlign: 'left' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#9C8070', display: 'block', marginBottom: 6 }}>CVV</label>
                      <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="000" style={{ ...inp, direction: 'ltr', textAlign: 'left' }} />
                    </div>
                  </div>
                  {err && <div style={{ color: '#8B1A1A', fontSize: 12 }}>{err}</div>}
                </div>
              )}
              <div style={{ background: 'transparent', borderRadius: 0, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(10,7,5,.10)' }}>
                <Icon name="lock" size={15} color="#1A5C3A" />
                <span style={{ fontSize: 12, color: '#1A5C3A' }}>תשלום מאובטח. חיוב רק לאחר סגירת הקבוצה.</span>
              </div>
              {err && pay !== 'visa' && <div style={{ color: '#8B1A1A', fontSize: 12, marginBottom: 10 }}>{err}</div>}
              <Btn full size="lg" onClick={handlePay} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading && <Spinner />}
                {loading ? 'שולח הזמנה...' : `שלם ₪${total.toFixed(0)}`}
              </Btn>
            </>
          )}
        </div>
      )}
    </div>
  );
};
