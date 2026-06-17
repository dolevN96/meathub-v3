import { useState, useEffect } from 'react';
import { useGroups } from '../lib/db';

function useCountdown(endsAt) {
  const calc = () => {
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

const REGION_ORDER = ['מרכז/גוש דן', 'שרון', 'צפון', 'ירושלים', 'דרום'];

function groupByRegion(groups) {
  const map = {};
  groups.forEach(g => {
    const r = g.branch?.region || 'אחר';
    if (!map[r]) map[r] = [];
    map[r].push(g);
  });
  const sorted = {};
  [...REGION_ORDER, ...Object.keys(map).filter(r => !REGION_ORDER.includes(r))].forEach(r => {
    if (map[r]) sorted[r] = map[r];
  });
  return sorted;
}

const SkeletonRow = () => (
  <tr>
    <td><div className="shimmer" style={{ height: 14, width: 120, borderRadius: 0 }} /></td>
    <td><div className="shimmer" style={{ height: 14, width: 80, borderRadius: 0 }} /></td>
    <td><div className="shimmer" style={{ height: 14, width: 70, borderRadius: 0 }} /></td>
    <td><div className="shimmer" style={{ height: 14, width: 80, borderRadius: 0 }} /></td>
    <td><div className="shimmer" style={{ height: 28, width: 90, borderRadius: 2 }} /></td>
  </tr>
);

const EventRow = ({ group, onNavigate }) => {
  const countdown = useCountdown(group.ends_at);
  const branch = group.branch;
  return (
    <tr className="event-row" onClick={() => onNavigate('group', { groupId: group.id })}>
      <td>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', lineHeight: 1.3 }}>
          {group.title}
        </div>
        {group.title_en && (
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBlockStart: 2 }}>{group.title_en}</div>
        )}
      </td>
      <td>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>{branch?.name || '—'}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{branch?.city}</div>
      </td>
      <td>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{branch?.opening_hours || '—'}</div>
      </td>
      <td>
        <span className="countdown">{countdown}</span>
      </td>
      <td style={{ textAlign: 'left' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={e => { e.stopPropagation(); onNavigate('group', { groupId: group.id }); }}
        >
          כניסה ←
        </button>
      </td>
    </tr>
  );
};

export const HomeScreen = ({ onNavigate, cart, bp }) => {
  const { data: groups, isLoading, isError, refetch } = useGroups();

  const byRegion = groups ? groupByRegion(groups) : {};
  const totalActive = groups?.length || 0;

  return (
    <div className="fade-up">
      {/* Page header */}
      <div className="page-header" style={{ marginBlockEnd: 24 }}>
        <div className="label">MEATHUB — קבוצות רכישה</div>
        <h1>אירועי משלוח פעילים</h1>
        {!isLoading && !isError && (
          <div className="sub">{totalActive} אירועים פתוחים להזמנה</div>
        )}
      </div>

      {isError ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBlockEnd: 12 }}>שגיאה בטעינת הנתונים</div>
          <button className="btn btn-outline" onClick={() => refetch()}>נסה שוב</button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>אירוע</th>
                <th>סניף</th>
                <th>שעות איסוף</th>
                <th>נותרו</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                </>
              ) : totalActive === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-3)', fontSize: 14 }}>
                    אין אירועי משלוח פעילים כרגע
                  </td>
                </tr>
              ) : (
                Object.entries(byRegion).map(([region, regionGroups]) => (
                  <>
                    <tr key={`r-${region}`} className="region-header">
                      <td colSpan={5}>{region}</td>
                    </tr>
                    {regionGroups.map(group => (
                      <EventRow key={group.id} group={group} onNavigate={onNavigate} />
                    ))}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
