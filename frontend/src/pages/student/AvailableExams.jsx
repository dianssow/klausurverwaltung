import { useState } from 'react';
import api, { get } from '../../api/client';
import { Badge, Notice, PageHeader, State } from '../../components/ui';
import { useLoad } from '../../hooks';
import { errMsg, fmtDate } from '../../utils';

export default function AvailableExams() {
  const exams = useLoad(() => get('/api/student/exams/available'));
  const regs = useLoad(() => get('/api/student/registrations'));
  const [msg, setMsg] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const rows = exams.data ?? [];
  const registeredIds = new Set(
    (regs.data ?? []).filter((r) => r.status === 'ANGEMELDET').map((r) => r.examId)
  );

  const register = async (e) => {
    setMsg(null);
    setBusyId(e.id);
    try {
      await api.post('/api/student/registrations', { examId: e.id });
      setMsg({ kind: 'ok', text: `Inscription enregistrée pour ${e.moduleCode} (${e.term}).` });
      exams.reload();
      regs.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Examens ouverts" sub="Examens de ton département dont les inscriptions sont encore ouvertes." />

      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

      <div className="panel flush">
        <State loading={exams.loading} error={exams.error} empty={rows.length === 0} emptyText="Aucun examen ouvert pour le moment." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Modul</th><th>Semester</th><th>Datum</th><th>Raum</th><th>Anmeldung bis</th><th className="num">Plätze</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((e) => {
                  const mine = registeredIds.has(e.id);
                  const full = e.maxParticipants && e.registeredCount >= e.maxParticipants;
                  return (
                    <tr key={e.id}>
                      <td><strong>{e.moduleCode}</strong><br /><span className="muted">{e.moduleName}</span></td>
                      <td>{e.term}</td>
                      <td>{fmtDate(e.examDate)}</td>
                      <td>{e.examRoom || '–'}</td>
                      <td>{fmtDate(e.registrationDeadline)}</td>
                      <td className="num">{e.maxParticipants ? `${e.registeredCount} / ${e.maxParticipants}` : 'unbegrenzt'}</td>
                      <td>
                        {mine ? (
                          <Badge status="ANGEMELDET" />
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={busyId === e.id || full}
                            onClick={() => register(e)}
                          >
                            {full ? 'Ausgebucht' : 'Anmelden'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
