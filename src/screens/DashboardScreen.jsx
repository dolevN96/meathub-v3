import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';

const formatHebrewDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
};

const statusLabel = (status) => {
  const map = { pending: 'ממתין', confirmed: 'מאושר', collected: 'נאסף', completed: 'הושלם', cancelled: 'בוטל', open: 'פתוח', active: 'פעיל' };
  return map[status] || status;
};

const StatusChip = ({ status }) => {
  const statusClass = {
    pending: 'pending',
    confirmed: 'confirmed',
    active: 'active',
    collected: 'collected',
    completed: 'completed',
    cancelled: 'cancelled',
    open: 'open',
  }[status] || 'pending';

  return (
    <span className={`status-badge ${statusClass}`}>
      {statusLabel(status)}
    </span>
  );
};

const PickupCode = ({ code }) => (
  <div>
    <div className="pickup-code">
      {code}
    </div>
    <div style={{ fontSize: 12, color: '#9C8070', textAlign: 'center', marginBottom: 16 }}>
      הצג קוד זה בנקודת האיסוף
    </div>
  </div>
);

const OrderCard = ({ order, isActive }) => {
  const items = order.order_items || [];
  const totalKg = items.reduce((s, i) => s + (i.kg || 0), 0);

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(10,7,5,.14)', borderRadius: 0, marginBottom: 16 }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(10,7,5,.08)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: '#9C8070', letterSpacing: '0.05em' }}>
            #{order.id?.slice(0, 8).toUpperCase()}
          </div>
          <div style={{ fontSize: 13, color: '#4A3728', marginTop: 2 }}>
            {formatHebrewDate(order.created_at)}
          </div>
        </div>
        <StatusChip status={order.status} />
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Pickup code for active orders */}
        {isActive && order.pickup_code && (
          <PickupCode code={order.pickup_code} />
        )}

        {/* Branch info for active orders */}
        {isActive && order.branch_name && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16, padding: '10px 14px', border: '1px solid rgba(10,7,5,.08)', background: '#F8F7F5' }}>
            <Icon name="map" size={14} color="#9C8070" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0A0705' }}>{order.branch_name}</div>
              {order.branch_address && <div style={{ fontSize: 12, color: '#9C8070', marginTop: 1 }}>{order.branch_address}</div>}
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {items.map((item, idx) => {
            const name = item.product?.name || 'מוצר';
            const gradeLabel = item.product?.grade_label || '';
            return (
              <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#0A0705' }}>{name}</span>
                  {gradeLabel && <span style={{ marginInlineStart: 6, fontFamily: "'Courier New', monospace", fontSize: 10, background: '#0A0705', color: '#FFFFFF', padding: '1px 5px', letterSpacing: '0.06em' }}>{gradeLabel}</span>}
                </div>
                <div style={{ color: '#4A3728', fontFamily: "'Courier New', monospace", fontSize: 12 }}>
                  {Number(item.kg || 0).toFixed(1)} ק"ג · ₪{Number(item.total || 0).toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(10,7,5,.08)', marginBottom: 12 }} />

        {/* Totals row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#9C8070' }}>{Number(totalKg).toFixed(1)} ק"ג סה"כ</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 17, color: '#0A0705' }}>
            ₪{Number(order.total_amount || 0).toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCardSkeleton = () => (
  <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: 2, padding: 20, marginBottom: 12 }}>
    <div className="skeleton-cell" style={{ width: 120, height: 14, marginBottom: 10 }} />
    <div className="skeleton-cell" style={{ width: '80%', height: 12, marginBottom: 8 }} />
    <div className="skeleton-cell" style={{ width: '60%', height: 12 }} />
  </div>
);

export const DashboardScreen = ({ onNavigate, user, bp, onLogout }) => {
  const [tab, setTab] = useState('active');
  const isDesktop = bp === 'desktop';
  const displayName = user?.name || 'משתמש';

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(name, grade_label))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const now = new Date();
  const activeOrders = (ordersData || []).filter(o => ['pending', 'confirmed', 'open', 'active'].includes(o.status));
  const pastOrders = (ordersData || []).filter(o => !['pending', 'confirmed', 'open', 'active'].includes(o.status));

  const totalOrders = (ordersData || []).length;
  const totalKg = (ordersData || []).reduce((sum, o) => sum + (o.order_items || []).reduce((s, i) => s + (i.kg || 0), 0), 0);

  return (
    <div className="fade-up">
      {/* Profile header */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid rgba(10,7,5,.14)',
        borderRadius: 0,
        padding: isDesktop ? '28px 28px 24px' : '24px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#8B1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20, flexShrink: 0 }}>
          {displayName.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#9C8070', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>שלום,</div>
          <div style={{ color: '#0A0705', fontWeight: 800, fontSize: 20 }}>{displayName}</div>
          {user?.email && <div style={{ color: '#9C8070', fontSize: 12, marginTop: 1 }}>{user.email}</div>}
        </div>
        <button
          onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(139,26,26,.30)', borderRadius: 2, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, color: '#8B1A1A', flexShrink: 0 }}
        >
          <Icon name="logout" size={15} color="#8B1A1A" />התנתק
        </button>
      </div>

      <div className="px-mobile">
        {/* Stats */}
        {isLoading ? (
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div className="skeleton-cell" style={{ width: 80, height: 40, borderRadius: 2 }} />
            <div className="skeleton-cell" style={{ width: 80, height: 40, borderRadius: 2 }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 0, border: '1px solid rgba(10,7,5,.14)', marginBottom: 24 }}>
            {[
              { l: 'הזמנות', v: totalOrders },
              { l: 'ק"ג שנרכשו', v: totalKg % 1 === 0 ? totalKg : totalKg.toFixed(1) },
            ].map((s, i) => (
              <div key={s.l} style={{ textAlign: 'center', padding: '20px 16px', borderInlineStart: i > 0 ? '1px solid rgba(10,7,5,.14)' : 'none' }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 28, color: '#8B1A1A', marginBottom: 4 }}>{s.v}</div>
                <div style={{ fontSize: 12, color: '#9C8070' }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(10,7,5,.14)', marginBottom: 20 }}>
          {[{ k: 'active', l: 'משלוחים פעילים' }, { k: 'history', l: 'משלוחים שהסתיימו' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              flex: 1, height: 44, border: 'none', borderBottom: tab === t.k ? '2px solid #8B1A1A' : '2px solid transparent',
              background: 'none', color: tab === t.k ? '#8B1A1A' : '#9C8070',
              fontWeight: tab === t.k ? 700 : 500, fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'color 150ms ease, border-color 150ms ease',
              marginBottom: -1,
            }}>{t.l}</button>
          ))}
        </div>

        {/* Active orders tab */}
        {tab === 'active' && (
          isLoading ? (
            <>
              <OrderCardSkeleton />
              <OrderCardSkeleton />
              <OrderCardSkeleton />
            </>
          ) : activeOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 48, height: 48, border: '1px solid rgba(10,7,5,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name="cart" size={22} color="#9C8070" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0A0705', marginBottom: 6 }}>אין משלוחים פעילים</div>
              <div style={{ fontSize: 13, color: '#9C8070', marginBottom: 20, maxWidth: 240 }}>גלה קבוצות פעילות והוסף נתחים לעגלה</div>
              <Btn onClick={() => onNavigate('groups')} size="sm">צפה בקבוצות פעילות</Btn>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: 16 }}>
              {activeOrders.map(o => <OrderCard key={o.id} order={o} isActive />)}
            </div>
          )
        )}

        {/* Past orders tab */}
        {tab === 'history' && (
          isLoading ? (
            <>
              <OrderCardSkeleton />
              <OrderCardSkeleton />
              <OrderCardSkeleton />
            </>
          ) : pastOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 48, height: 48, border: '1px solid rgba(10,7,5,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name="cart" size={22} color="#9C8070" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0A0705', marginBottom: 6 }}>עדיין אין הזמנות שהסתיימו</div>
              <div style={{ fontSize: 13, color: '#9C8070', marginBottom: 20, maxWidth: 240 }}>הצטרף לקבוצה ותתחיל לחסוך!</div>
              <Btn onClick={() => onNavigate('groups')} size="sm">גלה קבוצות פעילות</Btn>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: 16 }}>
              {pastOrders.map(o => <OrderCard key={o.id} order={o} isActive={false} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
};
