import { useState, useEffect } from 'react';
import { useGroups } from '../lib/db';
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

const SkeletonRow = () => (
  <tr>
    <td><div className="shimmer" style={{ height: 14, width: 140, borderRadius: 0 }} /></td>
    <td><div className="shimmer" style={{ height: 13, width: 80, borderRadius: 0 }} /></td>
    <td><div className="shimmer" style={{ height: 13, width: 70, borderRadius: 0 }} /></td>
    <td><div className="shimmer" style={{ height: 28, width: 100, borderRadius: 2 }} /></td>
  </tr>
);

const GroupRow = ({ group, onNavigate }) => {
  const countdown = useCountdown(group.ends_at);
  const branch = group.branch;

  return (
    <tr className="event-row" onClick={() => onNavigate('group', { groupId: group.id })}>
      <td>
        {/* Primary: branch/event name. Secondary: title (importer/producer context) */}
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', lineHeight: 1.3 }}>
          {branch?.name || group.title}
        </div>
        {group.title && group.title !== branch?.name && (
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBlockStart: 2 }}>{group.title}</div>
        )}
      </td>
      <td>
        <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{branch?.city || '—'}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{branch?.address}</div>
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

export const GroupsScreen = ({ onNavigate, bp }) => {
  const { data: groups, isLoading, isError, refetch } = useGroups();

  return (
    <div className="fade-up">
      <div className="page-header" style={{ marginBlockEnd: 20 }}>
        <div className="label">MEATHUB — אירועי משלוח</div>
        <h1>קבוצות רכישה פעילות</h1>
        {!isLoading && !isError && (
          <div className="sub">{(groups || []).length} אירועים פתוחים</div>
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
                <th>אירוע / סניף</th>
                <th>עיר</th>
                <th>נותרו</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
              ) : (groups || []).length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-3)', fontSize: 14 }}>
                    אין אירועי משלוח פעילים כרגע
                  </td>
                </tr>
              ) : (
                (groups || []).map(g => (
                  <GroupRow key={g.id} group={g} onNavigate={onNavigate} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
