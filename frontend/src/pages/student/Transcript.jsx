import { get } from '../../api/client';
import { PageHeader, State } from '../../components/ui';
import { useLoad } from '../../hooks';
import { fmtGrade } from '../../utils';

// Attendu : GET /api/student/transcript
//   -> { studentName, matrikelnummer, departmentName, studiengang,
//        entries: [{ moduleCode, moduleName, credits, grade, term, attempt }],
//        failedEntries: [ ...même forme... ],   (facultatif)
//        totalCredits, average }
function Rows({ items }) {
  return items.map((e, i) => (
    <tr key={`${e.moduleCode}-${e.term}-${i}`}>
      <td>{e.moduleCode}</td>
      <td>{e.moduleName}</td>
      <td>{e.term}</td>
      <td className="num">{e.attempt}</td>
      <td className="num">{e.credits}</td>
      <td className="num">{fmtGrade(e.grade)}</td>
    </tr>
  ));
}

const HEAD = (
  <thead>
    <tr><th>Code</th><th>Modul</th><th>Semester</th><th className="num">Versuch</th><th className="num">LP</th><th className="num">Note</th></tr>
  </thead>
);

export default function Transcript() {
  const { data: t, loading, error } = useLoad(() => get('/api/student/transcript'));
  const passed = t?.entries ?? [];
  const failed = t?.failedEntries ?? []; 

  return (
    <>
      <PageHeader title="Notenspiegel" sub="Modules réussis, crédits et moyenne.">
        {t && <button className="btn btn-secondary" onClick={() => window.print()}>Drucken</button>}
      </PageHeader>

      <State loading={loading} error={error} />

      {t && (
        <div className="sheet">
          <div className="sheet-head">
            <h2>{t.studentName ?? 'Notenspiegel'}</h2>
            <div className="sheet-meta">
              {t.matrikelnummer && <span>Matrikelnummer <strong>{t.matrikelnummer}</strong></span>}
              {t.studiengang && <span>Studiengang <strong>{t.studiengang}</strong></span>}
              {t.departmentName && <span>Fachbereich <strong>{t.departmentName}</strong></span>}
            </div>
          </div>

          <h3>Bestandene Module</h3>
          {passed.length === 0 ? (
            <p className="muted pad">Bisher keine Module bestanden.</p>
          ) : (
            <div className="table-wrap">
              <table>
                {HEAD}
                <tbody><Rows items={passed} /></tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4}>Gesamt · gewichteter Durchschnitt {fmtGrade(t.average)}</td>
                    <td className="num">{t.totalCredits ?? 0}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {failed.length > 0 && (
            <>
              <h3>Nicht bestandene Prüfungsversuche</h3>
              <div className="table-wrap">
                <table>
                  {HEAD}
                  <tbody><Rows items={failed} /></tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
