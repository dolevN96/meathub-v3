import { useState, useEffect } from 'react';
import { useGroup, useGroupProducts } from '../lib/db';
import { Icon } from '../components/Icon';

function useCountdown(endsAt) {
  const calc = () => {
    if (!endsAt) return '--:--:--';
    const diff = new Date(endsAt) - Date.now();
    if (diff <= 0) return 'הסתיים';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (d > 0) return `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
  };
  const [val, setVal] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setVal(calc()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return val;
}

const FillBar = ({ filled, total }) => {
  const pct = total > 0 ? Math.min(100, (filled / total) * 100) : 0;
  return (
    <div className="fill-bar-wrap">
      <div className="fill-bar-track">
        <div className="fill-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="fill-bar-label">{Number(filled).toFixed(0)} / {total} ק"ג</div>
    </div>
  );
};

const Stepper = ({ qty, onChange, max }) => (
  <div className="stepper">
    <button
      onClick={() => onChange(Math.max(1, qty - 1))}
      disabled={qty <= 1}
      style={{ opacity: qty <= 1 ? 0.4 : 1, cursor: qty <= 1 ? 'not-allowed' : 'pointer' }}
    >−</button>
    <div className="stepper-val">{qty}</div>
    <button onClick={() => onChange(Math.min(max || 20, qty + 1))}>+</button>
  </div>
);

const SkeletonRow = () => (
  <tr>
    {[40, 160, 90, 70, 50, 80, 110, 100].map((w, i) => (
      <td key={i}><div className="shimmer" style={{ height: 13, width: w, borderRadius: 0 }} /></td>
    ))}
  </tr>
);

const CutRow = ({ gp, groupId, cart, onAddToCart }) => {
  const product = gp.product;
  const importer = product?.importer;
  const available = (gp.target_kg || 0) - (gp.filled_kg || 0);
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);

  if (!product) return null;

  const cartItem = cart?.find(i => i.groupId === groupId && i.productId === product.id);
  const inCart = !!cartItem;

  const saving = product.price_retail > product.price_group
    ? Math.round((1 - product.price_group / product.price_retail) * 100)
    : null;

  const handleAdd = () => {
    if (inCart) return;
    // Stock (filled_kg) is only committed on the server once payment succeeds
    // (see checkout_cart RPC) — adding to the cart must not fake-fill the bar
    // here, or it gets reverted on the next refetch and looks like data loss.
    onAddToCart({ groupId, productId: product.id, qty, pricePerKg: product.price_group });
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  return (
    <tr className={flash ? 'row-flash' : ''}>
      {/* # */}
      <td>
        <span className="cut-num">{product.cut_number || '—'}</span>
      </td>

      {/* שם נתח */}
      <td>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', lineHeight: 1.3 }}>
          {product.name}
        </div>
        {product.name_en && (
          <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{product.name_en}</div>
        )}
      </td>

      {/* מגדל */}
      <td>
        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{product.producer || '—'}</div>
        <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{product.origin_country}</div>
      </td>

      {/* יבואן */}
      <td>
        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{importer?.name || '—'}</div>
      </td>

      {/* BMS */}
      <td>
        {product.marbling_score ? (
          <span className="bms-badge">BMS {product.marbling_score}</span>
        ) : <span style={{ color: 'var(--ink-3)' }}>—</span>}
      </td>

      {/* מחיר קבוצה / קמעונאי / חסכון */}
      <td style={{ whiteSpace: 'nowrap' }}>
        <span className="price-group">₪{product.price_group}</span>
        {product.price_retail > product.price_group && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBlockStart: 2 }}>
            <span className="price-retail">₪{product.price_retail}</span>
            {saving && <span className="discount-badge">-{saving}%</span>}
          </div>
        )}
      </td>

      {/* fill bar */}
      <td>
        <FillBar filled={gp.filled_kg || 0} total={gp.target_kg || 0} />
      </td>

      {/* כמות + הוסף */}
      <td style={{ whiteSpace: 'nowrap' }}>
        {inCart ? (
          <span className="btn-in-cart">✓ {cartItem.qty} ק"ג</span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Stepper qty={qty} onChange={setQty} max={Math.floor(available)} />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAdd}
              disabled={available <= 0}
              title={available <= 0 ? 'אין מלאי זמין' : ''}
            >
              הוסף
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export const GroupViewScreen = ({ onNavigate, groupId, onAddToCart, cart, bp }) => {
  const { data: group, isLoading: gl, isError: ge, refetch: rg } = useGroup(groupId);
  const { data: groupProducts, isLoading: pl, isError: pe, refetch: rp } = useGroupProducts(groupId);
  const countdown = useCountdown(group?.ends_at);

  const isLoading = gl || pl;
  const isError = ge || pe;

  if (isError) return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBlockEnd: 12 }}>שגיאה בטעינת הנתונים</div>
      <button className="btn btn-outline" onClick={() => { rg(); rp(); }}>נסה שוב</button>
    </div>
  );

  const branch = group?.branch;

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        paddingBlock: '20px 16px',
        borderBottom: '2px solid var(--ink)',
        marginBlockEnd: 0,
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => onNavigate('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink)', fontWeight: 600, fontSize: 13, padding: 0, flexShrink: 0 }}
        >
          <Icon name="back" size={16} color="var(--ink)" />חזרה
        </button>
        <div style={{ width: 1, height: 16, background: 'var(--border-md)', flexShrink: 0 }} />

        {isLoading ? (
          <div className="shimmer" style={{ height: 18, width: 200, borderRadius: 0 }} />
        ) : (
          <>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)', flex: 1, minWidth: 0 }}>
              {group?.title}
            </div>
            {branch && (
              <div style={{ fontSize: 12, color: 'var(--ink-3)', flexShrink: 0 }}>
                {branch.name} · {branch.city}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>נותרו</span>
              <span className="countdown">{countdown}</span>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="trading-desk">
          <thead>
            <tr>
              <th>#</th>
              <th>נתח</th>
              <th>מגדל / מקור</th>
              <th>יבואן</th>
              <th>BMS</th>
              <th>מחיר</th>
              <th>מלאי</th>
              <th>הזמנה</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
            ) : !groupProducts || groupProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-3)', fontSize: 14 }}>
                  אין נתחים זמינים לאירוע זה
                </td>
              </tr>
            ) : (
              [...groupProducts]
                .sort((a, b) => (a.product?.cut_number || 99) - (b.product?.cut_number || 99))
                .map(gp => (
                  <CutRow
                    key={gp.id}
                    gp={gp}
                    groupId={groupId}
                    cart={cart}
                    onAddToCart={onAddToCart}
                  />
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
