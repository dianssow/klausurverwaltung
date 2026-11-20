import { useState } from 'react';
import api, { get } from '../../api/client';
import { Field, Notice, PageHeader, State, TempPassword } from '../../components/ui';
import { useForm, useLoad } from '../../hooks';
import { asList, errMsg } from '../../utils';

const EMPTY = { email: '', firstName: '', lastName: '', matrikelnummer: '', departmentId: '', studiengang: '', currentSemester: 1 };

export default function Students() {
  const depts = useLoad(() => get('/api/admin/departments'));
  const list = useLoad(() => get('/api/admin/students'));
  const [form, bind, reset] = useForm(EMPTY);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);
  const [q, setQ] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setCreated(null);
    try {
      const { data } = await api.post('/api/admin/students', {
        ...form,
        departmentId: Number(form.departmentId),
        currentSemester: Number(form.currentSemester),
      });
      setCreated(data);
      reset();
      list.reload();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const departments = asList(depts.data).filter((d) => d.active !== false);
  const rows = asList(list.data).filter((s) =>
    `${s.firstName} ${s.lastName} ${s.matrikelnummer} ${s.email ?? ''}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Étudiants" sub="Un mot de passe temporaire est généré à la création du compte." />

      <TempPassword account={created} onClose={() => setCreated(null)} />

      <form className="panel" onSubmit={submit}>
        <h2>Neue studierende Person</h2>
        <Notice kind="error">{error}</Notice>
        <div className="form-grid">
          <Field label="Adresse e-mail"><input type="email" {...bind('email')} required /></Field>
          <Field label="Prénom"><input {...bind('firstName')} required /></Field>
          <Field label="Nom"><input {...bind('lastName')} required /></Field>
          <Field label="Matrikelnummer"><input {...bind('matrikelnummer')} required /></Field>
          <Field label="Département">
            <select {...bind('departmentId')} required>
              <option value="">Bitte auswählen…</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Studiengang"><input {...bind('studiengang')} required /></Field>
          <Field label="Semestre actuel"><input type="number" min="1" {...bind('currentSemester')} required /></Field>
        </div>
        <button className="btn btn-primary">Konto erstellen</button>
      </form>

      <div className="panel flush">
        <div className="panel-title">
          Vorhandene Studierende
          <input className="search" placeholder="Nom ou Matrikelnummer…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <State loading={list.loading} error={list.error} empty={rows.length === 0} emptyText="Aucun étudiant trouvé." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Matrikelnummer</th><th>Name</th><th>E-Mail</th><th>Fachbereich</th><th>Studiengang</th><th className="num">Sem.</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>{s.matrikelnummer}</td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.email ?? '–'}</td>
                    <td>{s.departmentName ?? '–'}</td>
                    <td>{s.studiengang}</td>
                    <td className="num">{s.currentSemester}</td>
                    <td>{s.active === false ? 'Inaktiv' : 'Aktiv'}</td>
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
