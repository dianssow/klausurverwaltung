import { useState } from 'react';
import api, { get } from '../../api/client';
import { Badge, Notice, PageHeader, State } from '../../components/ui';
import { useLoad } from '../../hooks';
import { errMsg, fmtDate } from '../../utils';

const TABS = [
  ['ALL', 'Toutes'],
  ['ANGEMELDET', 'Angemeldet'],
  ['ABGEMELDET', 'Abgemeldet'],
];

export default function MyRegistrations() {
  const regs = useLoad(() => get('/api/student/registrations'));
  const [tab, setTab] = useState('ALL');
  const [msg, setMsg] = useState(null);

  const all = regs.data ?? [];
  const rows = tab === 'ALL' ? all : all.filter((r) => r.status === tab);

  const deregister = async (r) => {
    if (!window.confirm(`Se désinscrire de ${r.moduleCode} (${r.term}) ?`)) return;
    setMsg(null);
    try {
      await api.delete(`/api/student/registrations/${r.id}`);
      setMsg({ kind: 'ok', text: `Désinscription effectuée pour ${r.moduleCode}.` });
      regs.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    }
  };

  return (
    <>
      <PageHeader title="Mes inscriptions" sub="Tes Anmeldungen et Abmeldungen aux examens." />

      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

      <div className="panel flush">
        <div className="panel-title">
          <div className="tabs" role="tablist">
            {TABS.map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                className={`tab ${tab === key ? 'active' : ''}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <State loading={regs.loading} error={regs.error} empty={rows.length === 0} emptyText="Aucune inscription dans cette catégorie." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Modul</th><th>Semester</th><th>Prüfungsdatum</th><th className="num">LP</th><th>Status</th><th>Angemeldet am</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.moduleCode}</strong><br /><span className="muted">{r.moduleName}</span></td>
                    <td>{r.term}</td>
                    <td>{fmtDate(r.examDate)}</td>
                    <td className="num">{r.credits}</td>
                    <td><Badge status={r.status} /></td>
                    <td>{fmtDate(r.registeredAt)}</td>
                    <td>
                      {r.status === 'ANGEMELDET' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => deregister(r)}>Abmelden</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
