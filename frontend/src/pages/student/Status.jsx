import { get } from '../../api/client';
import { PageHeader, State } from '../../components/ui';
import { useLoad } from '../../hooks';
import { fmtGrade } from '../../utils';

// Result: GET /api/student/status
//   -> { departmentName, studiengang, currentSemester, earnedCredits,
//        average, registeredCount, deregisteredCount, failedAttempts }
export default function Status() {
  const { data: s, loading, error } = useLoad(() => get('/api/student/status'));

  return (
    <>
      <PageHeader title="Mon statut" sub="Ta situation actuelle dans ton cursus." />
      <div className="panel flush" style={{ maxWidth: 560 }}>
        <State loading={loading} error={error} />
        {s && (
          <dl className="facts">
            <div className="key"><dt>Erworbene Leistungspunkte (LP)</dt><dd>{s.earnedCredits ?? 0}</dd></div>
            <div className="key"><dt>Gewichteter Durchschnitt</dt><dd>{fmtGrade(s.average)}</dd></div>
            <div><dt>Fachbereich</dt><dd>{s.departmentName ?? '–'}</dd></div>
            <div><dt>Studiengang</dt><dd>{s.studiengang ?? '–'}</dd></div>
            <div><dt>Aktuelles Semester</dt><dd>{s.currentSemester}</dd></div>
            <div><dt>Angemeldete Prüfungen</dt><dd>{s.registeredCount ?? 0}</dd></div>
            <div><dt>Abgemeldete Prüfungen</dt><dd>{s.deregisteredCount ?? 0}</dd></div>
            <div><dt>Nicht bestandene Prüfungsversuche</dt><dd>{s.failedAttempts ?? 0}</dd></div>
          </dl>
        )}
      </div>
    </>
  );
}
