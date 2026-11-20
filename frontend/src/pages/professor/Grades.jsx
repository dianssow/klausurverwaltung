import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { get } from '../../api/client';
import { Badge, Notice, PageHeader, State } from '../../components/ui';
import { useLoad } from '../../hooks';
import { errMsg, fmtGrade, GRADE_VALUES } from '../../utils';


export default function Grades() {
  const { id } = useParams();
  const list = useLoad(() => get(`/api/professor/exams/${id}/registrations`), [id]);
  const [values, setValues] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = list.data ?? [];

  // Values initials 
  useEffect(() => {
    const init = {};
    rows.forEach((r) => {
      init[r.registrationId] = r.grade == null ? '' : fmtGrade(r.grade);
    });
    setValues(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.data]);

  const changed = rows.filter((r) => {
    const current = r.grade == null ? '' : fmtGrade(r.grade);
    return values[r.registrationId] && values[r.registrationId] !== current;
  });

  const save = async () => {
    setMsg(null);
    setBusy(true);
    try {
      await api.put(
        `/api/professor/exams/${id}/grades`,
        changed.map((r) => ({ registrationId: r.registrationId, value: Number(values[r.registrationId]) }))
      );
      setMsg({ kind: 'ok', text: `${changed.length} note(s) enregistrée(s).` });
      list.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Saisie des notes" sub="Seuls les étudiants angemeldet peuvent être notés, après la date de l'examen.">
        <Link className="btn btn-secondary" to="/professor/exams">Zurück zu den Prüfungen</Link>
      </PageHeader>

      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

      <div className="panel flush">
        <State loading={list.loading} error={list.error} empty={rows.length === 0} emptyText="Aucun inscrit pour cet examen." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Matrikelnummer</th><th>Name</th><th>Status</th><th>Note</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.registrationId}>
                    <td>{r.matrikelnummer}</td>
                    <td>{r.firstName} {r.lastName}</td>
                    <td><Badge status={r.status} /></td>
                    <td style={{ width: 150 }}>
                      <select
                        aria-label={`Note de ${r.firstName} ${r.lastName}`}
                        value={values[r.registrationId] ?? ''}
                        disabled={r.status !== 'ANGEMELDET'}
                        onChange={(e) => setValues((v) => ({ ...v, [r.registrationId]: e.target.value }))}
                      >
                        <option value="">–</option>
                        {GRADE_VALUES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <button className="btn btn-primary" onClick={save} disabled={busy || changed.length === 0}>
          {busy ? 'Wird gespeichert…' : `Noten speichern (${changed.length})`}
        </button>
      )}
    </>
  );
}
